import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { useAIChat } from "@/hooks/use-ai";

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: 'مرحباً! أنا المساعد الذكي. كيف يمكنني مساعدتك في رفع الشواهد والمؤشرات اليوم؟' }
  ]);
  const [input, setInput] = useState("");
  const chatMutation = useAIChat();

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    
    try {
      const res = await chatMutation.mutateAsync(userMsg);
      setMessages(prev => [...prev, { role: 'ai', content: res.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: 'عذراً، حدث خطأ في الاتصال.' }]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 start-6 w-14 h-14 rounded-full shadow-2xl hover:shadow-primary/40 hover-elevate z-50 bg-gradient-to-tr from-primary to-accent"
        >
          <Bot className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <Card className="fixed bottom-6 start-6 w-80 sm:w-96 h-[500px] shadow-2xl z-50 flex flex-col border-primary/20 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent p-4 text-primary-foreground flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-full">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-bold">المساعد الذكي</h3>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-muted/10">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-br-sm' 
                    : 'bg-muted border border-border rounded-bl-sm text-foreground'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-muted border border-border p-3 rounded-2xl rounded-bl-sm flex gap-1">
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-background border-t">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اكتب سؤالك هنا..."
                className="rounded-full bg-muted/50 border-transparent focus-visible:ring-primary/20"
                disabled={chatMutation.isPending}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="rounded-full shrink-0"
                disabled={chatMutation.isPending || !input.trim()}
              >
                <Send className="w-4 h-4 rtl:rotate-180" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
}
