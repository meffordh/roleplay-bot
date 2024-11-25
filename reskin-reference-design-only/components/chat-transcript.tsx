import { ScrollArea } from "@/components/ui/scroll-area"

export function ChatTranscript() {
  return (
    <ScrollArea className="h-full px-6">
      <div className="space-y-8 py-6">
        {[
          { role: "User", content: "Hello! I'm here for my appointment." },
          { role: "The Patient", content: "Yes, thank you for seeing me today. I've been feeling quite anxious lately..." },
          { role: "User", content: "I'm sorry to hear that. Can you tell me more about when you started noticing these feelings of anxiety?" },
          { role: "The Patient", content: "Well, it's been gradually building up over the past few months. I'd say it started becoming noticeable about three months ago. At first, I thought it was just stress from work, but it seems to be affecting other areas of my life now." },
        ].map((message, index) => (
          <div key={index} className={`flex gap-4 ${message.role === "User" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] space-y-2 ${message.role === "User" ? "text-right" : "text-left"}`}>
              <div className="flex items-center gap-2">
                {message.role !== "User" && <span className="text-sm text-muted-foreground">{message.role}</span>}
                {message.role === "User" && <span className="text-sm text-muted-foreground">{message.role}</span>}
              </div>
              <div className={`px-4 py-2.5 ${message.role === "User" ? "bg-purple-50 border border-purple-100" : "bg-gray-50 border border-gray-100"}`}>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

