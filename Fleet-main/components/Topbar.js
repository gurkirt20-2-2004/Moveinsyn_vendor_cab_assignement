import { Bell, Search, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Topbar({ title = "Dashboard" }) {
  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Page Title */}
      <h2 className="text-xl font-semibold text-slate-800">{title}</h2>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Search..." 
            className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-500" 
          />
        </div>

        {/* Icons */}
        <Button variant="ghost" size="icon" className="text-slate-500">
          <Bell size={20} />
        </Button>

        {/* Profile Dropdown */}
        <div className="flex items-center gap-2 border-l pl-4 ml-2">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-slate-700">Admin User</p>
            <p className="text-xs text-slate-500">Manager</p>
          </div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}