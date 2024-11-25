import { ErrorBoundary } from './components/ErrorBoundary';
import { ConsolePage } from './pages/ConsolePage';
import './App.scss';

function App() {
  return (
    <ErrorBoundary>
      <ConsolePage />
    </ErrorBoundary>
  );
}

export default App;
