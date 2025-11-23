"use client";
import { useState } from "react";
import Topbar from "@/components/Topbar"; // Kept your layout consistency
import {
  Car,
  User,
  AlertCircle,
  Plus,
  Calendar,
  Search,
  CheckCircle2,
  Edit,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Removed external data import to ensure this file works standalone
import { useToast } from "@/hooks/use-toast"; // Ensure you have this hook or remove if not
import { motion } from "framer-motion";

// --- MOCK DATA (Included inline for functionality) ---
const vehiclesData = [
  { vehicleId: "V1", registrationNumber: "KA-01-AB-1234", model: "Toyota Innova", seatingCapacity: 7, fuelType: "Diesel", status: "Active", documentStatus: "Approved", assignedDriver: "Ramesh Kumar" },
  { vehicleId: "V2", registrationNumber: "KA-05-XY-9876", model: "Maruti Swift", seatingCapacity: 4, fuelType: "Petrol", status: "Inactive", documentStatus: "Pending", assignedDriver: null },
  { vehicleId: "V3", registrationNumber: "MH-12-ZZ-5555", model: "Tempo Traveller", seatingCapacity: 12, fuelType: "Diesel", status: "Maintenance", documentStatus: "Approved", assignedDriver: "John Doe" },
];

const driversData = [
  { driverId: "D1", name: "Ramesh Kumar", email: "ramesh@example.com", assignedVehicleName: "Toyota Innova", licenseNumber: "DL-KA-2010-001", licenseExpiryDate: "2026-05-20", status: "Valid", documentStatus: "Valid" },
  { driverId: "D2", name: "John Doe", email: "john@example.com", assignedVehicleName: "Tempo Traveller", licenseNumber: "DL-MH-2015-999", licenseExpiryDate: "2025-11-15", status: "Valid", documentStatus: "Valid" },
  { driverId: "D3", name: "Suresh Singh", email: "suresh@example.com", assignedVehicleName: "Not Assigned", licenseNumber: "DL-KA-2022-123", licenseExpiryDate: "2024-01-01", status: "Expired", documentStatus: "Expired" },
];

export default function FleetDriverManagement() {
  const [activeTab, setActiveTab] = useState("vehicles");
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [vehicles, setVehicles] = useState(vehiclesData);
  const [drivers, setDrivers] = useState(driversData);
  const [searchQuery, setSearchQuery] = useState("");

  // Safely check if toast exists (in case hook is missing)
  const { toast } = useToast() || { toast: console.log };

  // Filter vehicles
  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter drivers
  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- FORM COMPONENTS ---

  const VehicleForm = () => {
    const [errors, setErrors] = useState({});
    const [newVehicle, setNewVehicle] = useState({
      registrationNumber: "",
      model: "",
      seatingCapacity: "",
      fuelType: "",
      status: "Active",
      documentStatus: "Pending",
    });

    const validateForm = () => {
      const newErrors = {};
      if (!newVehicle.registrationNumber.trim()) newErrors.registrationNumber = "Registration number is required";
      if (!newVehicle.model.trim()) newErrors.model = "Model is required";
      if (!newVehicle.seatingCapacity || newVehicle.seatingCapacity <= 0) newErrors.seatingCapacity = "Valid capacity required";
      if (!newVehicle.fuelType) newErrors.fuelType = "Fuel type is required";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleAddVehicle = (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      const vehicleId = `V${vehicles.length + 1}`;
      const newVehicleData = {
        vehicleId,
        ...newVehicle,
        assignedDriver: null,
        seatingCapacity: parseInt(newVehicle.seatingCapacity),
        createdAt: new Date().toISOString(),
      };

      setVehicles([...vehicles, newVehicleData]);
      setShowAddVehicle(false);
      setNewVehicle({ registrationNumber: "", model: "", seatingCapacity: "", fuelType: "", status: "Active", documentStatus: "Pending" });
      
      toast({ title: "Vehicle added successfully", description: "Vehicle details have been saved" });
    };

    return (
      <form onSubmit={handleAddVehicle} className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Input
            placeholder="Registration Number"
            value={newVehicle.registrationNumber}
            onChange={(e) => setNewVehicle({ ...newVehicle, registrationNumber: e.target.value })}
            className={errors.registrationNumber ? "border-red-500" : ""}
          />
          {errors.registrationNumber && <p className="text-red-500 text-xs">{errors.registrationNumber}</p>}
        </div>
        <div className="space-y-1">
          <Input
            placeholder="Model"
            value={newVehicle.model}
            onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
            className={errors.model ? "border-red-500" : ""}
          />
          {errors.model && <p className="text-red-500 text-xs">{errors.model}</p>}
        </div>
        <div className="space-y-1">
          <Input
            placeholder="Seating Capacity"
            type="number"
            min="1"
            value={newVehicle.seatingCapacity}
            onChange={(e) => setNewVehicle({ ...newVehicle, seatingCapacity: e.target.value })}
            className={errors.seatingCapacity ? "border-red-500" : ""}
          />
        </div>
        <div className="space-y-1">
          <Select value={newVehicle.fuelType} onValueChange={(value) => setNewVehicle({ ...newVehicle, fuelType: value })}>
            <SelectTrigger className={errors.fuelType ? "border-red-500" : ""}>
              <SelectValue placeholder="Fuel Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Petrol">Petrol</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="CNG">CNG</SelectItem>
              <SelectItem value="EV">Electric</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={() => setShowAddVehicle(false)}>Cancel</Button>
          <Button type="submit">Add Vehicle</Button>
        </div>
      </form>
    );
  };

  const DriverForm = () => {
    const [errors, setErrors] = useState({});
    const [newDriver, setNewDriver] = useState({
      name: "",
      email: "",
      assignedVehicle: "",
      licenseNumber: "",
      status: "Valid",
      documentStatus: "Pending",
      licenseExpiryDate: new Date().toISOString().split("T")[0],
    });

    const validateForm = () => {
      const newErrors = {};
      if (!newDriver.name.trim()) newErrors.name = "Full name is required";
      if (!newDriver.email.trim()) newErrors.email = "Email is required";
      if (!newDriver.licenseNumber.trim()) newErrors.licenseNumber = "License number is required";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleAddDriver = (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      const driverId = `D${drivers.length + 1}`;
      const newDriverData = {
        driverId,
        ...newDriver,
        createdAt: new Date().toISOString(),
        assignedVehicleName: newDriver.assignedVehicle
          ? vehicles.find((v) => v.registrationNumber === newDriver.assignedVehicle)?.model
          : "Not Assigned",
      };

      setDrivers([...drivers, newDriverData]);
      setShowAddDriver(false);
      
      toast({ title: "Driver added successfully", description: "Driver details have been saved" });
    };

    return (
      <form onSubmit={handleAddDriver} className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Input
            placeholder="Full Name"
            value={newDriver.name}
            onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>
        <div className="space-y-1">
          <Input
            placeholder="Email"
            type="email"
            value={newDriver.email}
            onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
            className={errors.email ? "border-red-500" : ""}
          />
        </div>
        <div className="space-y-1">
          <Input
            placeholder="License Number"
            value={newDriver.licenseNumber}
            onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
            className={errors.licenseNumber ? "border-red-500" : ""}
          />
        </div>
        <div className="space-y-1">
           <Select value={newDriver.assignedVehicle} onValueChange={(value) => setNewDriver({ ...newDriver, assignedVehicle: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Assign Vehicle" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.filter((vehicle) => !vehicle.assignedDriver).map((vehicle) => (
                <SelectItem key={vehicle.vehicleId} value={vehicle.registrationNumber}>
                  {vehicle.registrationNumber} - {vehicle.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={() => setShowAddDriver(false)}>Cancel</Button>
          <Button type="submit">Add Driver</Button>
        </div>
      </form>
    );
  };

  // --- MAIN RENDER ---

  return (
    <div>
      {/* 1. Added Topbar to maintain layout consistency */}
      <Topbar title="Fleet & Driver Management" />

      {/* 2. Main Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="p-6 space-y-6"
      >
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Overview</h1>
            <p className="text-sm text-slate-500">Manage your fleet, drivers, and assignments.</p>
          </div>

          <div className="flex space-x-2">
            <Dialog open={showAddVehicle} onOpenChange={setShowAddVehicle}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" /> Add Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Vehicle</DialogTitle>
                  <DialogDescription>Enter vehicle details and upload required documents</DialogDescription>
                </DialogHeader>
                <VehicleForm />
              </DialogContent>
            </Dialog>

            <Dialog open={showAddDriver} onOpenChange={setShowAddDriver}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Add Driver
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Driver</DialogTitle>
                  <DialogDescription>Enter driver details and upload required documents</DialogDescription>
                </DialogHeader>
                <DriverForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="vehicles" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="vehicles" onClick={() => setActiveTab("vehicles")}>
              <Car className="mr-2 h-4 w-4" /> Vehicles
            </TabsTrigger>
            <TabsTrigger value="drivers" onClick={() => setActiveTab("drivers")}>
              <User className="mr-2 h-4 w-4" /> Drivers
            </TabsTrigger>
          </TabsList>

          {/* --- VEHICLES TAB --- */}
          <TabsContent value="vehicles" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Vehicle Fleet</CardTitle>
                    <CardDescription>Total Vehicles: {vehicles.length}</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search reg no or model..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reg. Number</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Fuel</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Docs</TableHead>
                      <TableHead>Assigned Driver</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((vehicle) => (
                      <TableRow key={vehicle.vehicleId}>
                        <TableCell className="font-medium">{vehicle.registrationNumber}</TableCell>
                        <TableCell>{vehicle.model}</TableCell>
                        <TableCell>{vehicle.seatingCapacity}</TableCell>
                        <TableCell>{vehicle.fuelType}</TableCell>
                        <TableCell>
                          <Badge className={vehicle.status === "Active" ? "bg-green-600" : "bg-slate-500"}>
                            {vehicle.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {vehicle.documentStatus === "Approved" ? (
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
                            )}
                            {vehicle.documentStatus}
                          </div>
                        </TableCell>
                        <TableCell>
                          {vehicle.assignedDriver ? vehicle.assignedDriver : <span className="text-slate-400 italic">Unassigned</span>}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredVehicles.length === 0 && (
                      <TableRow>
                         <TableCell colSpan={7} className="h-24 text-center">No vehicles found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- DRIVERS TAB --- */}
          <TabsContent value="drivers" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Driver List</CardTitle>
                    <CardDescription>Total Drivers: {drivers.length}</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search name or license..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned Vehicle</TableHead>
                      <TableHead>License No.</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Docs</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow key={driver.driverId}>
                        <TableCell className="font-medium">{driver.name}</TableCell>
                        <TableCell>
                          <Badge className={driver.status === "Valid" ? "bg-green-600" : "bg-red-500"}>
                            {driver.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{driver.assignedVehicleName}</TableCell>
                        <TableCell className="font-mono text-xs">{driver.licenseNumber}</TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-slate-500">
                            <Calendar className="mr-2 h-3 w-3" />
                            {driver.licenseExpiryDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {driver.documentStatus === "Valid" ? (
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                            )}
                            {driver.documentStatus}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredDrivers.length === 0 && (
                       <TableRow>
                         <TableCell colSpan={6} className="h-24 text-center">No drivers found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}