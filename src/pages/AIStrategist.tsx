import { useState, useEffect, useRef } from 'react';
import { Send, Bot, BrainCircuit, Loader2, Target, BarChart, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Markdown from 'react-markdown';

export function AIStrategist() {
  const [messages, setMessages] = useState<any[]>([
    { 
      id: 1, 
      role: 'bot', 
      content: "Hello. I'm your AI Business Strategist. I have context on your CRM leads, recent campaigns, and incoming messages. What should we strategize today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMessage = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/strategist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage.content,
          previousMessages: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'bot', 
        content: data.ai_reply 
      }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'bot', 
        content: "I experienced a network disruption. Please check the console." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const STRATEGIES = [
    { title: "Analyze CRM Pipeline", prompt: "Can you analyze our current CRM pipeline and tell me where the bottlenecks are?" },
    { title: "Draft Upsell Campaign", prompt: "Draft a Q4 upsell campaign targeting 'Decision' stage leads." },
    { title: "Review Churn Risks", prompt: "What are the common indicators of churn based on our recent missed calls?" }
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">AI Business Strategist</h2>
            <div className="text-[10px] text-primary flex items-center gap-1 font-medium tracking-wide">
              <Sparkles className="w-3 h-3" /> GEMINI 2.5 FLASH CONNECTED
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <div className="flex-1 overflow-y-auto p-4 bg-grid-white/[0.02]" ref={scrollRef}>
          <div className="max-w-4xl mx-auto space-y-6 pb-6">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="w-8 h-8 shrink-0 border border-border/50 shadow-sm">
                  {msg.role === 'bot' ? (
                    <AvatarFallback className="bg-primary/20 text-primary border border-primary/30"><Bot className="w-4 h-4" /></AvatarFallback>
                  ) : (
                    <AvatarFallback className="bg-muted text-foreground">Me</AvatarFallback>
                  )}
                </Avatar>
                
                <div className={`p-4 rounded-xl text-sm max-w-[85%] shadow-sm ${msg.role === 'bot' ? 'bg-card border border-border/50' : 'bg-primary text-primary-foreground'} `}>
                  {msg.role === 'bot' ? (
                    <div className="markdown-body text-sm leading-relaxed text-foreground/90">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4">
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="bg-primary/20 text-primary"><Bot className="w-4 h-4" /></AvatarFallback>
                </Avatar>
                <div className="bg-card border border-border/50 p-4 rounded-xl shadow-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" /> Analyzing business context...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm shrink-0">
          <div className="max-w-4xl mx-auto">
            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {STRATEGIES.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => { setInput(s.prompt); }}
                    className="text-[11px] bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors border border-border/50 px-3 py-1.5 rounded-full flex items-center gap-1.5"
                  >
                    {i === 0 ? <BarChart className="w-3 h-3" /> : i === 1 ? <Target className="w-3 h-3" /> : <BrainCircuit className="w-3 h-3" />}
                    {s.title}
                  </button>
                ))}
              </div>
            )}
            
            <div className="bg-muted/30 border border-border/60 rounded-xl p-2 focus-within:border-primary/50 focus-within:bg-muted/50 transition-colors shadow-sm flex items-end gap-2">
              <textarea 
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                disabled={isTyping}
                placeholder="Ask your AI Strategist about sales, metrics, or generate marketing copy..." 
                className="flex-1 bg-transparent resize-none outline-none text-sm p-2 text-foreground placeholder:text-muted-foreground min-h-[44px] max-h-[200px]"
              />
              <Button 
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 w-11 shrink-0 rounded-lg shadow-sm"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </Button>
            </div>
            <div className="text-center text-[10px] text-muted-foreground mt-2">
              AI Strategist can make mistakes. Consider verifying critical business data independently.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
