import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Transition } from '@headlessui/react';
import { Form } from '@inertiajs/react';

export default function VitalSignsForm({ data = {}, ...Actions }: any) {
    return (
        <Form {...Actions} className="space-y-8">
            {({ processing, recentlySuccessful, errors }) => (
                <>
                    {/* Vitals Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Blood Pressure */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="systolic_bp">Systolic BP (mmHg)</Label>
                            <Input
                                id="systolic_bp"
                                name="systolic_bp"
                                type="number"
                                defaultValue={data?.systolic_bp ?? ''}
                                onChange={(e) => Actions.setData('systolic_bp', e.target.value)}
                            />
                            <InputError message={errors.systolic_bp} />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="diastolic_bp">Diastolic BP (mmHg)</Label>
                            <Input
                                id="diastolic_bp"
                                name="diastolic_bp"
                                type="number"
                                defaultValue={data?.diastolic_bp ?? ''}
                                onChange={(e) => Actions.setData('diastolic_bp', e.target.value)}
                            />
                            <InputError message={errors.diastolic_bp} />
                        </div>

                        {/* Heart Rate */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="heart_rate">Heart Rate (bpm)</Label>
                            <Input
                                id="heart_rate"
                                name="heart_rate"
                                type="number"
                                defaultValue={data?.heart_rate ?? ''}
                                onChange={(e) => Actions.setData('heart_rate', e.target.value)}
                            />
                            <InputError message={errors.heart_rate} />
                        </div>

                        {/* Respiratory Rate */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="respiratory_rate">Respiratory Rate (breaths/min)</Label>
                            <Input
                                id="respiratory_rate"
                                name="respiratory_rate"
                                type="number"
                                defaultValue={data?.respiratory_rate ?? ''}
                                onChange={(e) => Actions.setData('respiratory_rate', e.target.value)}
                            />
                            <InputError message={errors.respiratory_rate} />
                        </div>

                        {/* Temperature */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="temperature">Temperature (°C)</Label>
                            <Input
                                id="temperature"
                                name="temperature"
                                type="number"
                                step="0.1"
                                defaultValue={data?.temperature ?? ''}
                                onChange={(e) => Actions.setData('temperature', e.target.value)}
                            />
                            <InputError message={errors.temperature} />
                        </div>

                        {/* O2 Saturation */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="oxygen_saturation">Oxygen Saturation (%)</Label>
                            <Input
                                id="oxygen_saturation"
                                name="oxygen_saturation"
                                type="number"
                                defaultValue={data?.oxygen_saturation ?? ''}
                                onChange={(e) => Actions.setData('oxygen_saturation', e.target.value)}
                            />
                            <InputError message={errors.oxygen_saturation} />
                        </div>

                        {/* Weight */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                                id="weight"
                                name="weight"
                                type="number"
                                step="0.1"
                                defaultValue={data?.weight ?? ''}
                                onChange={(e) => Actions.setData('weight', e.target.value)}
                            />
                            <InputError message={errors.weight} />
                        </div>

                        {/* Height */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="height">Height (cm)</Label>
                            <Input
                                id="height"
                                name="height"
                                type="number"
                                step="0.1"
                                defaultValue={data?.height ?? ''}
                                onChange={(e) => Actions.setData('height', e.target.value)}
                            />
                            <InputError message={errors.height} />
                        </div>

                        {/* BMI */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="bmi">BMI</Label>
                            <Input
                                id="bmi"
                                name="bmi"
                                type="number"
                                step="0.1"
                                defaultValue={data?.bmi ?? ''}
                                onChange={(e) => Actions.setData('bmi', e.target.value)}
                            />
                            <InputError message={errors.bmi} />
                        </div>

                        {/* Pain */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="pain_score">Pain Score (0-10)</Label>
                            <Input
                                id="pain_score"
                                name="pain_score"
                                type="number"
                                min="0"
                                max="10"
                                defaultValue={data?.pain_score ?? ''}
                                onChange={(e) => Actions.setData('pain_score', e.target.value)}
                            />
                            <InputError message={errors.pain_score} />
                        </div>

                        <div className="flex flex-col space-y-1 md:col-span-2">
                            <Label htmlFor="pain_location">Pain Location</Label>
                            <Input
                                id="pain_location"
                                name="pain_location"
                                type="text"
                                defaultValue={data?.pain_location ?? ''}
                                onChange={(e) => Actions.setData('pain_location', e.target.value)}
                            />
                            <InputError message={errors.pain_location} />
                        </div>

                        {/* Text Areas */}
                        <div className="flex flex-col space-y-1 md:col-span-3">
                            <Label htmlFor="general_appearance">General Appearance</Label>
                            <Textarea
                                id="general_appearance"
                                name="general_appearance"
                                defaultValue={data?.general_appearance ?? ''}
                                onChange={(e) => Actions.setData('general_appearance', e.target.value)}
                            />
                            <InputError message={errors.general_appearance} />
                        </div>

                        <div className="flex flex-col space-y-1 md:col-span-3">
                            <Label htmlFor="mental_status">Mental Status</Label>
                            <Textarea
                                id="mental_status"
                                name="mental_status"
                                defaultValue={data?.mental_status ?? ''}
                                onChange={(e) => Actions.setData('mental_status', e.target.value)}
                            />
                            <InputError message={errors.mental_status} />
                        </div>

                        {/* Additional Info */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="bp_cuff_size">BP Cuff Size</Label>
                            <Input
                                id="bp_cuff_size"
                                name="bp_cuff_size"
                                type="text"
                                defaultValue={data?.bp_cuff_size ?? ''}
                                onChange={(e) => Actions.setData('bp_cuff_size', e.target.value)}
                            />
                            <InputError message={errors.bp_cuff_size} />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="thermometer_type">Thermometer Type</Label>
                            <Input
                                id="thermometer_type"
                                name="thermometer_type"
                                type="text"
                                defaultValue={data?.thermometer_type ?? ''}
                                onChange={(e) => Actions.setData('thermometer_type', e.target.value)}
                            />
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
