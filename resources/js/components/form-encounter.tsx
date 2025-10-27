    import EncounterCreateController from '@/actions/App/Http/Controllers/Patients/Encounters/EncounterCreateController';
    import InputError from '@/components/input-error';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Switch } from '@/components/ui/switch';
    import { Textarea } from '@/components/ui/textarea';
    import { Transition } from '@headlessui/react';
    import { Form } from '@inertiajs/react';
    import { useEffect, useState } from 'react';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

    type CreateEncounterModalProps = {
        patient: any;
        lastEncounter?: any;
        encounterTypes: string[];
        encounterClasses?: string[];
        encounterStatuses?: string[];
        facilities?: { id: string; name: string }[];
    };

    export default function CreateEncounterModal({
        patient,
        lastEncounter,
        encounterTypes,
        encounterClasses = ['Outpatient', 'Inpatient', 'Emergency'],
        encounterStatuses = ['Open', 'Ongoing', 'Completed', 'Discharged'],
        facilities = [],
    }: CreateEncounterModalProps) {
        const [open, setOpen] = useState(false);

        // Automatically set date and time when modal opens
        useEffect(() => {
            if (open) {
                const now = new Date();
                const date = now.toISOString().split('T')[0];
                const time = now.toTimeString().slice(0, 5);

                const dateInput = document.querySelector<HTMLInputElement>('input[name="encounter_date"]');
                const timeInput = document.querySelector<HTMLInputElement>('input[name="encounter_time"]');

                if (dateInput && !dateInput.value) dateInput.value = date;
                if (timeInput && !timeInput.value) timeInput.value = time;
            }
        }, [open]);

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="mb-3">➕ New Encounter</Button>
                </DialogTrigger>

                <DialogContent className="h-fit w-full max-w-[90vw] overflow-y-auto p-8 lg:max-w-7xl">
                    <DialogHeader>
                        <DialogTitle>
                            New Medical Encounter for {patient.last_name}, {patient.first_name}
                        </DialogTitle>
                    </DialogHeader>

                    <Form {...EncounterCreateController.store.form(patient.patient_id)} className="space-y-6">
                        {({ processing, recentlySuccessful, errors }) => (
                            <div className="space-y-6">
                                {/* === Encounter Form Layout === */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* === Encounter Info === */}
                                    <Card className="h-full">
                                        <CardHeader>
                                            <CardTitle>Encounter Information</CardTitle>
                                        </CardHeader>

                                        <CardContent className="grid grid-cols-2 gap-4">
                                            {/* Hidden patient_id */}
                                            <input type="hidden" name="patient_id" value={patient.patient_id} />

                                            {/* Encounter Type */}
                                            <div>
                                                <Label htmlFor="encounter_type">Encounter Type</Label>
                                                <Select name="encounter_type" defaultValue="">
                                                    <SelectTrigger id="encounter_type" className="w-full">
                                                        <SelectValue placeholder="Select encounter type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {encounterTypes.map((type, idx) => (
                                                            <SelectItem key={idx} value={type}>
                                                                {type}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <InputError message={errors['encounter_type']} />
                                            </div>

                                            {/* Encounter Class */}
                                            <div>
                                                <Label htmlFor="encounter_class">Encounter Class</Label>
                                                <Select name="encounter_class" defaultValue="">
                                                    <SelectTrigger id="encounter_class" className="w-full">
                                                        <SelectValue placeholder="Select encounter class" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {encounterClasses.map((cls, idx) => (
                                                            <SelectItem key={idx} value={cls}>
                                                                {cls}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <InputError message={errors['encounter_class']} />
                                            </div>

                                            {/* Encounter Status */}
                                            <div>
                                                <Label htmlFor="encounter_status">Encounter Status</Label>
                                                <Select name="encounter_status" defaultValue="Open">
                                                    <SelectTrigger id="encounter_status" className="w-full">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {encounterStatuses.map((status, idx) => (
                                                            <SelectItem key={idx} value={status}>
                                                                {status}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <InputError message={errors['encounter_status']} />
                                            </div>

                                            {/* Dates and Times */}
                                            <div>
                                                <Label htmlFor="encounter_date">Encounter Date</Label>
                                                <Input id="encounter_date" name="encounter_date" type="date" />
                                                <InputError message={errors['encounter_date']} />
                                            </div>

                                            <div>
                                                <Label htmlFor="encounter_time">Encounter Time</Label>
                                                <Input id="encounter_time" name="encounter_time" type="time" />
                                                <InputError message={errors['encounter_time']} />
                                            </div>

                                            <div>
                                                <Label htmlFor="admission_date">Admission Date</Label>
                                                <Input id="admission_date" name="admission_date" type="date" />
                                                <InputError message={errors['admission_date']} />
                                            </div>

                                            <div>
                                                <Label htmlFor="discharge_date">Discharge Date</Label>
                                                <Input id="discharge_date" name="discharge_date" type="date" />
                                                <InputError message={errors['discharge_date']} />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* === Clinical Details === */}
                                    <Card className="h-full">
                                        <CardHeader>
                                            <CardTitle>Clinical Details</CardTitle>
                                        </CardHeader>

                                        <CardContent className="grid grid-cols-1 gap-4">
                                            {lastEncounter && (
                                                <div className="rounded-lg bg-muted p-3 text-sm">
                                                    <p className="font-semibold">Prefill from last encounter:</p>
                                                    <p className="text-muted-foreground">Chief complaint: {lastEncounter.chief_complaint ?? 'N/A'}</p>
                                                    <p className="text-muted-foreground">Intervention: {lastEncounter.intervention ?? 'N/A'}</p>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-2"
                                                        onClick={() => {
                                                            const chief = document.querySelector<HTMLTextAreaElement>('textarea[name="chief_complaint"]');
                                                            const inter = document.querySelector<HTMLTextAreaElement>('textarea[name="intervention"]');
                                                            if (chief && inter) {
                                                                chief.value = lastEncounter.chief_complaint ?? '';
                                                                inter.value = lastEncounter.intervention ?? '';
                                                            }
                                                        }}
                                                    >
                                                        Prefill Fields
                                                    </Button>
                                                </div>
                                            )}

                                            <div>
                                                <Label htmlFor="chief_complaint">Chief Complaint</Label>
                                                <Textarea id="chief_complaint" name="chief_complaint" placeholder="e.g., Headache, fever for 3 days..." />
                                                <InputError message={errors['chief_complaint']} />
                                            </div>

                                            <div>
                                                <Label htmlFor="intervention">Medical Intervention</Label>
                                                <Textarea
                                                    id="intervention"
                                                    name="intervention"
                                                    placeholder="e.g., Administered paracetamol and advised hydration..."
                                                />
                                                <InputError message={errors['intervention']} />
                                            </div>

                                            <div className="flex items-center space-x-2 pt-2">
                                                <Switch id="redirect_to_vitals" name="redirect_to_vitals" />
                                                <Label htmlFor="redirect_to_vitals">Record vitals after saving</Label>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* === Submit Button Row === */}
                                <div className="flex items-center justify-end gap-3">
                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out duration-300"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-muted-foreground">Saved successfully!</p>
                                    </Transition>

                                    <Button type="submit" disabled={processing}>
                                        Submit Encounter
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        );
    }
