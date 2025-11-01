import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { show as showMedRequest, updateStatus as updateStatusRoute } from '@/routes/medication-requests';
import { Form, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index() {
    const { props } = usePage() as any;
    const requests = props.requests || [];

    const [open, setOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState('');

    const openModal = (src: string) => {
        setImageSrc(src);
        setOpen(true);
    };

    const [status, setStatus] = useState('pending');

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
                            <Button onClick={() => openModal(showMedRequest.url(req))}>View Prescription</Button>

                            {req.status === 'pending' && (
                                <Form
                                    {...updateStatusRoute.form(req.id)}
                                    className="inline"
                                    onSubmit={(e) => {
                                        e.preventDefault(); // Prevent double submit
                                        const form = e.currentTarget;
                                        form.submit();
                                    }}
                                >
                                    <input type="hidden" name="status" value={status} />
                                    <Button
                                        type="button"
                                        onClick={() => setStatus('approved')}
                                        className="mt-2 mr-2"
                                        onFocus={(e) => e.preventDefault()} // prevent form submit on focus
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        className="mt-2"
                                        onClick={() => setStatus('rejected')}
                                        onFocus={(e) => e.preventDefault()}
                                    >
                                        Reject
                                    </Button>
                                    <Button type="submit" className="sr-only" aria-hidden="true">
                                        Submit
                                    </Button>
                                </Form>
                            )}
                        </CardContent>
                    </Card>
                ))
            ) : (
                <p className="mt-10 text-center text-muted-foreground">No medication requests found.</p>
            )}

            {/* Modal Image Viewer */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl overflow-hidden p-2">
                    <DialogHeader>
                        <DialogTitle>Prescription Image</DialogTitle>
                        <DialogDescription>Preview your prescription here.</DialogDescription>
                    </DialogHeader>

                    <img src={imageSrc} alt="Prescription" className="h-auto w-full rounded-sm object-contain" />
                </DialogContent>
            </Dialog>
        </div>
    );
}
