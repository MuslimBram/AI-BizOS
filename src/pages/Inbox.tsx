import { apiFetch } from '../lib/api';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Search, Filter, MoreVertical, Phone, Video, Info, Send, Bot, Paperclip, Smile, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Inbox() {
  const [threads, setThreads] = useState<any[]>([]);
  const [activeThread, setActiveThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeThread) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const uploadRes = await apiFetch('/api/upload', {
        method: 'POST',
        headers: {
          // Do NOT set Content-Type here; browser sets it with appropriate boundary for FormData
        },
        body: formData
      });
      const uploadData = await uploadRes.json();
      
      if (uploadData.success && uploadData.file) {
        // Now send a message with the attachment link
        const fileUrl = uploadData.file.file_path;
        await apiFetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversation_id: activeThread.id,
              content: `Attached File: ${uploadData.file.original_name}\n${window.location.origin}${fileUrl}`,
              sender_type: 'contact'
            })
        });
      }
    } catch (e) {
      console.error("Upload failed", e);
    } finally {
      setIsUploading(false);
      event.target.value = ''; // Reset input
    }
  };

  useEffect(() => {
    // 1. WebSocket Setup
    const wsId = localStorage.getItem('active_workspace_id') || 'ws-bizos-001';
    const socket = io({ query: { workspaceId: wsId } });

    socket.on('new_message', (msg: any) => {
      // If it's for the currently active thread, append to the UI immediately
      setMessages(prev => {
        if (prev.find(m => m.id === msg.id || (m.tempId && m.content === msg.content))) return prev; // Dedupe
        if (msg.conversation_id === activeThread?.id) {
          return [...prev, msg];
        }
        return prev;
      });

      // Also refresh the threads list to show the latest snippet
      apiFetch('/api/conversations')
        .then(res => res.json())
        .then(data => setThreads(data.data || []));
    });

    // 2. Fetch Initial Threads
    apiFetch('/api/conversations')
      .then(res => res.json())
      .then(data => {
        setThreads(data.data || []);
        if (data.data?.length > 0 && !activeThread) setActiveThread(data.data[0]);
      });

    return () => {
      socket.disconnect();
    };
  }, [activeThread?.id]);

  useEffect(() => {
    if (activeThread?.id) {
      apiFetch(`/api/conversations/${activeThread.id}/messages`)
        .then(res => res.json())
        .then(data => setMessages(data.data || []));
    }
  }, [activeThread?.id]);

  const handleSend = async () => {
    if (!input.trim() || !activeThread) return;
    
    setIsSending(true);
    const content = input;
    setInput('');
    
    // Optimistic UI
    const tempId = Date.now();
    setMessages(prev => [...prev, { id: tempId, content, sender_type: 'contact', created_at: new Date().toISOString() }]);

    try {
      const res = await apiFetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: activeThread.id,
          content,
          sender_type: 'contact'
        })
      });
      const data = await res.json();
      
      // Reload messages to get the human confirmation & AI reply
      const msgsRes = await apiFetch(`/api/conversations/${activeThread.id}/messages`);
      const msgsData = await msgsRes.json();
      setMessages(msgsData.data || []);
      
      // Refresh thread list to update 'lastMsg' snippet
      const ctxRes = await apiFetch('/api/conversations');
      const ctxData = await ctxRes.json();
      setThreads(ctxData.data || []);
      
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-full border-t border-border/50 bg-background overflow-hidden relative">
      {/* Left Sidebar - Thread List */}
      <div className="w-80 flex-col border-r border-border/50 bg-card/30 hidden md:flex shrink-0">
        <div className="h-14 flex items-center justify-between px-4 border-b border-border/50 shrink-0">
          <h3 className="text-sm font-semibold">Messages</h3>
          <div className="flex gap-2">
             <button className="text-muted-foreground hover:text-foreground"><Search className="w-4 h-4" /></button>
             <button className="text-muted-foreground hover:text-foreground"><Filter className="w-4 h-4" /></button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {threads.map(thread => (
              <div 
                key={thread.id} 
                onClick={() => setActiveThread(thread)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${activeThread?.id === thread.id ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-muted/50 border-l-2 border-transparent'}`}
              >
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${thread.name}`} />
                    <AvatarFallback>{thread.name.substring(0,2)}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ${thread.color} border-2 border-background flex items-center justify-center`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`text-sm truncate ${thread.unread ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>{thread.name}</span>
                    <span className={`text-[10px] ${thread.unread ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{thread.time}</span>
                  </div>
                  <div className={`text-xs truncate ${thread.unread ? 'font-medium text-foreground/90' : 'text-muted-foreground'}`}>
                    {thread.lastMsg}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background min-w-0">
        {activeThread ? (
          <>
            <div className="h-14 flex items-center justify-between px-4 border-b border-border/50 shrink-0">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeThread.name}`} />
                  <AvatarFallback>{activeThread.name.substring(0,2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    {activeThread.name}
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${activeThread.platform === 'whatsapp' ? 'bg-[#25D366]/20 text-[#25D366]' : 'bg-primary/20 text-primary'}`}>
                      {activeThread.platform}
                    </span>
                  </h3>
                  <div className="text-[10px] text-success flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success"></span> Online
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <Phone className="w-4 h-4 cursor-pointer hover:text-foreground" />
                <Video className="w-4 h-4 cursor-pointer hover:text-foreground" />
                <Info className="w-4 h-4 cursor-pointer hover:text-foreground" />
                <MoreVertical className="w-4 h-4 cursor-pointer hover:text-foreground" />
              </div>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4 bg-grid-white/[0.02] relative">
              <div className="space-y-6 max-w-3xl mx-auto pb-4">
                <div className="text-center text-[10px] text-muted-foreground my-4 font-medium uppercase tracking-wider">Conversation History</div>
                
                {messages.map((msg, i) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.sender_type === 'bot' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="w-6 h-6 mt-1 shrink-0">
                      {msg.sender_type === 'bot' ? (
                         <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                      ) : (
                         <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeThread.name}`} />
                      )}
                    </Avatar>
                    <div className={`${msg.sender_type === 'bot' ? 'bg-primary/20 border border-primary/30 rounded-tr-sm' : 'bg-muted rounded-tl-sm'} p-3 rounded-2xl text-sm text-foreground max-w-[80%] shadow-sm relative`}>
                      {msg.sender_type === 'bot' && (
                        <div className="absolute -top-2.5 right-2 flex items-center gap-1 bg-background border border-border/50 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-primary shadow-sm">
                          <Bot className="w-3 h-3" /> Auto-Reply
                        </div>
                      )}
                      {msg.content}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-auto">
                      {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                ))}
                
                {isSending && (
                  <div className="flex gap-3 flex-row-reverse opacity-50">
                     <Avatar className="w-6 h-6 mt-1 shrink-0"><AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback></Avatar>
                     <div className="bg-primary/20 p-3 rounded-2xl text-sm max-w-[80%] shadow-sm flex items-center justify-center min-w-[50px]">
                       <Loader2 className="w-4 h-4 animate-spin text-primary" />
                     </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 bg-background border-t border-border/50 shrink-0">
              <div className="max-w-3xl mx-auto bg-muted/30 border border-border/60 rounded-xl p-2 focus-within:border-primary/50 focus-within:bg-muted/50 transition-colors shadow-sm">
                <textarea 
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  disabled={isSending}
                  placeholder="Type a message or use / for AI commands..." 
                  className="w-full bg-transparent resize-none outline-none text-sm p-2 text-foreground placeholder:text-muted-foreground min-h-[40px] max-h-[120px]"
                />
                <div className="flex justify-between items-center px-2 mt-2">
                  <div className="flex gap-3 text-muted-foreground relative">
                    <label className="hover:text-foreground transition-colors cursor-pointer">
                      <Paperclip className="w-4 h-4" />
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileUpload}
                        disabled={isUploading || isSending}
                      />
                    </label>
                    <button className="hover:text-foreground transition-colors"><Smile className="w-4 h-4" /></button>
                    <button className="flex items-center gap-1 text-[11px] font-medium bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition-colors">
                      <Bot className="w-3 h-3" /> AI Suggest
                    </button>
                    {isUploading && <span className="text-[10px] absolute -top-5 left-0 text-success">Uploading...</span>}
                  </div>
                  <button 
                    onClick={handleSend}
                    disabled={isSending || !input.trim()}
                    className="bg-primary text-primary-foreground w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">Select a thread to view</div>
        )}
      </div>
    </div>
  );
}
