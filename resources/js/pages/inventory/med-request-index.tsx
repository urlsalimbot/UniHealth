import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { show as showMedRequest, updateStatus as updateStatusRoute } from '@/routes/medication-requests';
import { useForm, usePage } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

export default function Index() {
    const { props } = usePage() as any;
    const requests = props.requests || [];

    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [open, setOpen] = useState(false);

    const { post, processing, reset, data, setData } = useForm({
        status: 'approved',
        medications: [{ name: '', quantity: 1 }],
    });

    const openApproval = (req: any) => {
        setSelectedRequest(req);
        setOpen(true);
    };

    const addMedication = () => {
        setData('medications', [...data.medications, { name: '', quantity: 1 }]);
    };

    const removeMedication = (index: number) => {
        setData(
            'medications',
            data.medications.filter((_, i) => i !== index),
        );
    };

    const updateMedicationField = (index: number, field: 'name' | 'quantity', value: string | number) => {
        const updated = [...data.medications];
        updated[index][field] = value;
        setData('medications', updated);
    };

    const submitApproval = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedRequest) return;

        post(updateStatusRoute.url(selectedRequest.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <div className="grid gap-4 p-6">
            {requests.length > 0 ? (
                requests.map((req: any) => (
                    <Card key={req.id}>
                        <CardHeader>
                            <CardTitle>
                                Request #{req.id} – {req.patient?.name || 'Unknown'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>
                                Status: <strong>{req.status}</strong>
                            </p>

                            {req.status === 'pending' && (
                                <div className="flex flex-wrap gap-2">
                                    <Button onClick={() => openApproval(req)}>View & Approve</Button>
                                    <form
                                        {...updateStatusRoute.form(req.id)}
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const form = e.currentTarget;
                                            const hidden = document.createElement('input');
                                            hidden.type = 'hidden';
                                            hidden.name = 'status';
                                            hidden.value = 'rejected';
                                            form.appendChild(hidden);
                                            form.submit();
                                        }}
                                    >
                                        <Button type="submit" variant="destructive">
                                            Reject
                                        </Button>
                                    </form>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))
            ) : (
                <p className="mt-10 text-center text-muted-foreground">No medication requests found.</p>
            )}

            {/* Pharmacist Review Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="flex h-[80vh] max-w-5xl flex-col overflow-hidden">
                    <DialogHeader className="border-b pb-2">
                        <DialogTitle>Review Medication Request</DialogTitle>
                        <DialogDescription>Cross-check the uploaded prescription and add medications before approval.</DialogDescription>
                    </DialogHeader>

                    {selectedRequest && (
                        <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden md:grid-cols-2">
                            {/* Prescription Preview */}
                            <ScrollArea className="rounded-lg border bg-muted/20 p-4">
                                <h3 className="mb-2 font-semibold">Prescription Image</h3>
                                <img
                                    src={showMedRequest.url(selectedRequest)}
                                    alt="Prescription"
                                    className="h-auto w-full rounded-md border object-contain"
                                />
                            </ScrollArea>

                            {/* Medication Entry Form */}
                            <form onSubmit={submitApproval} className="flex flex-col space-y-4 overflow-y-auto p-4">
                                <div className="space-y-3">
                                    <h3 className="font-semibold">Add Medications</h3>

                                    {data.medications.map((med, index) => (
                                        <div key={index} className="flex items-end gap-2">
                                            <div className="flex-1">
                                                <Label htmlFor={`name-${index}`}>Medication</Label>
                                                <Input
                                                    id={`name-${index}`}
                                                    placeholder="e.g. Amoxicillin"
                                                    value={med.name}
                                                    onChange={(e) => updateMedicationField(index, 'name', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="w-28">
                                                <Label htmlFor={`quantity-${index}`}>Qty</Label>
                                                <Input
                                                    id={`quantity-${index}`}
                                                    type="number"
                                                    min="1"
                                                    value={med.quantity}
                                                    onChange={(e) => updateMedicationField(index, 'quantity', Number(e.target.value))}
                                                    required
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeMedication(index)}
                                                className="mb-1"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}

                                    <Button type="button" variant="secondary" size="sm" onClick={addMedication} className="flex items-center gap-1">
                                        <Plus className="h-4 w-4" /> Add Medication
                                    </Button>
                                </div>

                                <Separator />

                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Approve Request
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
