import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Transition } from '@headlessui/react';
import { Form } from '@inertiajs/react';
import { useMemo, useState } from 'react';

type Medication = {
    medication_id: string;
    generic_name: string;
    brand_names?: string;
    strength?: string;
    dosage_form?: string;
};

export default function StockForm({ medications = [], facilities = [], ...Actions }: any) {
    const [search, setSearch] = useState('');
    const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

    const filteredMedications = useMemo(() => {
        return medications.filter(
            (m: Medication) =>
                m.generic_name.toLowerCase().includes(search.toLowerCase()) || (m.brand_names ?? '').toLowerCase().includes(search.toLowerCase()),
        );
    }, [search, medications]);

    return (
        <Form {...Actions} className="space-y-8">
            {({ processing, recentlySuccessful, errors }) => (  
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* LEFT SIDE: Medication Selector */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Select Medication</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Input placeholder="Search medication..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-3" />
                            <ScrollArea className="h-[400px] rounded-md border p-2">
                                {filteredMedications.length > 0 ? (
                                    filteredMedications.map((m: Medication) => (
                                        <div
                                            key={m.medication_id}
                                            onClick={() => setSelectedMedication(m)}
                                            className={cn(
                                                'cursor-pointer rounded-md p-2 text-sm hover:bg-accent',
                                                selectedMedication?.medication_id === m.medication_id && 'bg-accent',
                                            )}
                                        >
                                            <p className="font-medium">{m.generic_name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {m.brand_names} • {m.strength} {m.dosage_form}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="p-2 text-sm text-muted-foreground">No matches found</p>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* RIGHT SIDE: Intake Form */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Inventory Intake</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Selected Medication Preview */}
                            <div className="rounded-lg bg-muted p-3 text-sm">
                                {selectedMedication ? (
                                    <>
                                        <p className="font-semibold">{selectedMedication.generic_name}</p>
                                        <p className="text-muted-foreground">
                                            {selectedMedication.brand_names} — {selectedMedication.strength} {selectedMedication.dosage_form}
                                        </p>
                                        <input type="hidden" name="medication_id" value={selectedMedication.medication_id} />
                                    </>
                                ) : (
                                    <p className="text-muted-foreground">Select a medication from the left.</p>
                                )}
                            </div>

                            {/* Grid Fields */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="facility_id">Facility</Label>
                                    <select id="facility_id" name="facility_id" className="w-full rounded-md border p-2 text-sm">
                                        <option value="">Select facility</option>
                                        {facilities.map((f: any) => (
                                            <option key={f.facility_id} value={f.facility_id}>
                                                {f.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors['facility_id']} />
                                </div>

                                <div>
                                    <Label htmlFor="current_stock">Current Stock</Label>
                                    <Input id="current_stock" name="current_stock" type="number" min="0" />
                                    <InputError message={errors['current_stock']} />
                                </div>

                                <div>
                                    <Label htmlFor="minimum_stock_level">Minimum Stock Level</Label>
                                    <Input id="minimum_stock_level" name="minimum_stock_level" type="number" min="0" />
                                    <InputError message={errors['minimum_stock_level']} />
                                </div>

                                <div>
                                    <Label htmlFor="lot_number">Lot Number</Label>
                                    <Input id="lot_number" name="lot_number" />
                                </div>

                                <div>
                                    <Label htmlFor="expiration_date">Expiration Date</Label>
                                    <Input id="expiration_date" name="expiration_date" type="date" />
                                </div>

                                <div>
                                    <Label htmlFor="unit_cost">Unit Cost</Label>
                                    <Input id="unit_cost" name="unit_cost" type="number" step="0.01" />
                                </div>

                                <div>
                                    <Label htmlFor="storage_location">Storage Location</Label>
                                    <Input id="storage_location" name="storage_location" />
                                </div>

                                <div>
                                    <Label htmlFor="supplier">Supplier</Label>
                                    <Input id="supplier" name="supplier" />
                                </div>

                                <div>
                                    <Label htmlFor="received_date">Received Date</Label>
                                    <Input id="received_date" name="received_date" type="date" />
                                </div>

                                <div>
                                    <Label htmlFor="received_by">Received By</Label>
                                    <Input id="received_by" name="received_by" />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Submit Intake
                                </Button>
                            </div>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out duration-300"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out duration-300"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-muted-foreground">Saved successfully!</p>
                            </Transition>
                        </CardContent>
                    </Card>
                </div>
            )}
        </Form>
    );
}
