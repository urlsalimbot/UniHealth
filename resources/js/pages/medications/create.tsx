import React, { FormEvent } from "react";
import { useForm, Link } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    generic_name: "",
    brand_names: "",
    strength: "",
    dosage_form: "",
    drug_class: "",
    controlled_substance: false,
    fda_registration: "",
  });

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault();
    post(route("medications.store"));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Medication</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block font-medium">Generic Name</label>
          <input
            type="text"
            value={data.generic_name}
            onChange={(e) => setData("generic_name", e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
          {errors.generic_name && <p className="text-red-600 text-sm">{errors.generic_name}</p>}
        </div>

        <div>
          <label className="block font-medium">Brand Names</label>
          <input
            type="text"
            value={data.brand_names}
            onChange={(e) => setData("brand_names", e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Strength</label>
            <input
              type="text"
              value={data.strength}
              onChange={(e) => setData("strength", e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Dosage Form</label>
            <input
              type="text"
              value={data.dosage_form}
              onChange={(e) => setData("dosage_form", e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Drug Class</label>
          <input
            type="text"
            value={data.drug_class}
            onChange={(e) => setData("drug_class", e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={data.controlled_substance}
              onChange={(e) => setData("controlled_substance", e.target.checked)}
              className="mr-2"
            />
            Controlled Substance
          </label>
        </div>

        <div>
          <label className="block font-medium">FDA Registration</label>
          <input
            type="text"
            value={data.fda_registration}
            onChange={(e) => setData("fda_registration", e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex justify-between mt-6">
          <Link
            href={route("medications.index")}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={processing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
