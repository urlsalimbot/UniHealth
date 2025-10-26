import PrescriptionStoreController from '@/actions/App/Http/Controllers/Patients/Encounters/PrescriptionStoreController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Transition } from '@headlessui/react';
import { Form } from '@inertiajs/react';

export default function PatientPrescriptionForm({ data = {}, patient, encounter }: any) {
    return (
        <Form {...PrescriptionStoreController.store.form({ id: patient.patient_id, encounter: encounter.encounter_id })} className="space-y-8">
            {({ processing, recentlySuccessful, errors }) => (
                <>
                    {/* --- Prescription Details --- */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="medication_id">Medication ID</Label>
                            <Input id="medication_id" name="medication_id" type="text" defaultValue={data?.medication_id ?? ''} />
                            <InputError message={errors.medication_id} />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="dosage">Dosage (e.g. 500mg)</Label>
                            <Input id="dosage" name="dosage" type="text" defaultValue={data?.dosage ?? ''} />
                            <InputError message={errors.dosage} />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="frequency">Frequency (e.g. 3x/day)</Label>
                            <Input id="frequency" name="frequency" type="text" defaultValue={data?.frequency ?? ''} />
                            <InputError message={errors.frequency} />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="route">Route (e.g. Oral, IV)</Label>
                            <Input id="route" name="route" type="text" defaultValue={data?.route ?? ''} />
                            <InputError message={errors.route} />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="duration">Duration (e.g. 7 days)</Label>
                            <Input id="duration" name="duration" type="text" defaultValue={data?.duration ?? ''} />
                            <InputError message={errors.duration} />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="quantity_prescribed">Quantity Prescribed</Label>
                            <Input id="quantity_prescribed" name="quantity_prescribed" type="number" defaultValue={data?.quantity_prescribed ?? ''} />
                            <InputError message={errors.quantity_prescribed} />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="refills_allowed">Refills Allowed</Label>
                            <Input id="refills_allowed" name="refills_allowed" type="number" defaultValue={data?.refills_allowed ?? ''} />
                            <InputError message={errors.refills_allowed} />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="prescription_status">Status (e.g. Active, Completed)</Label>
                            <Input id="prescription_status" name="prescription_status" type="text" defaultValue={data?.prescription_status ?? ''} />
                            <InputError message={errors.prescription_status} />
                        </div>
                    </div>

                    {/* --- Date Information --- */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="prescription_date">Prescription Date</Label>
                            <Input id="prescription_date" name="prescription_date" type="date" defaultValue={data?.prescription_date ?? ''} />
                            <InputError message={errors.prescription_date} />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="start_date">Start Date</Label>
                            <Input id="start_date" name="start_date" type="date" defaultValue={data?.start_date ?? ''} />
                            <InputError message={errors.start_date} />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="end_date">End Date</Label>
                            <Input id="end_date" name="end_date" type="date" defaultValue={data?.end_date ?? ''} />
                            <InputError message={errors.end_date} />
                        </div>
                    </div>

                    {/* --- Text Areas --- */}
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="indication">Indication (Reason for Prescription)</Label>
                            <Textarea id="indication" name="indication" defaultValue={data?.indication ?? ''} />
                            <InputError message={errors.indication} />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="special_instructions">Special Instructions</Label>
                            <Textarea id="special_instructions" name="special_instructions" defaultValue={data?.special_instructions ?? ''} />
                            <InputError message={errors.special_instructions} />
                        </div>
                    </div>

                    {/* --- Form Footer --- */}
                    <div className="mt-10 flex items-center justify-end gap-4">
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out duration-300"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out duration-300"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-muted-foreground">Prescription saved successfully!</p>
                        </Transition>

                        <Button type="submit" disabled={processing}>
                            Save Prescription
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
