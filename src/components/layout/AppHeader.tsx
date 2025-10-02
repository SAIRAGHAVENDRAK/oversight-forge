import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AppHeader() {
  return (
    <header className="h-16 border-b border-border bg-card sticky top-0 z-10">
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:bg-muted" />
          
          <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-3 py-2 min-w-[300px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search audits, findings..."
              className="bg-transparent border-none outline-none text-sm flex-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              3
            </Badge>
          </Button>

          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">Sarah Johnson</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground">SJ</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
