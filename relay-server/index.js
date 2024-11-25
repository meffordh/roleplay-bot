import { WebSocketServer } from 'ws';
import { RealtimeClient } from '../src/lib/realtime-api-beta/index.js';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);
const isProd = process.env.NODE_ENV === 'production';

class RealtimeRelay {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required');
    }
    this.apiKey = apiKey;
    this.sockets = new WeakMap();
    this.wss = null;
    this.connectionHandler = this.connectionHandler.bind(this);
    this.debug = true;
  }

  async connectionHandler(ws, req) {
    if (!req.url) {
      this.log('No URL provided, closing connection.');
      ws.close();
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const model =
      url.searchParams.get('model') || 'gpt-4o-realtime-preview-2024-10-01';

    if (pathname !== '/ws') {
      this.log(`Invalid pathname: "${pathname}"`);
      ws.close();
      return;
    }

    // Add error handling for WebSocket connection
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.log(`WebSocket error: ${error.message}`);
      ws.close();
    });

    // Instantiate new client with model parameter
    this.log(
      `Connecting with key "${this.apiKey.slice(0, 3)}..." and model "${model}"`,
    );
    const client = new RealtimeClient({
      apiKey: this.apiKey,
      model: model,
    });

    // Relay: OpenAI Realtime API Event -> Browser Event
    client.realtime.on('server.*', (event) => {
      this.log(`Relaying "${event.type}" to Client`);
      ws.send(JSON.stringify(event));
    });

    client.realtime.on('close', () => ws.close());

    // Relay: Browser Event -> OpenAI Realtime API Event
    const messageQueue = [];
    const messageHandler = (data) => {
      try {
        const event = JSON.parse(data);
        this.log(`Relaying "${event.type}" to OpenAI`);
        client.realtime.send(event.type, event);
      } catch (e) {
        console.error(e.message);
        this.log(`Error parsing event from client: ${data}`);
      }
    };

    ws.on('message', (data) => {
      if (!client.isConnected()) {
        messageQueue.push(data);
      } else {
        messageHandler(data);
      }
    });

    ws.on('close', () => client.disconnect());

    // Connect to OpenAI Realtime API
    try {
      this.log(`Connecting to OpenAI...`);
      await client.connect();
    } catch (e) {
      this.log(`Error connecting to OpenAI: ${e.message}`);
      ws.close();
      return;
    }

    this.log(`Connected to OpenAI successfully!`);
    while (messageQueue.length) {
      messageHandler(messageQueue.shift());
    }
  }

  listen(port) {
    // Add CORS middleware with more specific origins in production
    app.use((req, res, next) => {
      const allowedOrigins = isProd
        ? ['https://' + process.env.REPL_SLUG + '.replit.app']
        : ['*'];

      const origin = req.headers.origin;
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
      }
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    });

    // Serve static files from the build directory
    app.use(express.static('build'));

    // Health check endpoints
    app.get('/ws', (req, res) => {
      res.send('WebSocket endpoint ready');
    });

    app.get('/', (req, res) => {
      res.send('Relay server running');
    });

    app.get('/health', (req, res) => {
      res.send('OK');
    });

    // Initialize WebSocket server with enhanced configuration
    this.wss = new WebSocketServer({
      server,
      path: '/ws',
      perMessageDeflate: false,
      maxPayload: 64 * 1024 * 1024, // 64MB
      clientTracking: true,
    });

    this.wss.on('connection', this.connectionHandler);

    // Add error handling for the server
    server.on('error', (error) => {
      console.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.log(`Port ${port} is in use, retrying...`);
        setTimeout(() => {
          server.close();
          server.listen(port, '0.0.0.0');
        }, 1000);
      }
    });

    // Add error handling for the WebSocket server
    this.wss.on('error', (error) => {
      console.error('WebSocket server error:', error);
    });

    // Start the server with enhanced logging
    const startServer = () => {
      try {
        server.listen(port, '0.0.0.0', () => {
          this.log(
            `Relay server listening on port ${port} in ${isProd ? 'production' : 'development'} mode`,
          );
          this.log(`WebSocket server path: ${this.wss.options.path}`);
          this.log(
            `Server address: ${server.address().address}:${server.address().port}`,
          );
        });
      } catch (error) {
        console.error('Failed to start server:', error);
        setTimeout(startServer, 5000);
      }
    };

    startServer();
  }

  log(...args) {
    const date = new Date().toISOString();
    const logs = [`[Websocket/${date}]`].concat(args).map((arg) => {
      if (typeof arg === 'object' && arg !== null) {
        return JSON.stringify(arg, null, 2);
      } else {
        return arg;
      }
    });
    if (this.debug) {
      console.log(...logs);
    }
    return true;
  }
}

// Use environment port or fallback to 8081
const PORT = process.env.PORT || 8081;
const relay = new RealtimeRelay(process.env.OPENAI_API_KEY);

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Add error handling for port in use
try {
  relay.listen(PORT);
} catch (error) {
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Trying alternative port...`);
    relay.listen(0); // This will use a random available port
  } else {
    console.error('Failed to start relay server:', error);
    process.exit(1);
  }
}
