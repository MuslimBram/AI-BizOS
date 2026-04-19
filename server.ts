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
  ],
  calls: [
    { id: 1, contact: 'Sarah Jenkins', type: 'inbound', duration: '04:12', status: 'completed', transcript: 'Customer inquired about the enterprise plan pricing.', ai_summary: 'Interested in enterprise. Need to send proposal.', time: '1h ago' },
    { id: 2, contact: 'Michael Chang', type: 'outbound', duration: '12:05', status: 'completed', transcript: 'Discussed Q4 deliverables and timeline.', ai_summary: 'Project on track. Next sync next Tuesday.', time: '2h ago' },
    { id: 3, contact: 'Unknown Caller', type: 'missed', duration: '00:00', status: 'missed', transcript: '', ai_summary: '', time: '3h ago' }
  ],
  automations: [
    { id: 1, name: 'Initial Welcome Message', trigger: 'New Conversation', action: 'Send Text: "Hi! How can we help?"', status: 'active', executions: 1240 },
    { id: 2, name: 'High-Intent Tagging', trigger: 'Keyword: "pricing"', action: 'Add Tag: "hot-lead"', status: 'active', executions: 85 }
  ],
  tickets: [
    { id: 101, subject: 'Increase API Rate Limits', status: 'open', priority: 'high', user: 'admin@bizos.test', created_at: '2 hours ago' },
    { id: 102, subject: 'WhatsApp channel disconnecting', status: 'resolved', priority: 'medium', user: 'admin@bizos.test', created_at: '1 day ago' }
  ],
  billing: {
    plan: 'enterprise',
    status: 'active',
    billing_cycle: 'monthly',
    renewal_date: new Date(Date.now() + 86400000 * 24).toISOString(), // 24 days left
    usage: {
      team_members: { used: 4, limit: 10 },
      contacts: { used: 12400, limit: 50000 },
      ai_words: { used: 145000, limit: 500000 },
      monthly_emails: { used: 45000, limit: 100000 }
    },
    invoices: [
      { id: 'INV-2026-04-01', amount: 249.00, status: 'paid', date: new Date(Date.now() - 86400000 * 15).toISOString() },
      { id: 'INV-2026-03-01', amount: 249.00, status: 'paid', date: new Date(Date.now() - 86400000 * 45).toISOString() }
    ]
  },
  settings: {
    workspaceName: "AI BizOS Admin",
    domain: "admin.bizos.test",
    timezone: "America/Los_Angeles",
    industry: "SaaS",
    allowSignups: true
  },
  agents: [
    { id: 'ag-1', name: 'Ava (Sales SDR)', role: 'Outbound Leads', status: 'active', tasks_completed: 1400, accuracy: 98.2 },
    { id: 'ag-2', name: 'Marcus (Support)', role: 'L1 Helpdesk', status: 'active', tasks_completed: 8230, accuracy: 99.1 },
    { id: 'ag-3', name: 'Nexus (Data Ops)', role: 'CRM Syncing', status: 'sleeping', tasks_completed: 450, accuracy: 100 }
  ],
  integrations: [
    { id: 'int-1', provider: 'Stripe', category: 'Payments', status: 'connected', last_sync: '10 mins ago' },
    { id: 'int-2', provider: 'Twilio', category: 'Communications', status: 'connected', last_sync: '1 min ago' },
    { id: 'int-3', provider: 'Shopify', category: 'Commerce', status: 'disconnected', last_sync: 'Never' },
    { id: 'int-4', provider: 'Slack', category: 'Notifications', status: 'connected', last_sync: '2 hours ago' },
    { id: 'int-5', provider: 'Salesforce', category: 'CRM', status: 'disconnected', last_sync: 'Never' }
  ],
  users: [
    { id: 'u1', email: 'muslimani181@gmail.com', role: 'owner', name: 'Master Owner', status: 'active', avatar: 'https://i.pravatar.cc/150?u=u1' },
    { id: 'u2', email: 'muslim.brami@gmail.com', role: 'admin', name: 'Admin Brami', status: 'active', avatar: 'https://i.pravatar.cc/150?u=u2' },
    { id: 'u3', email: 'alex@bizos.test', role: 'user', name: 'Alex Rivera', status: 'active', avatar: 'https://i.pravatar.cc/150?u=u3' }
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

  // Autonomous Agents
  app.get("/api/agents", (req, res) => res.json({ data: db.agents }));
  
  // Integrations Hub
  app.get("/api/integrations", (req, res) => res.json({ data: db.integrations }));
  app.post("/api/integrations/toggle", (req, res) => {
    const { id } = req.body;
    const target = db.integrations.find(i => i.id === id);
    if (target) {
      target.status = target.status === 'connected' ? 'disconnected' : 'connected';
      target.last_sync = target.status === 'connected' ? 'Just now' : 'Never';
    }
    res.json({ success: true, data: db.integrations });
  });

  // Auth / Login Simulation
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (email && email.includes('@')) {
      let user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        // Fallback for valid emails that aren't in the DB yet snippet.
        // It simulates auto-registration on first login for demo purposes.
        user = { 
          id: `u${Date.now()}`, 
          email, 
          role: 'user', 
          name: email.split('@')[0], 
          status: 'active', 
          avatar: `https://i.pravatar.cc/150?u=${Date.now()}` 
        };
        db.users.push(user);
      }
      res.json({ success: true, token: "mock_jwt_token_" + user.id, user });
    } else {
      res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    const { email, name, password } = req.body;
    if (email && name && password.length >= 6) {
      if (db.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return res.status(400).json({ success: false, error: "User already exists" });
      }
      
      const newUser = {
        id: `u${Date.now()}`,
        email,
        name,
        role: 'user', // Default role
        status: 'active',
        avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
      };
      db.users.push(newUser);
      res.json({ success: true, token: "mock_jwt_token_" + newUser.id, user: newUser });
    } else {
      res.status(400).json({ success: false, error: "Invalid registration data. Password must be >6 chars." });
    }
  });

  app.get("/api/auth/me", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer mock_jwt_token_')) {
      const userId = authHeader.replace('Bearer mock_jwt_token_', '');
      const user = db.users.find(u => u.id === userId);
      if (user) {
        return res.json({ success: true, user });
      }
    }
    res.status(401).json({ success: false, error: "Invalid or expired token" });
  });

  // Admin User Endpoints
  app.get("/api/admin/users", (req, res) => res.json({ data: db.users }));
  
  app.post("/api/admin/users/role", (req, res) => {
    const { id, role } = req.body;
    if (!['owner', 'admin', 'user'].includes(role)) {
       return res.status(400).json({ success: false, error: "Invalid role" });
    }
    const targetUser = db.users.find(u => u.id === id);
    if (targetUser) {
      targetUser.role = role;
      res.json({ success: true, data: db.users });
    } else {
      res.status(404).json({ success: false, error: "User not found" });
    }
  });

  // Settings / Workspace Isolation
  app.get("/api/settings", (req, res) => {
    res.json({ success: true, data: db.settings });
  });
  
  app.put("/api/settings", (req, res) => {
    const updates = req.body;
    db.settings = { ...db.settings, ...updates };
    res.json({ success: true, data: db.settings });
  });

  // Billing
  app.get("/api/billing", (req, res) => res.json({ data: db.billing }));
  app.post("/api/billing/upgrade", (req, res) => {
    const { newPlan } = req.body;
    db.billing.plan = newPlan;
    // Reset or bump limits depending on plan
    if (newPlan === 'enterprise_plus') {
      db.billing.usage.ai_words.limit = 2000000;
      db.billing.usage.contacts.limit = 250000;
    }
    res.json({ success: true, data: db.billing });
  });
  app.post("/api/billing/downgrade", (req, res) => {
    const { newPlan } = req.body;
    db.billing.plan = newPlan;
    if (newPlan === 'starter') {
      db.billing.usage.ai_words.limit = 50000;
      db.billing.usage.contacts.limit = 5000;
    }
    res.json({ success: true, data: db.billing });
  });

  // Dashboard Metrics
  app.get("/api/dashboard/metrics", (req, res) => {
    // Generate actual metrics from our in-memory "database"
    const openLeads = db.leads.length;
    const pipelineValue = db.leads.reduce((acc, lead) => {
      // safely parse string like "$45,000"
      const val = parseInt(lead.value.replace(/[^0-9.-]+/g, '')) || 0;
      return acc + val;
    }, 0);
    const unreadMessages = db.conversations.filter(c => c.unread).length;
    const activeCampaigns = db.campaigns.filter(c => c.status === 'sending').length;

    res.json({
      success: true,
      data: {
        totalRevenue: '$145,231', // Mocked base + pipeline offset
        pipelineValue: `$${pipelineValue.toLocaleString()}`,
        activeLeads: openLeads,
        unreadMessages,
        activeCampaigns,
        growthRate: '+14%',
        mrr: '$24,500'
      }
    });
  });

  // Automations
  app.get("/api/automations", (req, res) => res.json({ data: db.automations }));
  app.post("/api/automations", (req, res) => {
    const { name, trigger, action } = req.body;
    const newRule = { id: Date.now(), name, trigger, action, status: 'active', executions: 0 };
    db.automations.push(newRule);
    res.json({ success: true, data: newRule });
  });

  // Helpdesk Tickets
  app.get("/api/tickets", (req, res) => res.json({ data: db.tickets }));
  app.post("/api/tickets", (req, res) => {
    const { subject, priority } = req.body;
    const newTicket = { id: Date.now(), subject, status: 'open', priority: priority || 'medium', user: 'admin@bizos.test', created_at: 'Just now' };
    db.tickets.unshift(newTicket); // Add to top
    res.json({ success: true, data: newTicket });
  });

  // Call Center
  app.get("/api/calls", (req, res) => {
    res.json({ data: db.calls });
  });

  // AI Strategist
  app.post("/api/ai/strategist", async (req, res) => {
    const { message, previousMessages = [] } = req.body;
    
    try {
      // Create a simplified chat history representation
      const conversationHistory = previousMessages.map((m: any) => `${m.role === 'user' ? 'User' : 'Strategist'}: ${m.content}`).join('\n');
      
      const promptText = `You are a high-level AI Business Strategist for a SaaS company. You analyze data, suggest growth tactics, and provide executive advice. 
Context:
${conversationHistory}

User: "${message}"
Strategist:`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText,
      });
      
      res.json({ success: true, ai_reply: response.text });
    } catch (err) {
      console.error("AI Strategist Error:", err);
      res.json({ success: true, ai_reply: "I am currently analyzing backend metrics. Please try again in a moment, or ensure the Gemini API key is valid." });
    }
  });

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
