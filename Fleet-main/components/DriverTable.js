// components/DriverTable.js
"use client";
import { Calendar, CheckCircle2, AlertCircle, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * DriverTable - reusable driver table
 * Props:
 * - drivers: array
 * - onEdit(driver)
 */
export default function DriverTable({ drivers = [], onEdit }) {
  return (
    <div className="card p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Drivers</h3>
        <p className="text-sm text-gray-500">Manage drivers and their documentation</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-compact">
          <thead>
            <tr className="text-sm text-gray-500 border-b">
              <th className="py-3">Name</th>
              <th>Status</th>
              <th>Vehicle</th>
              <th>License No.</th>
              <th>Expiry</th>
              <th>Documents</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {drivers.map((d) => (
              <tr key={d.driverId} className="border-b hover:bg-gray-50">
                <td className="py-4 font-medium">{d.name}</td>

                <td>
                  <Badge variant={d.status === "Active" ? "success" : "warning"}>
                    {d.status}
                  </Badge>
                </td>

                <td>{d.assignedVehicleName ?? <span className="text-gray-400 italic">None</span>}</td>
                <td>{d.licenseNumber}</td>

                <td>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{d.licenseExpiryDate}</span>
                  </div>
                </td>

                <td>
                  <div className="flex items-center gap-2">
                    {d.documentStatus === "Valid" ? (
                      <CheckCircle2 className="text-green-500" />
                    ) : (
                      <AlertCircle className="text-amber-500" />
                    )}
                    <span>{d.documentStatus}</span>
                  </div>
                </td>

                <td>
                  <Button variant="ghost" size="sm" onClick={() => onEdit?.(d)}>
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
