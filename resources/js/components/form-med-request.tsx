import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import medicationRequests from '@/routes/medication-requests';
import { useForm } from '@inertiajs/react';

export default function MedRequestForm() {
    const { data, setData, post, processing, errors } = useForm({
        prescription_file: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(medicationRequests.store.url(), {
            forceFormData: true,
        });
    };

    return (
        <Card className="mx-auto mt-4 h-fit max-w-lg">
            <CardHeader>
                <CardTitle>Medication Request</CardTitle>
                <CardDescription>Upload a prescription to request available in-stock medication</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} encType="multipart/form-data">
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData('prescription_file', e.target.files?.[0] || null)}
                        className="mb-4 block w-full"
                    />
                    <InputError message={errors.prescription_file} />

                    <Button type="submit" disabled={processing}>
                        Submit
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
