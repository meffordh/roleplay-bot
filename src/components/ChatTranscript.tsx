import { ScrollArea } from './ui/scroll-area';
import { ItemType } from '../lib/realtime-api-beta/dist/lib/client.js';
import { X } from 'react-feather';

interface ChatTranscriptProps {
  items: ItemType[];
  onDeleteItem: (id: string) => void;
}

export function ChatTranscript({ items, onDeleteItem }: ChatTranscriptProps) {
  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="space-y-8 p-6">
          {items.map((item, index) => {
            const isUser = item.role === 'user';
            const content = isUser 
              ? (item.formatted.transcript || 
                 (item.formatted.audio?.length ? '(awaiting transcript)' : item.formatted.text))
              : (item.formatted.transcript || item.formatted.text);

            return (
              <div key={index} className={`flex gap-4 group ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] space-y-2 relative ${isUser ? "text-right" : "text-left"}`}>
                  <div className="flex items-center gap-2">
                    {!isUser && <span className="text-sm text-muted-foreground">The Patient</span>}
                    {isUser && <span className="text-sm text-muted-foreground">You</span>}
                  </div>
                  <div className={`px-4 py-2.5 ${isUser ? "bg-purple-50 border border-purple-100" : "bg-gray-50 border border-gray-100"}`}>
                    <p className="text-sm">{content}</p>
                  </div>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="absolute -right-8 top-0 p-1 rounded-full bg-gray-400 hover:bg-gray-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}