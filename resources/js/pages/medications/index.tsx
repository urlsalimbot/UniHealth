import React from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function Index() {
  const { medications, flash } = usePage().props as any;

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this medication?")) {
      router.delete(route("medications.destroy", id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medications</h1>
        <Link
          href={route("medications.create")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          + Add Medication
        </Link>
      </div>

      {flash?.success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {flash.success}
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">Generic Name</th>
              <th className="px-4 py-2 border-b">Brand Names</th>
              <th className="px-4 py-2 border-b">Strength</th>
              <th className="px-4 py-2 border-b">Dosage Form</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medications.data.map((med) => (
              <tr key={med.medication_id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{med.generic_name}</td>
                <td className="px-4 py-2 border-b">{med.brand_names}</td>
                <td className="px-4 py-2 border-b">{med.strength}</td>
                <td className="px-4 py-2 border-b">{med.dosage_form}</td>
                <td className="px-4 py-2 border-b">
                  <Link
                    href={route("medications.edit", med.medication_id)}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(med.medication_id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center space-x-2">
        {medications.links.map((link, i) => (
          <button
            key={i}
            disabled={!link.url}
            onClick={() => link.url && router.visit(link.url)}
            className={`px-3 py-1 rounded ${
              link.active
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {link.label.replace("&raquo;", "›").replace("&laquo;", "‹")}
          </button>
        ))}
      </div>
    </div>
  );
}
