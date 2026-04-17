import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

// AI Studio injection
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "AIzaSy_mock_key" });

// ==========================================
// IN-MEMORY DATABASE (Sandbox Fallback)
// Ensures the E2E flow works immediately
// ==========================================
const db = {
  conversations: [
    { id: 1, name: 'Marco Rossi', platform: 'whatsapp', color: 'bg-[#25D366]', lastMsg: "AI Reply: I've scheduled your demo...", time: '2m', unread: true },
    { id: 2, name: 'Crypto Partner', platform: 'telegram', color: 'bg-[#0088cc]', lastMsg: 'Proposal attached regarding Q4...', time: '15m', unread: true },
    { id: 3, name: 'Sarah Jenkins', platform: 'email', color: 'bg-[#EA4335]', lastMsg: 'Pending ticket support...', time: '1h', unread: false }
  ],
  messages: [
    { id: 101, conversation_id: 1, content: "Hi, I'm interested in the enterprise plan. Can we schedule a demo for next week?", sender_type: "contact", created_at: new Date(Date.now() - 60000).toISOString() },
    { id: 102, conversation_id: 1, content: "Hello Marco! We'd love to show you the enterprise features. I've sent a calendar link to your email so you can pick a time.", sender_type: "bot", created_at: new Date(Date.now() - 30000).toISOString() }
  ],
  leads: [
    { id: 1, name: 'Tech Solutions Inc', contact: 'John Carter', value: '$45,000', stage: 'awareness', tags: ['Enterprise', 'B2B'] },
    { id: 2, name: 'Stark Industries', contact: 'Tony S.', value: '$120,000', stage: 'decision', tags: ['VIP', 'Defense'] },
    { id: 3, name: 'Wayne Enterprises', contact: 'Bruce W.', value: '$85,000', stage: 'negotiation', tags: ['Corporate'] },
    { id: 4, name: 'Acme Corp', contact: 'Road R.', value: '$12,500', stage: 'awareness', tags: ['SMB'] }
  ],
  campaigns: [
    { id: 1, name: 'Black Friday SaaS Run', audience: 'awareness', status: 'completed', sent: 1450, opens: 890, replies: 120, created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 2, name: 'Q4 Enterprise Upsell', audience: 'decision', status: 'draft', sent: 0, opens: 0, replies: 0, created_at: new Date().toISOString() }
  ]
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // --- API LAYER ---

  // Health
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));

  // Campaigns
  app.get("/api/campaigns", (req, res) => {
    res.json({ data: db.campaigns });
  });

  app.post("/api/campaigns", (req, res) => {
    const { name, audience, message } = req.body;
    
    // Create new campaign
    const newCampaign = {
      id: Date.now(),
      name: name || 'Untitled Campaign',
      audience: audience || 'all',
      status: 'sending',
      sent: Math.floor(Math.random() * 500) + 100, // mock metrics
      opens: 0,
      replies: 0,
      created_at: new Date().toISOString(),
      message
    };
    
    // Move from sending to completed after a delay (mocking the background job)
    setTimeout(() => {
      const idx = db.campaigns.findIndex(c => c.id === newCampaign.id);
      if (idx !== -1) {
        db.campaigns[idx].status = 'completed';
        db.campaigns[idx].opens = Math.floor(db.campaigns[idx].sent * 0.4);
      }
    }, 5000);

    db.campaigns.unshift(newCampaign);
    res.json({ success: true, data: newCampaign });
  });

  // Conversations (Inbox Flow)
  app.get("/api/conversations", (req, res) => {
    res.json({ data: db.conversations });
  });

  // Messages
  app.get("/api/conversations/:id/messages", (req, res) => {
    const threadMsgs = db.messages.filter(m => m.conversation_id === parseInt(req.params.id));
    res.json({ data: threadMsgs });
  });

  // Send Message (AI Flow Trigger)
  app.post("/api/messages", async (req, res) => {
    const { conversation_id, content, sender_type } = req.body;
    
    // Save human input
    const newMessage = {
      id: Date.now(),
      conversation_id: parseInt(conversation_id),
      content,
      sender_type: sender_type || 'contact',
      created_at: new Date().toISOString()
    };
    db.messages.push(newMessage);
    
    // Update thread "lastMsg"
    const convo = db.conversations.find(c => c.id === parseInt(conversation_id));
    if (convo) convo.lastMsg = content;

    let aiResponseText = null;

    // AI Auto-Reply simple engine
    if (sender_type === 'contact') {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are an AI assistant for a SaaS business. A customer just said: "${content}". Write a very short, polite, 1-2 sentence reply addressing them.`,
        });
        
        aiResponseText = response.text;
        
        // Save AI reply
        const aiMessage = {
          id: Date.now() + 1,
          conversation_id: parseInt(conversation_id),
          content: aiResponseText,
          sender_type: 'bot',
          created_at: new Date().toISOString()
        };
        db.messages.push(aiMessage);
        if (convo) convo.lastMsg = `AI Reply: ${aiResponseText.substring(0,25)}...`;

      } catch (err) {
        console.error("AI Generation Error:", err);
        // Fallback if API key fails
        aiResponseText = "Thanks for your message. An agent will be with you shortly.";
        db.messages.push({
          id: Date.now() + 1,
          conversation_id: parseInt(conversation_id),
          content: aiResponseText,
          sender_type: 'bot',
          created_at: new Date().toISOString()
        });
      }
    }

    res.json({ success: true, ai_reply: aiResponseText });
  });

  // CRM Leads
  app.get("/api/leads", (req, res) => {
    res.json({ data: db.leads });
  });

  // Update Lead Stage
  app.put("/api/leads/:id", (req, res) => {
    const { stage } = req.body;
    const lead = db.leads.find(l => l.id === parseInt(req.params.id));
    if (lead) {
      lead.stage = stage;
      res.json({ success: true, lead });
    } else {
      res.status(404).json({ error: "Lead not found" });
    }
  });

  // --- Vite Middleware for Development ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // --- Start Server ---
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
