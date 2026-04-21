import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { 
  Building2, 
  LayoutDashboard, 
  Inbox, 
  Users, 
  Briefcase, 
  PhoneCall, 
  Megaphone,
  BrainCircuit,
  LineChart,
  Bot,
  Settings,
  User,
  Zap,
  Globe,
  Database,
  Lock,
  Workflow,
  Search,
  PieChart,
  Target,
  CreditCard,
  LifeBuoy,
  Network,
  Activity,
  Layers,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '../../lib/AuthContext';

const MENU_GROUPS = [
  {
    label: "Main",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Inbox", href: "/inbox", icon: Inbox },
      { name: "Leads", href: "/main/leads", icon: Target },
      { name: "CRM", href: "/crm", icon: Users },
      { name: "Sales Engine", href: "/main/sales", icon: Zap },
      { name: "Revenue Engine", href: "/main/revenue", icon: LineChart },
      { name: "Campaigns", href: "/campaigns", icon: Megaphone },
      { name: "Analytics", href: "/main/analytics", icon: PieChart },
    ]
  },
  {
    label: "Contact Center",
    items: [
      { name: "Telephony", href: "/calls", icon: PhoneCall },
      { name: "Helpdesk", href: "/helpdesk", icon: LifeBuoy },
    ]
  },
  {
    label: "Growth & AI Core",
    icon: BrainCircuit,
    items: [
      { name: "Automations", href: "/automations", icon: Workflow },
      { name: "Autonomous OS", href: "/autonomous-os", icon: Bot },
      { name: "Marketing Auto", href: "/growth/marketing", icon: Megaphone },
      { name: "Growth Strategy", href: "/ai/strategist", icon: Target },
      { name: "Market Expansion", href: "/growth/expansion", icon: Globe },
      { name: "AI Decisions", href: "/growth/decisions", icon: BrainCircuit },
      { name: "Benchmarks", href: "/growth/benchmarks", icon: LineChart },
    ]
  },
  {
    label: "Optimization AI",
    items: [
      { name: "Pricing & Offers", href: "/optimization/pricing", icon: CreditCard },
      { name: "Personalization", href: "/optimization/personalization", icon: User },
      { name: "Demand Forecast", href: "/optimization/forecast", icon: LineChart },
      { name: "Workforce AI", href: "/optimization/workforce", icon: Users },
      { name: "Process AI", href: "/optimization/process", icon: Settings },
      { name: "Funnel AI", href: "/optimization/funnel", icon: Network },
      { name: "Customer Value", href: "/optimization/customer-value", icon: Zap },
    ]
  },
  {
    label: "Intelligence",
    items: [
      { name: "Competitor Intel", href: "/intelligence/competitor", icon: Search },
      { name: "SEO Audit", href: "/intelligence/seo", icon: Globe },
      { name: "Brand & Reputation", href: "/intelligence/brand", icon: Buildings },
      { name: "Customer Experience", href: "/intelligence/experience", icon: Users },
      { name: "Retention", href: "/intelligence/retention", icon: Activity },
      { name: "Keywords", href: "/intelligence/keywords", icon: Search },
      { name: "Knowledge Base", href: "/intelligence/kb", icon: Database },
    ]
  },
  {
    label: "Engagement",
    items: [
      { name: "Partnerships", href: "/engagement/partnerships", icon: Briefcase },
      { name: "Re-Engagement", href: "/engagement/re-engagement", icon: Target },
      { name: "Growth Loop", href: "/engagement/growth-loop", icon: Workflow },
      { name: "Community", href: "/engagement/community", icon: Users },
      { name: "Lead Magnets", href: "/engagement/lead-magnets", icon: Zap },
      { name: "Gamification", href: "/engagement/gamification", icon: Layers },
      { name: "Media Studio", href: "/engagement/media-studio", icon: LayoutDashboard },
      { name: "Broadcast", href: "/engagement/broadcast", icon: Megaphone },
    ]
  },
  {
    label: "Integrations",
    items: [
      { name: "Connections Hub", href: "/integrations", icon: Globe },
      { name: "Channels", href: "/integrations/channels", icon: Layers },
      { name: "Accounts", href: "/integrations/accounts", icon: User },
      { name: "Public API", href: "/integrations/api", icon: Database },
      { name: "Marketplace", href: "/integrations/marketplace", icon: Briefcase },
      { name: "Developer", href: "/integrations/developer", icon: Settings },
    ]
  },
  {
    label: "Business & Billing",
    items: [
      { name: "Business Profile", href: "/settings", icon: Building2 },
      { name: "Branding", href: "/business/branding", icon: LayoutDashboard },
      { name: "Financials", href: "/business/financials", icon: LineChart },
      { name: "Wallet", href: "/business/wallet", icon: CreditCard },
      { name: "Billing", href: "/billing", icon: CreditCard },
      { name: "Credits", href: "/business/credits", icon: Zap },
      { name: "Partners", href: "/business/partners", icon: Users },
      { name: "Reseller", href: "/business/reseller", icon: Briefcase },
      { name: "Ops Health", href: "/business/ops-health", icon: Activity },
      { name: "Security", href: "/business/security", icon: Lock },
      { name: "Managed Businesses", href: "/business/managed", icon: Layers },
      { name: "Help Center", href: "/helpdesk", icon: LifeBuoy },
    ]
  },
  {
    label: "Admin",
    items: [
      { name: "Admin Panel", href: "/admin", icon: Settings },
      { name: "Activation Status", href: "/admin/activation", icon: Activity },
      { name: "Integration Hub", href: "/integrations", icon: Globe },
      { name: "Analytics", href: "/admin/analytics", icon: LineChart },
      { name: "SaaS Health", href: "/admin/health", icon: Activity },
      { name: "Sources & Scanner", href: "/admin/scanner", icon: Search },
    ]
  }
];

function Buildings(props: any) {
  return <Building2 {...props} />;
}

export function AppSidebar() {
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const isSuperAdmin = currentUser?.role === 'owner' || currentUser?.role === 'admin';

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Main": true,
    "Contact Center": true,
    "Growth & AI Core": true,
    "Optimization AI": true,
    "Intelligence": true,
    "Engagement": true,
    "Integrations": true,
    "Business & Billing": true,
    "Admin": isSuperAdmin
  });

  const toggleGroup = (slug: string) => {
    setOpenGroups(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="h-14 border-b flex items-center justify-center p-2 px-4 shadow-sm">
        <div className="flex w-full items-center gap-2 overflow-hidden px-1 py-1">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-orange-600 text-white">
            <Zap className="size-5" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-bold text-base tracking-tight">AI BizOS</span>
            <span className="truncate text-xs font-medium text-muted-foreground">Business Suite</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        {MENU_GROUPS.filter(group => isSuperAdmin || group.label !== "Admin").map((group) => (
          <SidebarGroup key={group.label} className="border-b border-border/10 pb-2 mb-2">
            <SidebarGroupLabel 
              onClick={() => toggleGroup(group.label)}
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 py-4 cursor-pointer hover:text-foreground hover:bg-muted/30 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5">
                {group.icon && <group.icon className="w-3.5 h-3.5 text-orange-500" />}
                {group.label}
              </div>
              {openGroups[group.label] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </SidebarGroupLabel>
            
            {openGroups[group.label] && (
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton tooltip={item.name} render={
                        <NavLink to={item.href} className={({isActive}) => isActive && item.href !== "#" ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium flex items-center" : "flex items-center"}>
                          <item.icon className="size-4" />
                          <span>{item.name}</span>
                        </NavLink>
                      } />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-4 flex flex-col gap-2 shadow-sm shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full" />}>
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={currentUser?.avatar || "https://github.com/shadcn.png"} alt="User" />
              <AvatarFallback className="rounded-lg">{currentUser?.name?.substring(0, 2)?.toUpperCase() || 'AD'}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{currentUser?.name || 'Admin / Owner'}</span>
              <span className="truncate text-xs text-muted-foreground uppercase">{currentUser?.role || 'admin'}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" align="end" sideOffset={4}>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <User className="mr-2 h-4 w-4" />
              <span>Workspace Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/billing')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Billing & Subscriptions</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive font-semibold cursor-pointer" onClick={handleLogout}>
              <Briefcase className="mr-2 h-4 w-4 text-destructive" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
