import { Form, Link } from '@inertiajs/react';

export default function Create({ data = null, mode = 'create', ...Actions }: any) {
    return (
        <div className="mx-auto max-w-3xl p-6">
            <h1 className="mb-6 text-2xl font-bold">Add Medication</h1>

            <Form {...Actions} className="space-y-10">
                {({ processing, recentlySuccessful, errors }) => (
                    <>
                        <div>
                            <label className="block font-medium">Generic Name</label>
                            <input
                                type="text"
                                value={data.generic_name}
                                onChange={(e) => setData('generic_name', e.target.value)}
                                className="mt-1 w-full rounded-lg border px-3 py-2"
                            />
                            {errors.generic_name && <p className="text-sm text-red-600">{errors.generic_name}</p>}
                        </div>

                        <div>
                            <label className="block font-medium">Brand Names</label>
                            <input
                                type="text"
                                value={data.brand_names}
                                onChange={(e) => setData('brand_names', e.target.value)}
                                className="mt-1 w-full rounded-lg border px-3 py-2"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-medium">Strength</label>
                                <input
                                    type="text"
                                    value={data.strength}
                                    onChange={(e) => setData('strength', e.target.value)}
                                    className="mt-1 w-full rounded-lg border px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block font-medium">Dosage Form</label>
                                <input
                                    type="text"
                                    value={data.dosage_form}
                                    onChange={(e) => setData('dosage_form', e.target.value)}
                                    className="mt-1 w-full rounded-lg border px-3 py-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium">Drug Class</label>
                            <input
                                type="text"
                                value={data.drug_class}
                                onChange={(e) => setData('drug_class', e.target.value)}
                                className="mt-1 w-full rounded-lg border px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.controlled_substance}
                                    onChange={(e) => setData('controlled_substance', e.target.checked)}
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
                                onChange={(e) => setData('fda_registration', e.target.value)}
                                className="mt-1 w-full rounded-lg border px-3 py-2"
                            />
                        </div>

                        <div className="mt-6 flex justify-between">
                            <Link href={medications.index.url()} className="rounded-lg bg-gray-300 px-4 py-2 hover:bg-gray-400">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </>
                )}
            </Form>
        </div>
    );
}
