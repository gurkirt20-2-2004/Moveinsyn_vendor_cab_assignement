"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Car, 
  Briefcase, 
  Network, 
  LogOut 
} from "lucide-react"; 
import { cn } from "@/lib/utils"; 
import { Button } from "@/components/ui/button";

// Updated links based on your folder structure
const sidebarItems = [
  { name: "Super Vendor Dashboard", href: "/super-vendor-dashboard", icon: LayoutDashboard },
  { name: "Fleet & Driver", href: "/fleet-driver-management", icon: Car },
  { name: "Vendor Delegation", href: "/vendor-delegation-management", icon: Briefcase },
  { name: "Vendor Hierarchy", href: "/vendor-hierarchy-tree", icon: Network },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 fixed left-0 top-0">
      <div className="h-16 flex items-center justify-center border-b border-slate-800">
        <h1 className="text-xl font-bold text-blue-500 tracking-wider">MoveInSync</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 cursor-pointer hover:bg-slate-800",
                  isActive ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" : "text-slate-400"
                )}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800 gap-2">
          <LogOut size={20} />
          Logout
        </Button>
      </div>
    </div>
  );
}