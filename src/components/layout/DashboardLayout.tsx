import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Outlet } from 'react-router-dom';

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4 gap-2">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <h1 className="text-[13px] font-semibold tracking-tight text-muted-foreground uppercase">AI Business OS Workspace</h1>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
            Workspace: <span className="font-semibold text-foreground">Enterprise Tech Inc.</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col overflow-hidden bg-background relative">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
