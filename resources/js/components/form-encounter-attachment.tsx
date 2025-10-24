import AttachmentUploadController from '@/actions/App/Http/Controllers/Patients/Encounters/AttachmentUploadController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Transition } from '@headlessui/react';
import { Form } from '@inertiajs/react';
import { useState } from 'react';

type AttachmentFormData = {
    label?: string;
    attachment?: File | null;
};

export default function AttachmentUploadForm({ data = {}, patient, encounter }: any) {
    const [fileName, setFileName] = useState<string | null>(null);

    return (
        <Form
            {...AttachmentUploadController.store.form({
                id: patient.patient_id,
                encounter: encounter.encounter_id,
            })}
            className="space-y-4"
        >
            {({ processing, recentlySuccessful, errors }) => (
                <>
                    {/* Grid Form */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="flex flex-col space-y-1">
                            <Label>Label</Label>
                            <Input id="label" name="label" type="text" defaultValue={data?.label ?? ''} />
                            <InputError className="text-sm text-destructive" message={errors.label} />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <Label>Attachment</Label>
                            <Input id="attachment" name="attachment" type="file" />
                            {fileName && <p className="text-xs text-muted-foreground">Selected: {fileName}</p>}
                            <InputError className="text-sm text-destructive" message={errors.attachement} />
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
                            <p className="text-sm text-muted-foreground">Uploaded successfully!</p>
                        </Transition>

                        <Button type="submit" disabled={processing}>
                            Upload Attachment
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
