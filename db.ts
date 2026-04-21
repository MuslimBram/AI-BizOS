import Database from 'better-sqlite3';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { AsyncLocalStorage } from 'async_hooks';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = resolve(__dirname, 'sqlite.db');

export const db = new Database(dbPath);

export const tenantContext = new AsyncLocalStorage<{ workspaceId: string }>();

function getWs() {
  const store = tenantContext.getStore();
  if (!store || !store.workspaceId) {
    console.warn("Missing tenant context! Falling back to ws-bizos-001");
    return 'ws-bizos-001';
  }
  return store.workspaceId;
}

db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    workspace_id TEXT NOT NULL,
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    avatar TEXT
  );

  CREATE TABLE IF NOT EXISTS agents (
    workspace_id TEXT NOT NULL,
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL,
    tasks_completed INTEGER,
    accuracy REAL
  );

  CREATE TABLE IF NOT EXISTS integrations (
    workspace_id TEXT NOT NULL,
    id TEXT PRIMARY KEY,
    provider TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL,
    last_sync TEXT,
    config TEXT, -- JSON
    lastError TEXT
  );

  CREATE TABLE IF NOT EXISTS leads (
    workspace_id TEXT NOT NULL,
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT,
    value TEXT,
    stage TEXT,
    tags TEXT -- JSON array
  );

  CREATE TABLE IF NOT EXISTS conversations (
    workspace_id TEXT NOT NULL,
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    platform TEXT NOT NULL,
    color TEXT,
    lastMsg TEXT,
    time TEXT,
    unread INTEGER DEFAULT 0,
    identifier TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    workspace_id TEXT NOT NULL,
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL,
    sender_type TEXT NOT NULL, -- contact, agent, bot
    content TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tickets (
    workspace_id TEXT NOT NULL,
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    customer TEXT NOT NULL,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    time TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS calls (
    workspace_id TEXT NOT NULL,
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT NOT NULL,
    duration TEXT NOT NULL,
    status TEXT NOT NULL,
    time TEXT NOT NULL,
    recording_url TEXT,
    transcript TEXT,
    summary TEXT
  );

  CREATE TABLE IF NOT EXISTS campaigns (
    workspace_id TEXT NOT NULL,
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    sent INTEGER DEFAULT 0,
    opens INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS automations (
    workspace_id TEXT NOT NULL,
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    trigger TEXT NOT NULL,
    action TEXT NOT NULL,
    status TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS kv_store (
    workspace_id TEXT NOT NULL,
    key TEXT,
    value TEXT NOT NULL,
    PRIMARY KEY (workspace_id, key)
  );
`);

// Mock Data Seeding (only if empty)
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
if (userCount.count === 0) {
  const insertUser = db.prepare('INSERT INTO users (workspace_id, id, email, role, name, status, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)');
  insertUser.run('ws-bizos-001', 'u1', 'muslimani181@gmail.com', 'owner', 'Master Owner', 'active', 'https://i.pravatar.cc/150?u=u1');
  insertUser.run('ws-bizos-001', 'u2', 'muslim.brami@gmail.com', 'admin', 'Admin Brami', 'active', 'https://i.pravatar.cc/150?u=u2');
  
  const insertInt = db.prepare('INSERT INTO integrations (workspace_id, id, provider, category, status, last_sync, config, lastError) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  insertInt.run('ws-bizos-001', 'int-whatsapp', 'WhatsApp (Meta)', 'Communications', 'disconnected', 'Never', JSON.stringify({ accessToken: '', phoneNumberId: '', verifyToken: 'wa_biz_secure_88' }), null);
  insertInt.run('ws-bizos-001', 'int-telegram', 'Telegram', 'Communications', 'disconnected', 'Never', JSON.stringify({ botToken: '', webhookSecret: 'tg_biz_secure_88' }), null);
  insertInt.run('ws-bizos-001', 'int-email', 'Email (SendGrid)', 'Communications', 'disconnected', 'Never', JSON.stringify({ apiKey: '', fromEmail: '' }), null);
  insertInt.run('ws-bizos-001', 'int-webchat', 'Webchat Widget', 'Communications', 'disconnected', 'Never', JSON.stringify({ allowedDomains: '', widgetId: '' }), null);
  insertInt.run('ws-bizos-001', 'int-shopify', 'Shopify', 'Commerce', 'disconnected', 'Never', JSON.stringify({ shopDomain: '', accessToken: '', webhookSecret: 'sh_biz_secret_88' }), null);
  insertInt.run('ws-bizos-001', 'int-1', 'Stripe', 'Payments', 'connected', '10 mins ago', null, null);
  insertInt.run('ws-bizos-001', 'int-2', 'Twilio', 'Communications', 'connected', '1 min ago', null, null);
  insertInt.run('ws-bizos-001', 'int-4', 'Slack', 'Notifications', 'connected', '2 hours ago', null, null);
  insertInt.run('ws-bizos-001', 'int-5', 'Salesforce', 'CRM', 'disconnected', 'Never', null, null);

  const initialSettings = { 
    company_name: 'Acme Corp', auto_reply: true, theme: 'dark', ai_personality: 'Professional & Helpful', default_agent: 'ag-1' 
  };
  const initialBilling = {
    plan: 'Pro', status: 'active', usage: { ai_words: { current: 15420, limit: 50000 }, contacts: { current: 1240, limit: 5000 } }
  };

  const insertKv = db.prepare('INSERT INTO kv_store (workspace_id, key, value) VALUES (?, ?, ?)');
  insertKv.run('ws-bizos-001', 'settings', JSON.stringify(initialSettings));
  insertKv.run('ws-bizos-001', 'billing', JSON.stringify(initialBilling));
}

// Helper methods for synchronous operations
export const Queries = {
  getKV: (key: string) => {
    const row = db.prepare('SELECT value FROM kv_store WHERE workspace_id = ? AND key = ?').get(getWs(), key) as any;
    return row ? JSON.parse(row.value) : null;
  },
  setKV: (key: string, value: any) => {
    db.prepare('INSERT INTO kv_store (workspace_id, key, value) VALUES (@ws, @key, @value) ON CONFLICT(workspace_id, key) DO UPDATE SET value = excluded.value').run({ ws: getWs(), key, value: JSON.stringify(value) });
  },

  getIntegrations: () => db.prepare('SELECT * FROM integrations WHERE workspace_id = ?').all(getWs()).map((row: any) => ({ ...row, config: row.config ? JSON.parse(row.config) : null })),
  getIntegrationById: (id: string) => {
    const row = db.prepare('SELECT * FROM integrations WHERE workspace_id = ? AND id = ?').get(getWs(), id) as any;
    if (!row) return null;
    return { ...row, config: row.config ? JSON.parse(row.config) : null };
  },
  updateIntegration: (id: string, status: string, last_sync: string, config: any, lastError: string | null) => {
    db.prepare('UPDATE integrations SET status = ?, last_sync = ?, config = ?, lastError = ? WHERE workspace_id = ? AND id = ?')
      .run(status, last_sync, config ? JSON.stringify(config) : null, lastError, getWs(), id);
  },
  
  getConversations: () => db.prepare('SELECT * FROM conversations WHERE workspace_id = ?').all(getWs()),
  getConversationsByPlatform: (platform: string, identifier: string) => db.prepare('SELECT * FROM conversations WHERE workspace_id = ? AND platform = ? AND identifier = ?').get(getWs(), platform, identifier),
  createConversation: (c: any) => {
    const res = db.prepare('INSERT INTO conversations (workspace_id, name, platform, color, lastMsg, time, unread, identifier) VALUES (@workspace_id, @name, @platform, @color, @lastMsg, @time, @unread, @identifier)')
      .run({ workspace_id: getWs(), ...c, unread: c.unread ? 1 : 0, color: c.color || null, lastMsg: c.lastMsg || null, time: c.time || null, identifier: c.identifier || null });
    return res.lastInsertRowid;
  },
  updateConversation: (id: number, lastMsg: string, unread: number, time: string) => {
    db.prepare('UPDATE conversations SET lastMsg = ?, unread = ?, time = ? WHERE workspace_id = ? AND id = ?').run(lastMsg, unread, time, getWs(), id);
  },

  getMessagesByConvo: (convoId: number) => db.prepare('SELECT * FROM messages WHERE workspace_id = ? AND conversation_id = ?').all(getWs(), convoId),
  createMessage: (m: any) => {
    db.prepare('INSERT INTO messages (workspace_id, conversation_id, sender_type, content, created_at) VALUES (@workspace_id, @conversation_id, @sender_type, @content, @created_at)')
      .run({ workspace_id: getWs(), ...m, created_at: m.created_at || new Date().toISOString() });
  },

  getLeads: () => db.prepare('SELECT * FROM leads WHERE workspace_id = ? ORDER BY id DESC').all(getWs()).map((l:any) => ({...l, tags: l.tags ? JSON.parse(l.tags) : []})),
  createLead: (l: any) => {
    const res = db.prepare('INSERT INTO leads (workspace_id, name, contact, value, stage, tags) VALUES (@workspace_id, @name, @contact, @value, @stage, @tags)')
      .run({ workspace_id: getWs(), ...l, contact: l.contact || null, value: l.value || null, tags: JSON.stringify(l.tags || []) });
    return res.lastInsertRowid;
  },
  getLeadById: (id: number) => {
    const row = db.prepare('SELECT * FROM leads WHERE workspace_id = ? AND id = ?').get(getWs(), id) as any;
    return row ? { ...row, tags: row.tags ? JSON.parse(row.tags) : [] } : null;
  },

  getUsers: () => db.prepare('SELECT * FROM users WHERE workspace_id = ?').all(getWs()),
  getUserByEmail: (email: string) => db.prepare('SELECT * FROM users WHERE workspace_id = ? AND LOWER(email) = LOWER(?)').get(getWs(), email),
  getUserById: (id: string) => db.prepare('SELECT * FROM users WHERE workspace_id = ? AND id = ?').get(getWs(), id),
  createUser: (u: any) => {
    db.prepare('INSERT INTO users (workspace_id, id, email, role, name, status, avatar) VALUES (@workspace_id, @id, @email, @role, @name, @status, @avatar)').run({ workspace_id: getWs(), ...u, avatar: u.avatar || null });
  },
  
  getAgents: () => db.prepare('SELECT * FROM agents WHERE workspace_id = ?').all(getWs()),
  
  getTickets: () => db.prepare('SELECT * FROM tickets WHERE workspace_id = ? ORDER BY id DESC').all(getWs()),
  createTicket: (t: any) => {
    db.prepare('INSERT INTO tickets (workspace_id, subject, customer, status, priority, time) VALUES (@workspace_id, @subject, @customer, @status, @priority, @time)').run({ workspace_id: getWs(), ...t });
  },
  getTicketById: (id: number) => db.prepare('SELECT * FROM tickets WHERE workspace_id = ? AND id = ?').get(getWs(), id),

  getCalls: () => db.prepare('SELECT * FROM calls WHERE workspace_id = ? ORDER BY id DESC').all(getWs()),
  createCall: (c: any) => {
    db.prepare('INSERT INTO calls (workspace_id, number, duration, status, time, recording_url, transcript, summary) VALUES (@workspace_id, @number, @duration, @status, @time, @recording_url, @transcript, @summary)')
      .run({ workspace_id: getWs(), ...c, recording_url: c.recording_url || null, transcript: c.transcript || null, summary: c.summary || null });
  },

  getCampaigns: () => db.prepare('SELECT * FROM campaigns WHERE workspace_id = ? ORDER BY id DESC').all(getWs()),
  createCampaign: (c: any) => {
    db.prepare('INSERT INTO campaigns (workspace_id, name, status, sent, opens, clicks) VALUES (@workspace_id, @name, @status, @sent, @opens, @clicks)').run({ workspace_id: getWs(), ...c, sent: c.sent || 0, opens: c.opens || 0, clicks: c.clicks || 0 });
  },
  updateCampaign: (id: number, status: string, opens: number, clicks: number) => {
    db.prepare('UPDATE campaigns SET status = ?, opens = ?, clicks = ? WHERE workspace_id = ? AND id = ?').run(status, opens, clicks, getWs(), id);
  },

  getAutomations: () => db.prepare('SELECT * FROM automations WHERE workspace_id = ? ORDER BY id DESC').all(getWs()),
  createAutomation: (a: any) => {
    db.prepare('INSERT INTO automations (workspace_id, name, trigger, action, status) VALUES (@workspace_id, @name, @trigger, @action, @status)').run({ workspace_id: getWs(), ...a });
  },
  getAutomationById: (id: number) => db.prepare('SELECT * FROM automations WHERE workspace_id = ? AND id = ?').get(getWs(), id)
};
