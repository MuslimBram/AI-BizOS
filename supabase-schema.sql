-- ==========================================
-- AI Business OS - Supabase Database Schema
-- ==========================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. CORE TENANT TABLES
-- Workspaces (The highest level of isolation)
create table public.workspaces (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Businesses (Can belong to a workspace)
create table public.businesses (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    name text not null,
    industry text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Users Profile (Extended from Supabase auth.users)
create table public.users (
    id uuid references auth.users(id) on delete cascade primary key,
    email text unique not null,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Memberships (RBAC and Tenant binding)
-- Roles: admin, business, freelancer, partner
create table public.memberships (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    role text not null check (role in ('admin', 'business', 'freelancer', 'partner')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, workspace_id)
);

-- 3. CORE DATA MODELS (Bound strictly to workspace_id or business_id)

-- Contacts
create table public.contacts (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    name text not null,
    email text,
    phone text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Conversations (Threads in Unified Inbox)
create table public.conversations (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    contact_id uuid references public.contacts(id) on delete cascade not null,
    channel text not null check (channel in ('whatsapp', 'telegram', 'email', 'webchat', 'sms')),
    status text default 'open',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages (Inside Conversations)
create table public.messages (
    id uuid default uuid_generate_v4() primary key,
    conversation_id uuid references public.conversations(id) on delete cascade not null,
    sender_type text not null check (sender_type in ('contact', 'agent', 'bot')),
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Leads & Deals (CRM)
create table public.leads (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    contact_id uuid references public.contacts(id) on delete cascade not null,
    business_id uuid references public.businesses(id) on delete set null,
    status text default 'awareness',
    value numeric default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Campaigns
create table public.campaigns (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    name text not null,
    status text default 'draft',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables
alter table public.workspaces enable row level security;
alter table public.businesses enable row level security;
alter table public.users enable row level security;
alter table public.memberships enable row level security;
alter table public.contacts enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.leads enable row level security;
alter table public.campaigns enable row level security;

-- Create helper function to get user workspaces
create or function get_user_workspaces()
returns setof uuid
language sql
security definer
set search_path = public
stable
as $$
    select workspace_id from memberships where user_id = auth.uid();
$$;

-- Apply Workspaces Isolation Policies
create policy "Users can view workspaces they belong to" 
    on public.workspaces for select 
    using (id in (select get_user_workspaces()));

create policy "Users can view businesses in their workspace" 
    on public.businesses for all 
    using (workspace_id in (select get_user_workspaces()));

create policy "Users can view memberships for their workspaces" 
    on public.memberships for select 
    using (workspace_id in (select get_user_workspaces()) or user_id = auth.uid());

create policy "Users can view contacts in their workspace" 
    on public.contacts for all 
    using (workspace_id in (select get_user_workspaces()));

create policy "Users can view conversations in their workspace" 
    on public.conversations for all 
    using (workspace_id in (select get_user_workspaces()));

create policy "Users can view messages in their workspace conversations" 
    on public.messages for all 
    using (conversation_id in (
        select id from public.conversations where workspace_id in (select get_user_workspaces())
    ));

create policy "Users can view leads in their workspace" 
    on public.leads for all 
    using (workspace_id in (select get_user_workspaces()));

create policy "Users can view campaigns in their workspace" 
    on public.campaigns for all 
    using (workspace_id in (select get_user_workspaces()));

-- Profile Policy
create policy "Users can view and update their own profile" 
    on public.users for all 
    using (id = auth.uid());
