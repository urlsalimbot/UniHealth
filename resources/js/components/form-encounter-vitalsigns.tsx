import VitalSignStoreController from '@/actions/App/Http/Controllers/Patients/Encounters/VitalSignStoreController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Transition } from '@headlessui/react';
import { Form } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function VitalSignsForm({ data = {}, patient, encounter }: any) {
    const [today, setToday] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    // 🕒 Auto-fill today's date in ISO format (YYYY-MM-DD)
    useEffect(() => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        setToday(now.toISOString().split('T')[0]);
        setCurrentTime(`${hours}:${minutes}`);
    }, []);

    return (
        <Form {...VitalSignStoreController.store.form({ id: patient.patient_id, encounter: encounter.encounter_id })} className="space-y-8">
            {({ processing, recentlySuccessful, errors }) => (
                <>
                    {/* Measurement Date */}
                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="measurement_date">Measurement Date</Label>
                        <Input
                            id="measurement_date"
                            name="measurement_date"
                            type="date"
                            defaultValue={data?.measurement_date ?? new Date().toISOString().split('T')[0]}
                        />
                        <InputError message={errors.measurement_date} />
                    </div>

                    {/* Measurement Time */}
                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="measurement_time">Measurement Time</Label>
                        <Input id="measurement_time" name="measurement_time" type="time" defaultValue={data?.measurement_time ?? currentTime} />
                        <InputError message={errors.measurement_time} />
                    </div>

                    {/* Vitals Grid */}

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Blood Pressure */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="systolic_bp">Systolic BP (mmHg)</Label>
                            <Input id="systolic_bp" name="systolic_bp" type="number" defaultValue={data?.systolic_bp ?? ''} />
                            <InputError message={errors.systolic_bp} />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="diastolic_bp">Diastolic BP (mmHg)</Label>
                            <Input id="diastolic_bp" name="diastolic_bp" type="number" defaultValue={data?.diastolic_bp ?? ''} />
                            <InputError message={errors.diastolic_bp} />
                        </div>

                        {/* Heart Rate */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="heart_rate">Heart Rate (bpm)</Label>
                            <Input id="heart_rate" name="heart_rate" type="number" defaultValue={data?.heart_rate ?? ''} />
                            <InputError message={errors.heart_rate} />
                        </div>

                        {/* Respiratory Rate */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="respiratory_rate">Respiratory Rate (breaths/min)</Label>
                            <Input id="respiratory_rate" name="respiratory_rate" type="number" defaultValue={data?.respiratory_rate ?? ''} />
                            <InputError message={errors.respiratory_rate} />
                        </div>

                        {/* Temperature */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="temperature">Temperature (°C)</Label>
                            <Input id="temperature" name="temperature" type="number" step="0.1" defaultValue={data?.temperature ?? ''} />
                            <InputError message={errors.temperature} />
                        </div>

                        {/* O2 Saturation */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="oxygen_saturation">Oxygen Saturation (%)</Label>
                            <Input id="oxygen_saturation" name="oxygen_saturation" type="number" defaultValue={data?.oxygen_saturation ?? ''} />
                            <InputError message={errors.oxygen_saturation} />
                        </div>

                        {/* Weight */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input id="weight" name="weight" type="number" step="0.1" defaultValue={data?.weight ?? ''} />
                            <InputError message={errors.weight} />
                        </div>

                        {/* Height */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="height">Height (cm)</Label>
                            <Input id="height" name="height" type="number" step="0.1" defaultValue={data?.height ?? ''} />
                            <InputError message={errors.height} />
                        </div>

                        {/* BMI */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="bmi">BMI</Label>
                            <Input id="bmi" name="bmi" type="number" step="0.1" defaultValue={data?.bmi ?? ''} />
                            <InputError message={errors.bmi} />
                        </div>

                        {/* Pain */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="pain_score">Pain Score (0-10)</Label>
                            <Input id="pain_score" name="pain_score" type="number" min="0" max="10" defaultValue={data?.pain_score ?? ''} />
                            <InputError message={errors.pain_score} />
                        </div>

                        <div className="flex flex-col space-y-1 md:col-span-2">
                            <Label htmlFor="pain_location">Pain Location</Label>
                            <Input id="pain_location" name="pain_location" type="text" defaultValue={data?.pain_location ?? ''} />
                            <InputError message={errors.pain_location} />
                        </div>

                        {/* Text Areas */}
                        <div className="flex flex-col space-y-1 md:col-span-3">
                            <Label htmlFor="general_appearance">General Appearance</Label>
                            <Textarea id="general_appearance" name="general_appearance" defaultValue={data?.general_appearance ?? ''} />
                            <InputError message={errors.general_appearance} />
                        </div>

                        <div className="flex flex-col space-y-1 md:col-span-3">
                            <Label htmlFor="mental_status">Mental Status</Label>
                            <Textarea id="mental_status" name="mental_status" defaultValue={data?.mental_status ?? ''} />
                            <InputError message={errors.mental_status} />
                        </div>

                        {/* Additional Info */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="bp_cuff_size">BP Cuff Size</Label>
                            <Input id="bp_cuff_size" name="bp_cuff_size" type="text" defaultValue={data?.bp_cuff_size ?? ''} />
                            <InputError message={errors.bp_cuff_size} />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="thermometer_type">Thermometer Type</Label>
                            <Input id="thermometer_type" name="thermometer_type" type="text" defaultValue={data?.thermometer_type ?? ''} />
                            <InputError message={errors.thermometer_type} />
                        </div>
                    </div>

                    {/* Submit Section */}
                    <div className="mt-10 flex items-center justify-end gap-4">
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out duration-300"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out duration-300"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-muted-foreground">Vital signs saved successfully!</p>
                        </Transition>

                        <Button type="submit" disabled={processing}>
                            Save Vital Signs
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
