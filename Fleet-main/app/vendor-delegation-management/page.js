"use client";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  Save,
  RotateCcw
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast"; // Ensure hook exists or remove
import { motion } from "framer-motion";

// --- MOCK DATA (Inlined) ---
const vendors = [
  { vendorId: "V001", name: "Alpha Transport", vendorType: "regionalVendor", status: "Active" },
  { vendorId: "V002", name: "Metro Cabs", vendorType: "cityVendor", status: "Active" }, // Not eligible
  { vendorId: "V003", name: "South Zone Logistics", vendorType: "regionalVendor", status: "Inactive" },
  { vendorId: "V004", name: "Safe Ride Partners", vendorType: "regionalVendor", status: "Active" },
];

const permissions = [
  {
    id: "fleet_onboarding",
    category: "Fleet Management",
    actions: [
      { id: "manage_vehicles", name: "Add/Edit Vehicles" },
      { id: "assign_vehicles", name: "Assign Vehicles to Drivers" },
    ],
  },
  {
    id: "driver_onboarding",
    category: "Driver Management",
    actions: [
      { id: "manage_drivers", name: "Add/Verify Drivers" },
      { id: "driver_docs", name: "Approve Driver Documents" },
    ],
  },
  {
    id: "operations",
    category: "Operations",
    actions: [
      { id: "view_reports", name: "View Financial Reports" },
    ],
  },
];

export default function VendorDelegationManagement() {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorPermissions, setVendorPermissions] = useState({});
  const [delegationStatus, setDelegationStatus] = useState({});
  
  // Safe toast fallback
  const { toast } = useToast() || { toast: console.log };

  // 1. Initialize Data
  useEffect(() => {
    const initialPermissions = {};
    const initialDelegationStatus = {};

    vendors.forEach((vendor) => {
      initialPermissions[vendor.vendorId] = {};
      permissions.forEach((category) => {
        category.actions.forEach((action) => {
          initialPermissions[vendor.vendorId][`${category.id}_${action.id}`] = false;
        });
      });
      initialDelegationStatus[vendor.vendorId] = false;
    });

    setVendorPermissions(initialPermissions);
    setDelegationStatus(initialDelegationStatus);
  }, []);

  // 2. Helpers
  const isVendorEligible = (vendor) => {
    return vendor.vendorType === "regionalVendor" && vendor.status === "Active";
  };

  // 3. Handlers
  const handlePermissionToggle = (categoryId, actionId) => {
    if (!selectedVendor || !isVendorEligible(selectedVendor)) return;

    setVendorPermissions((prev) => ({
      ...prev,
      [selectedVendor.vendorId]: {
        ...prev[selectedVendor.vendorId],
        [`${categoryId}_${actionId}`]: !prev[selectedVendor.vendorId][`${categoryId}_${actionId}`],
      },
    }));
  };

  const handleDelegationToggle = (vendorId) => {
    const vendor = vendors.find((v) => v.vendorId === vendorId);
    if (!isVendorEligible(vendor)) return;

    setDelegationStatus((prev) => ({
      ...prev,
      [vendorId]: !prev[vendorId],
    }));

    // If turning OFF, reset permissions
    if (delegationStatus[vendorId]) {
      handleResetForVendor(vendorId);
    }
  };

  const handleResetForVendor = (vendorId) => {
    setVendorPermissions((prev) => ({
      ...prev,
      [vendorId]: Object.keys(prev[vendorId]).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {}
      ),
    }));
  };

  const handleSave = () => {
    toast({
      title: "Permissions Saved",
      description: `Delegation settings for ${selectedVendor?.name} updated.`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Topbar title="Delegation Management" />
      
      <div className="p-6">
        <Tabs defaultValue="manage" className="w-full">
          <TabsList className="mb-6 w-full md:w-auto grid grid-cols-2 md:inline-flex">
            <TabsTrigger value="manage">Manage Permissions</TabsTrigger>
            <TabsTrigger value="requests">Activity & Requests</TabsTrigger>
          </TabsList>

          {/* --- TAB 1: MANAGE PERMISSIONS (Code A Logic) --- */}
          <TabsContent value="manage">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Col: Vendor List */}
              <div className="lg:col-span-5">
                <Card className="h-full border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle>Regional Vendors</CardTitle>
                    <CardDescription>Select a vendor to configure access.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="pl-6">Vendor Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right pr-6">Access</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vendors.map((vendor) => (
                          <TableRow 
                            key={vendor.vendorId} 
                            className={`cursor-pointer transition-colors ${selectedVendor?.vendorId === vendor.vendorId ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-slate-50"}`}
                            onClick={() => setSelectedVendor(vendor)}
                          >
                            <TableCell className="pl-6 font-medium">
                              <div className="flex flex-col">
                                <span>{vendor.name}</span>
                                <span className="text-xs text-slate-400 font-normal capitalize">{vendor.vendorType.replace(/([A-Z])/g, " $1")}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={vendor.status === "Active" ? "default" : "secondary"} className={vendor.status === "Active" ? "bg-green-600" : "bg-slate-400"}>
                                {vendor.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <div 
                                className="flex justify-end" 
                                onClick={(e) => e.stopPropagation()} // Prevent row click when toggling switch
                              >
                                <Switch 
                                  checked={delegationStatus[vendor.vendorId] || false}
                                  disabled={!isVendorEligible(vendor)}
                                  onCheckedChange={() => handleDelegationToggle(vendor.vendorId)}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Right Col: Permissions Matrix */}
              <div className="lg:col-span-7">
                <Card className="h-full border-slate-200 shadow-sm">
                  <CardHeader className="border-b border-slate-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Configuration</CardTitle>
                        <CardDescription>
                          {selectedVendor ? `Editing: ${selectedVendor.name}` : "No vendor selected"}
                        </CardDescription>
                      </div>
                      {selectedVendor && isVendorEligible(selectedVendor) && (
                        <ShieldCheck className={`h-6 w-6 ${delegationStatus[selectedVendor.vendorId] ? "text-green-600" : "text-slate-300"}`} />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {selectedVendor ? (
                      isVendorEligible(selectedVendor) ? (
                        delegationStatus[selectedVendor.vendorId] ? (
                          <div className="space-y-6 animate-in fade-in duration-300">
                             {/* Permission Lists */}
                            {permissions.map((category) => (
                              <div key={category.id} className="space-y-3">
                                <h4 className="font-semibold text-sm text-slate-900 uppercase tracking-wider">{category.category}</h4>
                                <div className="bg-slate-50 rounded-lg border border-slate-200 divide-y divide-slate-100">
                                  {category.actions.map((action) => (
                                    <div key={action.id} className="flex items-center justify-between p-3">
                                      <span className="text-sm text-slate-700 font-medium">{action.name}</span>
                                      <Switch 
                                        checked={vendorPermissions[selectedVendor.vendorId]?.[`${category.id}_${action.id}`] || false}
                                        onCheckedChange={() => handlePermissionToggle(category.id, action.id)}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}

                            <div className="flex justify-end gap-3 pt-4 border-t">
                              <Button variant="ghost" onClick={() => handleResetForVendor(selectedVendor.vendorId)}>
                                <RotateCcw className="mr-2 h-4 w-4" /> Reset
                              </Button>
                              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-center p-6">
                             <div className="bg-slate-100 p-4 rounded-full mb-4">
                                <ShieldCheck className="h-8 w-8 text-slate-400" />
                             </div>
                             <h3 className="font-semibold text-slate-900">Delegation Disabled</h3>
                             <p className="text-sm mt-2 max-w-xs">Enable the toggle in the vendor list or click below to start configuring permissions for this vendor.</p>
                             <Button variant="outline" className="mt-4" onClick={() => handleDelegationToggle(selectedVendor.vendorId)}>Enable Delegation</Button>
                          </div>
                        )
                      ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-red-400 text-center">
                          <XCircle className="h-10 w-10 mb-3 opacity-50" />
                          <p className="font-medium">Vendor not eligible for delegation</p>
                        </div>
                      )
                    ) : (
                      <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-center">
                         <AlertCircle className="h-10 w-10 mb-3 opacity-20" />
                         <p>Select a vendor from the list to manage permissions</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* --- TAB 2: REQUESTS (Code B Logic) --- */}
          <TabsContent value="requests">
             <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 max-w-4xl"
              >
                <DelegationCard 
                  company="SafeTravels Corp" 
                  request="Route Optimization - Sector 4"
                  date="23 Nov 2024"
                  status="Pending"
                />
                <DelegationCard 
                  company="South Zone Logistics" 
                  request="Vehicle Audit - 50 Cars"
                  date="22 Nov 2024"
                  status="Pending"
                />
                 <DelegationCard 
                  company="Alpha Transport" 
                  request="Driver Database Access (Read-Only)"
                  date="20 Nov 2024"
                  status="Pending"
                />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Sub-component for Request Cards (From Code B)
function DelegationCard({ company, request, date }) {
  return (
    <Card className="border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-4 items-center">
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <Clock size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">{company}</h4>
            <p className="text-sm text-slate-600 font-medium">{request}</p>
            <p className="text-xs text-slate-400 mt-1">Requested: {date}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200">Reject</Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white shadow-sm">Approve Request</Button>
        </div>
      </CardContent>
    </Card>
  )
}