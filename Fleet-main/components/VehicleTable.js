// components/VehicleTable.js
"use client";
import { CheckCircle2, AlertCircle, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * VehicleTable - reusable, interactive table for vehicles.
 * Props:
 * - vehicles: array of vehicle objects
 * - onEdit: function(vehicle)
 */
export default function VehicleTable({ vehicles = [], onEdit }) {
  return (
    <div className="card p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">Vehicle Fleet</h3>
          <p className="text-sm text-gray-500">Review vehicles and documents</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-compact">
          <thead>
            <tr className="text-sm text-gray-500 border-b">
              <th className="py-3">Reg. No</th>
              <th>Model</th>
              <th>Capacity</th>
              <th>Fuel</th>
              <th>Status</th>
              <th>Documents</th>
              <th>Driver</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((v) => (
              <tr key={v.vehicleId} className="border-b hover:bg-gray-50">
                <td className="py-4 font-medium">{v.registrationNumber}</td>
                <td>{v.model}</td>
                <td>{v.seatingCapacity}</td>
                <td>{v.fuelType}</td>

                <td>
                  <Badge variant={v.status === "Active" ? "success" : "warning"}>
                    {v.status}
                  </Badge>
                </td>

                <td>
                  <div className="flex items-center gap-2">
                    {v.documentStatus === "Approved" ? (
                      <CheckCircle2 className="text-green-500" />
                    ) : (
                      <AlertCircle className="text-amber-500" />
                    )}
                    <span>{v.documentStatus}</span>
                  </div>
                </td>

                <td>
                  {v.assignedDriver ?? <span className="text-gray-400 italic">Not assigned</span>}
                </td>

                <td>
                  <Button variant="ghost" size="sm" onClick={() => onEdit?.(v)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
