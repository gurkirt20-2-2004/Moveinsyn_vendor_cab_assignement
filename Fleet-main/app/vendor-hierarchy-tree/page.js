"use client";
import { useState, useCallback, useMemo } from "react";
import Topbar from "@/components/Topbar"; // Integrated Layout
import { Search, Edit, Plus, User, MapPin, Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast"; // Ensure hook exists
import { motion } from "framer-motion";

// --- INLINED MOCK DATA (Replaces ../data/nodes) ---
const initialNodes = [
  {
    id: "1",
    type: "superVendorNode",
    position: { x: 450, y: 0 },
    data: { label: { name: "MoveInSync HQ", email: "admin@moveinsync.com" } },
  },
  {
    id: "2",
    type: "regionalVendorNode",
    position: { x: 150, y: 200 },
    data: { label: { name: "North Zone Head", email: "north@logistics.com" } },
  },
  {
    id: "3",
    type: "regionalVendorNode",
    position: { x: 750, y: 200 },
    data: { label: { name: "South Zone Head", email: "south@logistics.com" } },
  },
  {
    id: "4",
    type: "cityVendorNode",
    position: { x: 0, y: 400 },
    data: { label: { name: "Delhi Cabs", email: "delhi@cabs.com" } },
  },
  {
    id: "5",
    type: "cityVendorNode",
    position: { x: 300, y: 400 },
    data: { label: { name: "Noida Transport", email: "noida@trans.com" } },
  },
  {
    id: "6",
    type: "cityVendorNode",
    position: { x: 600, y: 400 },
    data: { label: { name: "Bangalore Fleet", email: "blr@fleet.com" } },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", type: "smoothstep", animated: true },
  { id: "e1-3", source: "1", target: "3", type: "smoothstep", animated: true },
  { id: "e2-4", source: "2", target: "4", type: "smoothstep" },
  { id: "e2-5", source: "2", target: "5", type: "smoothstep" },
  { id: "e3-6", source: "3", target: "6", type: "smoothstep" },
];

// --- NODE CONFIGURATION ---
// Counters for new nodes positioning
let regionalNodes = 3;
let cityNodes = 4;
let localNodes = 4;

const nodeColor = (type) => {
  switch (type) {
    case "superVendorNode": return "#2563eb"; // Blue
    case "regionalVendorNode": return "#f59e0b"; // Amber
    case "cityVendorNode": return "#ec4899"; // Pink
    case "localVendorNode": return "#10b981"; // Emerald
    default: return "#64748b";
  }
};

const nodeIcon = (type) => {
  switch (type) {
    case "superVendorNode": return <Building className="w-3 h-3 text-white" />;
    case "regionalVendorNode": return <MapPin className="w-3 h-3 text-white" />;
    default: return <User className="w-3 h-3 text-white" />;
  }
};

// --- CUSTOM NODE COMPONENT ---
const VendorNode = ({ data, isConnectable, type, id }) => {
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [selectedParent, setSelectedParent] = useState("");

  const getAvailableParents = () => {
    switch (type) {
      case "cityVendorNode":
        return initialNodes
          .filter((node) => node.type === "regionalVendorNode")
          .map((node) => ({ id: node.id, name: node.data.label.name }));
      case "localVendorNode":
        return initialNodes
          .filter((node) => node.type === "cityVendorNode")
          .map((node) => ({ id: node.id, name: node.data.label.name }));
      default:
        return [];
    }
  };

  const handleMove = () => {
    if (selectedParent) {
      data.onMoveVendor(id, selectedParent);
      setShowMoveDialog(false);
    }
  };

  return (
    <Card className="w-60 shadow-lg border-slate-200">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-slate-400" />

      <div className="relative">
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm"
          style={{ backgroundColor: nodeColor(type) }}
        >
          {nodeIcon(type)}
        </div>

        <div className="absolute top-2 right-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Edit className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />
              </TooltipTrigger>
              <TooltipContent><p>Edit Details</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <CardHeader className="pt-8 pb-3 text-center">
        <CardTitle className="text-sm font-bold text-slate-800">{data.label.name}</CardTitle>
        <CardDescription className="text-xs truncate text-slate-500">{data.label.email}</CardDescription>
      </CardHeader>

      {(type === "cityVendorNode" || type === "localVendorNode") && (
        <CardFooter className="p-3 bg-slate-50 border-t rounded-b-lg">
          <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full text-xs h-8 border-slate-300 hover:border-blue-500 hover:text-blue-600">
                Move Node
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Relocate Vendor</DialogTitle>
                <DialogDescription>Select a new parent for <b>{data.label.name}</b></DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Select onValueChange={setSelectedParent} value={selectedParent}>
                  <SelectTrigger><SelectValue placeholder="Select new parent node" /></SelectTrigger>
                  <SelectContent>
                    {getAvailableParents().map((parent) => (
                      <SelectItem key={parent.id} value={parent.id}>{parent.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowMoveDialog(false)}>Cancel</Button>
                <Button onClick={handleMove} disabled={!selectedParent} className="bg-blue-600 hover:bg-blue-700">Confirm Move</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      )}
      <Handle type="source" position={Position.Bottom} id="a" isConnectable={isConnectable} className="w-3 h-3 bg-slate-400" />
    </Card>
  );
};

const nodeTypes = {
  superVendorNode: VendorNode,
  regionalVendorNode: VendorNode,
  cityVendorNode: VendorNode,
  localVendorNode: VendorNode,
};

// --- MAIN PAGE COMPONENT ---
export default function VendorHierarchyTree() {
  const [searchTerm, setSearchTerm] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: "", email: "", type: "", parentId: "" });

  const { toast } = useToast() || { toast: console.log };

  // Filter Logic
  const filteredNodes = useMemo(() => {
    if (!searchTerm) return nodes;
    return nodes.map((node) => ({
      ...node,
      style: {
        ...node.style,
        opacity: (node.data.label.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 node.data.label.email.toLowerCase().includes(searchTerm.toLowerCase())) ? 1 : 0.1,
      },
    }));
  }, [nodes, searchTerm]);

  // Connect Logic
  const onConnect = useCallback((connection) => {
    setEdges((prev) => addEdge({ ...connection, id: `e-${connection.source}-${connection.target}`, type: "smoothstep", animated: true }, prev));
  }, [setEdges]);

  // Move Logic
  const handleMoveVendor = (vendorId, newParentId) => {
    const oldEdge = edges.find((edge) => edge.target === vendorId);
    if (oldEdge) setEdges((prev) => prev.filter((e) => e.id !== oldEdge.id));
    
    setEdges((prev) => [...prev, { id: `${newParentId}-${vendorId}`, source: newParentId, target: vendorId, type: "smoothstep", animated: true }]);
    
    toast({ title: "Vendor Moved", description: "Hierarchy updated successfully" });
  };

  // Add Logic
  const handleAddVendor = () => {
    const newId = `${nodes.length + 100}`;
    const parentNode = nodes.find((n) => n.id === newVendor.parentId);
    
    let newX = 0;
    if (newVendor.type === "regionalVendorNode") { newX = regionalNodes * 300; regionalNodes++; }
    else if (newVendor.type === "cityVendorNode") { newX = cityNodes * 300; cityNodes++; }
    
    const newNode = {
      id: newId,
      position: { x: newX || parentNode?.position.x, y: (parentNode?.position.y || 0) + 200 },
      type: newVendor.type,
      data: {
        label: { name: newVendor.name, email: newVendor.email },
        onMoveVendor: handleMoveVendor,
      },
    };

    setNodes((prev) => [...prev, newNode]);
    setEdges((prev) => [...prev, { id: `${newVendor.parentId}-${newId}`, source: newVendor.parentId, target: newId, type: "smoothstep", animated: true }]);
    
    setShowAddDialog(false);
    setNewVendor({ name: "", email: "", type: "", parentId: "" });
    toast({ title: "Vendor Added", description: `${newVendor.name} added to the tree.` });
  };

  const getAvailableParentTypes = (type) => {
    if (type === "regionalVendorNode") return nodes.filter(n => n.type === "superVendorNode");
    if (type === "cityVendorNode") return nodes.filter(n => n.type === "regionalVendorNode");
    if (type === "localVendorNode") return nodes.filter(n => n.type === "cityVendorNode");
    return [];
  };

  const LegendBadge = ({ color, label }) => (
    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border shadow-sm">
      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs font-medium text-slate-600">{label}</span>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <Topbar title="Vendor Hierarchy Tree" />

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="flex-1 flex flex-col relative overflow-hidden"
      >
        {/* Controls Toolbar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pointer-events-none">
          
          {/* Left: Search & Add */}
          <div className="flex gap-2 pointer-events-auto bg-white/80 backdrop-blur-sm p-2 rounded-lg border shadow-sm">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search vendor..." 
                className="pl-9 bg-white" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Plus className="w-4 h-4 mr-2" /> Add Node</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add New Vendor Node</DialogTitle></DialogHeader>
                <div className="space-y-3 pt-2">
                  <Input placeholder="Name" value={newVendor.name} onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })} />
                  <Input placeholder="Email" value={newVendor.email} onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })} />
                  <Select onValueChange={(val) => setNewVendor({ ...newVendor, type: val, parentId: "" })}>
                    <SelectTrigger><SelectValue placeholder="Vendor Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regionalVendorNode">Regional Vendor</SelectItem>
                      <SelectItem value="cityVendorNode">City Vendor</SelectItem>
                      <SelectItem value="localVendorNode">Local Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                  {newVendor.type && (
                    <Select onValueChange={(val) => setNewVendor({ ...newVendor, parentId: val })}>
                      <SelectTrigger><SelectValue placeholder="Assign Parent" /></SelectTrigger>
                      <SelectContent>
                        {getAvailableParentTypes(newVendor.type).map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.data.label.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Button onClick={handleAddVendor} disabled={!newVendor.name || !newVendor.parentId} className="w-full mt-2">Create Node</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Right: Legend */}
          <div className="flex flex-wrap gap-2 pointer-events-auto">
            <LegendBadge color="#2563eb" label="Super" />
            <LegendBadge color="#f59e0b" label="Regional" />
            <LegendBadge color="#ec4899" label="City" />
            <LegendBadge color="#10b981" label="Local" />
          </div>
        </div>

        {/* Graph Canvas */}
        <div className="flex-1 w-full h-full bg-slate-50">
          <ReactFlow
            nodes={filteredNodes.map(n => ({ ...n, data: { ...n.data, onMoveVendor: handleMoveVendor } }))}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-right"
          >
            <Background color="#cbd5e1" gap={20} size={1} />
            <Controls className="bg-white border-slate-200 shadow-md" />
          </ReactFlow>
        </div>
      </motion.div>
    </div>
  );
}