import { Transition } from '@headlessui/react';
import { Form } from '@inertiajs/react';
import InputError from './input-error';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';

type MedicationFormData = {
    generic_name: string;
    brand_names?: string;
    strength?: string;
    dosage_form?: string;
    drug_class?: string;
    controlled_substance?: boolean;
    fda_registration?: string;
};

export default function MedicationForm({ data = {}, mode = 'create', ...Actions }: any) {
    const isView = mode === 'view';

    const renderInput = (name: keyof MedicationFormData, label: string, errors: any, explicitType?: string) => {
        const n = String(name).toLowerCase();
        const type =
            explicitType ||
            (n.includes('date')
                ? 'date'
                : n.includes('email')
                  ? 'email'
                  : n.includes('number') || n.includes('phone') || n.includes('mobile')
                    ? 'tel'
                    : 'text');

        return (
            <div className="flex flex-col space-y-1">
                <Label htmlFor={name}>{label}</Label>
                <Input id={name} name={name} type={type} defaultValue={data?.[name] ?? ''} readOnly={isView} />
                <InputError className="text-sm text-destructive" message={errors[name]} />
            </div>
        );
    };

    return (
        <Form {...Actions} className="space-y-8">
            {({ processing, recentlySuccessful, errors }) => (
                <>
                    {/* Grid Form */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {renderInput('generic_name', 'Generic Name', errors)}
                        {renderInput('brand_names', 'Brand Names', errors)}
                        {renderInput('strength', 'Strength', errors)}
                        {renderInput('dosage_form', 'Dosage Form', errors)}
                        {renderInput('drug_class', 'Drug Class', errors)}
                        {renderInput('fda_registration', 'FDA Registration', errors)}

                        {/* Controlled Substance Checkbox */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="controlled_substance">Controlled Substance</Label>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="controlled_substance"
                                    name="controlled_substance"
                                    defaultChecked={!!data?.controlled_substance}
                                    disabled={isView}
                                />
                                <span className="text-sm text-muted-foreground">Mark if this is a controlled medication</span>
                            </div>
                            <InputError className="text-sm text-destructive" message={errors['controlled_substance']} />
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="mt-10 flex items-center justify-end gap-4">
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
                            {mode === 'edit' ? 'Update Medication' : 'Submit and Save'}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
