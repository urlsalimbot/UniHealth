import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import medicationRequests from '@/routes/medication-requests';
import { useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        prescription: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(medicationRequests.store.url(), {
            forceFormData: true,
        });
    };

    return (
        <Card className="mx-auto mt-10 max-w-lg">
            <CardHeader>
                <CardTitle>Upload Prescription</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} encType="multipart/form-data">
                    <Input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setData('prescription', e.target.files?.[0] || null)}
                        className="mb-4 block w-full"
                    />
                    <InputError message={errors.prescription} />

                    <Button type="submit" disabled={processing}>
                        Submit
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
