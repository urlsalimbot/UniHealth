import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Transition } from '@headlessui/react';
import { Form } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import InputError from './input-error';
import EncounterCreateController from '@/actions/App/Http/Controllers/Encounters/EncounterCreateController';

type EncounterFormData = {
    encounter_type: string;
    chief_complaint: string;
    intervention: string;
    redirect_to_vitals: boolean;
};

type CreateEncounterModalProps = {
    patient: any;
    lastEncounter?: any;
    encounterTypes: string[];
};

export default function CreateEncounterModal({ patient, lastEncounter, encounterTypes }: CreateEncounterModalProps) {
    const [open, setOpen] = useState(false);
    const [prefill, setPrefill] = useState(false);

    const [data, setData] = useState<EncounterFormData>({
        encounter_type: '',
        chief_complaint: '',
        intervention: '',
        redirect_to_vitals: false,
    });

    useEffect(() => {
        if (prefill && lastEncounter) {
            setData((prev) => ({
                ...prev,
                chief_complaint: lastEncounter.chief_complaint || '',
                intervention: lastEncounter.intervention || '',
            }));
        }
    }, [prefill, lastEncounter]);

    const handleValueChange = (field: keyof EncounterFormData, value: any) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="mb-3">➕ New Encounter</Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>New Medical Encounter for {patient.last_name}, {patient.first_name}</DialogTitle>
                </DialogHeader>

                <Form {...EncounterCreateController.store.form()} className="space-y-6">
                    {({ processing, recentlySuccessful, errors }) => (
                        <>
                            {/* Encounter Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Encounter Information</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 gap-4">
                                    <div>
                                        <Label>Encounter Type</Label>
                                        <Select value={data.encounter_type} onValueChange={(val) => handleValueChange('encounter_type', val)}>
                                            <SelectTrigger>
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
                                        <InputError message={errors.encounter_type} />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch checked={prefill} onCheckedChange={setPrefill} />
                                        <Label>Prefill from last encounter</Label>
                                    </div>

                                    <div>
                                        <Label>Chief Complaint</Label>
                                        <Textarea
                                            value={data.chief_complaint}
                                            onChange={(e) => handleValueChange('chief_complaint', e.target.value)}
                                            placeholder="e.g., Headache, fever for 3 days..."
                                        />
                                        <InputError message={errors.chief_complaint} />
                                    </div>

                                    <div>
                                        <Label>Medical Intervention</Label>
                                        <Textarea
                                            value={data.intervention}
                                            onChange={(e) => handleValueChange('intervention', e.target.value)}
                                            placeholder="e.g., Administered paracetamol and advised hydration..."
                                        />
                                        <InputError message={errors.intervention} />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={data.redirect_to_vitals}
                                            onCheckedChange={(checked) => handleValueChange('redirect_to_vitals', checked)}
                                        />
                                        <Label>Record vitals after saving</Label>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Submit Section */}
                            <div className="flex items-center justify-end gap-3">
                                <Button type="submit" disabled={processing}>
                                    Submit Encounter
                                </Button>
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out duration-300"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-muted-foreground">Saved successfully!</p>
                                </Transition>
                            </div>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
