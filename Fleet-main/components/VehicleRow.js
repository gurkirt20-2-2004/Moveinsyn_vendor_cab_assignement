// components/VehicleRow.js
'use client'


export default function VehicleRow({ vehicle }) {
return (
<tr className="border-b hover:bg-neutral-50">
<td className="py-4 font-medium">{vehicle.reg}</td>
<td className="py-4">{vehicle.model}</td>
<td className="py-4">{vehicle.capacity}</td>
<td className="py-4">{vehicle.fuel}</td>
<td className="py-4">
<span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${vehicle.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
{vehicle.status}
</span>
</td>
<td className="py-4">{vehicle.doc}</td>
<td className="py-4 text-neutral-600">{vehicle.driver ?? <em className="text-neutral-400">Not assigned</em>}</td>
<td className="py-4"> <button className="p-2 border rounded">✎</button> </td>
</tr>
)
}