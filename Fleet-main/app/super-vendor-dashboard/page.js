"use client";
import { useState } from "react";
import Topbar from "@/components/Topbar";
import { 
  Car, 
  Users, 
  FileCheck, 
  TrendingUp, 
  Building2, 
  Download, 
  MoreHorizontal, 
  MapPin, 
  Phone, 
  Mail 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// --- MOCK DATA ---
const superVendorDashboardData = [
  {
    totalSubVendors: 12,
    activeVehicles: 145,
    driversAvailable: 32,
    pendingDocumentApprovals: 5,
  },
];

const vendors = [
  {
    vendorId: "V001",
    name: "Alpha Transport Solutions",
    email: "contact@alphatrans.com",
    phone: "+91 98765 43210",
    vendorType: "cityVendor",
    region: "North Zone",
    activeVehicles: 45,
    availableDrivers: 8,
    pendingApprovals: 2,
    status: "Active",
    lastAudit: "2024-10-15",
  },
  {
    vendorId: "V002",
    name: "Metro Cabs",
    email: "support@metrocabs.com",
    phone: "+91 98765 12345",
    vendorType: "cityVendor",
    region: "South Zone",
    activeVehicles: 30,
    availableDrivers: 12,
    pendingApprovals: 0,
    status: "Active",
    lastAudit: "2024-11-01",
  },
  {
    vendorId: "V003",
    name: "Rapid Logistics",
    email: "info@rapidlogistics.in",
    phone: "+91 99887 77665",
    vendorType: "localVendor",
    region: "Sector 4",
    activeVehicles: 15,
    availableDrivers: 3,
    pendingApprovals: 1,
    status: "Warning",
    lastAudit: "2024-09-20",
  },
  {
    vendorId: "V004",
    name: "Safe Ride Partners",
    email: "admin@saferide.com",
    phone: "+91 88776 65544",
    vendorType: "localVendor",
    region: "Sector 9",
    activeVehicles: 12,
    availableDrivers: 5,
    pendingApprovals: 2,
    status: "Active",
    lastAudit: "2024-11-10",
  },
];

export default function SuperVendorDashboard() {
  const stats = superVendorDashboardData[0];
  const { toast } = useToast() || { toast: console.log };

  // State for Managing Vendor Modal
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isManageOpen, setIsManageOpen] = useState(false);

  // --- FUNCTION: Download Report (CSV Generation) ---
  const handleDownloadReport = () => {
    try {
      // 1. Define headers
      const headers = ["Vendor Name", "Type", "Region", "Active Vehicles", "Available Drivers", "Status"];
      
      // 2. Convert data to CSV format
      const csvContent = [
        headers.join(","), // Header row
        ...vendors.map(v => 
          `"${v.name}","${v.vendorType}","${v.region}","${v.activeVehicles}","${v.availableDrivers}","${v.status}"`
        )
      ].join("\n");

      // 3. Create a Blob
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      
      // 4. Create a download link and trigger it
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `vendor_report_${new Date().toISOString().slice(0,10)}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Report Downloaded",
        description: "The vendor status report has been saved to your device.",
        className: "bg-green-600 text-white border-none",
      });
    } catch (error) {
      console.error("Download failed", error);
      toast({
        title: "Error",
        description: "Failed to generate report.",
        variant: "destructive",
      });
    }
  };

  // --- FUNCTION: Open Manage Modal ---
  const handleManageClick = (vendor) => {
    setSelectedVendor(vendor);
    setIsManageOpen(true);
  };

  // --- FUNCTION: Simulate Saving Changes in Modal ---
  const handleSaveChanges = () => {
    setIsManageOpen(false);
    toast({
      title: "Changes Saved",
      description: `Settings for ${selectedVendor?.name} have been updated.`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Topbar title="Super Vendor Control Center" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="p-6 space-y-6"
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Sub-vendors" 
            value={stats.totalSubVendors} 
            trend="+2 new" 
            trendColor="text-green-600"
            icon={Building2} 
            iconBg="bg-blue-50" 
            iconColor="text-blue-600" 
          />
          <StatCard 
            title="Active Vehicles" 
            value={stats.activeVehicles} 
            sub="On road" 
            icon={Car} 
            iconBg="bg-green-50" 
            iconColor="text-green-600" 
          />
          <StatCard 
            title="Available Drivers" 
            value={stats.driversAvailable} 
            icon={Users} 
            iconBg="bg-purple-50" 
            iconColor="text-purple-600" 
          />
          <StatCard 
            title="Pending Approvals" 
            value={stats.pendingDocumentApprovals} 
            icon={FileCheck} 
            iconBg="bg-amber-50" 
            iconColor="text-amber-600" 
          />
        </div>

        {/* Sub-vendor Network Table */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="px-6 py-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800">
                Sub-vendor Network
              </CardTitle>
              <CardDescription>
                Real-time status of City and Local vendors
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="pl-6">Vendor Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Active Vehicles</TableHead>
                  <TableHead>Available Drivers</TableHead>
                  <TableHead>Approvals Pending</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                    <TableRow key={vendor.vendorId} className="hover:bg-slate-50/50">
                      <TableCell className="pl-6 font-medium">
                        <div className="flex flex-col">
                          <span className="text-slate-900">{vendor.name}</span>
                          <span className="text-xs text-slate-500">{vendor.region}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-50 text-slate-600 font-normal capitalize">
                          {vendor.vendorType.replace(/([A-Z])/g, ' $1').trim()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${vendor.activeVehicles > 20 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                          {vendor.activeVehicles}
                        </div>
                      </TableCell>
                      <TableCell>{vendor.availableDrivers}</TableCell>
                      <TableCell>
                        {vendor.pendingApprovals > 0 ? (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200">
                            {vendor.pendingApprovals} Pending
                          </Badge>
                        ) : (
                          <span className="text-slate-400 text-sm">None</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium"
                          onClick={() => handleManageClick(vendor)}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* --- MANAGE VENDOR DIALOG (MODAL) --- */}
      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Vendor: {selectedVendor?.name}</DialogTitle>
            <DialogDescription>
              View details and manage permissions for this sub-vendor.
            </DialogDescription>
          </DialogHeader>
          
          {selectedVendor && (
            <div className="grid gap-4 py-4">
              {/* Basic Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-slate-50">
                   <div className="flex items-center gap-2 mb-2 text-slate-500">
                      <MapPin className="h-4 w-4" /> <span className="text-xs font-semibold uppercase">Region</span>
                   </div>
                   <p className="font-medium text-slate-900">{selectedVendor.region}</p>
                </div>
                <div className="p-4 border rounded-lg bg-slate-50">
                   <div className="flex items-center gap-2 mb-2 text-slate-500">
                      <TrendingUp className="h-4 w-4" /> <span className="text-xs font-semibold uppercase">Status</span>
                   </div>
                   <Badge className={selectedVendor.status === 'Active' ? 'bg-green-600' : 'bg-amber-600'}>
                     {selectedVendor.status}
                   </Badge>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-3">
                 <h4 className="text-sm font-medium text-slate-900">Contact Information</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-2 border rounded-md">
                       <Mail className="h-4 w-4 text-slate-400" />
                       <span className="text-sm">{selectedVendor.email}</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 border rounded-md">
                       <Phone className="h-4 w-4 text-slate-400" />
                       <span className="text-sm">{selectedVendor.phone}</span>
                    </div>
                 </div>
              </div>

               {/* Quick Actions */}
               <div className="space-y-3 pt-2">
                 <h4 className="text-sm font-medium text-slate-900">Quick Actions</h4>
                 <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                       <FileCheck className="mr-2 h-4 w-4" /> Audit Logs
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                       <Car className="mr-2 h-4 w-4" /> View Fleet
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                       Suspend
                    </Button>
                 </div>
               </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManageOpen(false)}>Close</Button>
            <Button onClick={handleSaveChanges} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

// --- Helper Component for Stat Cards ---
function StatCard({ title, value, trend, sub, trendColor, icon: Icon, iconBg, iconColor }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-bold text-slate-800">{value}</p>
              {trend && (
                <span className={`text-xs font-medium flex items-center ${trendColor}`}>
                  <TrendingUp className="h-3 w-3 mr-1" /> {trend}
                </span>
              )}
              {sub && <span className="text-xs text-slate-400">{sub}</span>}
            </div>
          </div>
          <div className={`p-2 rounded-full ${iconBg}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}




// import Topbar from "@/components/Topbar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Activity, TrendingUp, Users, AlertCircle } from "lucide-react";

// export default function SuperVendorDashboard() {
//   return (
//     <div className="min-h-screen bg-slate-50/50">
//       <Topbar title="Super Vendor Dashboard" />
      
//       <main className="p-6 space-y-6">
//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <StatCard title="Total Vendors" value="24" sub="Active partners" icon={Users} color="text-blue-600" />
//           <StatCard title="Total Revenue" value="$45,231" sub="+12% this month" icon={TrendingUp} color="text-green-600" />
//           <StatCard title="Active Trips" value="156" sub="Currently live" icon={Activity} color="text-purple-600" />
//           <StatCard title="Issues Reported" value="3" sub="Requires attention" icon={AlertCircle} color="text-red-600" />
//         </div>

//         {/* Content Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Card className="shadow-sm">
//             <CardHeader>
//               <CardTitle>Recent Vendor Performance</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {['Alpha Transport', 'Beta Logistics', 'Gamma Fleet'].map((vendor, i) => (
//                   <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
//                     <div>
//                       <p className="font-medium">{vendor}</p>
//                       <p className="text-xs text-slate-500">Bangalore Region</p>
//                     </div>
//                     <span className="text-sm font-bold text-green-600">98% On-Time</span>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="shadow-sm">
//             <CardHeader>
//               <CardTitle>System Notifications</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex gap-3 items-start border-l-4 border-yellow-400 bg-yellow-50 p-3">
//                   <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium text-yellow-800">License Expiry Warning</p>
//                     <p className="text-xs text-yellow-700">Vendor "QuickCabs" documents expire in 2 days.</p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     </div>
//   );
// }

// // Helper Component for Stats
// function StatCard({ title, value, sub, icon: Icon, color }) {
//   return (
//     <Card>
//       <CardContent className="p-6 flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-slate-500">{title}</p>
//           <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
//           <p className="text-xs text-slate-500 mt-1">{sub}</p>
//         </div>
//         <div className={`p-3 rounded-full bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
//           <Icon className={`w-6 h-6 ${color}`} />
//         </div>
//       </CardContent>
//     </Card>
//   );
// }