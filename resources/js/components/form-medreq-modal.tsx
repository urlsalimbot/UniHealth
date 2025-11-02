import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import medicationRequests from '@/routes/medication-requests';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export function ApproveModal({ requestId, medications, open, onClose }: any) {
    const { data, setData, post, processing, reset } = useForm({
        items: [{ medication_id: '', quantity: 1 }],
    });

    // Reset form when modal opens
    useEffect(() => {
        if (open) {
            reset();
        }
    }, [open, reset]);

    const handleAdd = () => {
        setData('items', [...data.items, { medication_id: '', quantity: 1 }]);
    };

    const handleRemove = (index: number) => {
        setData(
            'items',
            data.items.filter((_, idx) => idx !== index),
        );
    };

    const handleChange = (index: number, field: string, value: any) => {
        const updated = [...data.items];
        updated[index] = {
            ...updated[index],
            [field]: field === 'quantity' ? parseInt(value) : value,
        };
        setData('items', updated);
    };

    const handleSubmit = () => {
        console.log(data);
        post(medicationRequests.approve.url(requestId), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            },
            onError: (errors) => {
                console.error('Form errors:', errors);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Approve Medication Request</DialogTitle>
                </DialogHeader>

                <div className="max-h-[60vh] space-y-4 overflow-y-auto">
                    {data.items.map((item, i) => (
                        <div key={i} className="flex flex-col items-end gap-2 sm:flex-row">
                            <div className="flex-1">
                                <Label>Medication</Label>
                                <Select value={String(item.medication_id)} onValueChange={(v) => handleChange(i, 'medication_id', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select medication" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {medications.map((m: any) => (
                                            <SelectItem key={m.medication_id} value={String(m.medication_id)}>
                                                {m.generic_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-24">
                                <Label>Qty</Label>
                                <Input type="number" min="1" value={item.quantity} onChange={(e) => handleChange(i, 'quantity', e.target.value)} />
                            </div>
                            <Button variant="destructive" onClick={() => handleRemove(i)} disabled={data.items.length === 1}>
                                Remove
                            </Button>
                        </div>
                    ))}
                    <Button variant="secondary" onClick={handleAdd}>
                        + Add Medication
                    </Button>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={processing || data.items.some((item) => !item.medication_id)}>
                        Approve & Validate
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
