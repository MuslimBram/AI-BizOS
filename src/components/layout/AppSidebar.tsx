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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
  Zap
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="h-14 border-b flex items-center justify-center p-2 px-4 shadow-sm">
        <div className="flex w-full items-center gap-2 overflow-hidden px-1 py-1">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-orange-600 text-white">
            <Zap className="size-5" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-bold text-base tracking-tight">AI BizOS</span>
            <span className="truncate text-xs font-medium text-muted-foreground">Admin Pro</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Core Platform */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Core Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard" render={<NavLink to="/dashboard" className={({isActive}) => isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium flex items-center" : "flex items-center"} />}>
                  <LayoutDashboard className="size-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Unified Inbox" render={<NavLink to="/inbox" className={({isActive}) => isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium flex items-center" : "flex items-center"} />}>
                  <Inbox className="size-4" />
                  <span>Unified Inbox</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="CRM & Leads" render={<NavLink to="/crm" className={({isActive}) => isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium flex items-center" : "flex items-center"} />}>
                  <Users className="size-4" />
                  <span>CRM & Leads</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Modules */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Call Center" render={<NavLink to="/calls" className={({isActive}) => isActive ? "bg-sidebar-accent text-sidebar-accent-foreground flex items-center" : "flex items-center"} />}>
                  <PhoneCall className="size-4" />
                  <span>Call Center</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Campaigns" render={<NavLink to="/campaigns" className={({isActive}) => isActive ? "bg-sidebar-accent text-sidebar-accent-foreground flex items-center" : "flex items-center"} />}>
                  <Megaphone className="size-4" />
                  <span>Campaigns</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* AI Engines */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1">
            <BrainCircuit className="size-3 text-orange-500" /> AI Engines
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Growth Engine" render={<NavLink to="/ai/growth" className={({isActive}) => isActive ? "bg-sidebar-accent text-sidebar-accent-foreground flex items-center" : "flex items-center"} />}>
                  <LineChart className="size-4 text-emerald-500" />
                  <span>Growth Engine</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Strategist" render={<NavLink to="/ai/strategist" className={({isActive}) => isActive ? "bg-sidebar-accent text-sidebar-accent-foreground flex items-center" : "flex items-center"} />}>
                  <Bot className="size-4 text-blue-500" />
                  <span>AI Strategist</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4 flex flex-col gap-2 shadow-sm">
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full" />}>
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
              <AvatarFallback className="rounded-lg">AD</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Admin / Owner</span>
              <span className="truncate text-xs text-muted-foreground">admin@bizos.test</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" align="end" sideOffset={4}>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Workspace Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>System Settings</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
