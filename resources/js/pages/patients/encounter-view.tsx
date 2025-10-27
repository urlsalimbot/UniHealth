import AttachmentUploadForm from '@/components/form-encounter-attachment';
import PatientPrescriptionForm from '@/components/form-encounter-prescription';
import VitalSignsForm from '@/components/form-encounter-vitalsigns';
import VitalSignsDashboard from '@/components/patient-vitals-charts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import patients from '@/routes/patients';
import { Head, usePage } from '@inertiajs/react';
import { Download, Eye, FileText, ImageIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function MedicalEncounterView() {
    const { patient, medical_encounters, vitalsigns } = usePage().props as any;
    const [selectedEncounter, setSelectedEncounter] = useState<any>(null);
    const [open, setOpen] = useState(false);

    console.log(medical_encounters);

    // --- Group encounters by month (descending) ---
    const encountersByMonth = useMemo(() => {
        const groups: Record<string, any[]> = {};
        medical_encounters
            .sort((a: any, b: any) => new Date(b.encounter_date).getTime() - new Date(a.encounter_date).getTime())
            .forEach((enc: any) => {
                const month = new Date(enc.encounter_date).toLocaleString('default', { month: 'long', year: 'numeric' });
                if (!groups[month]) groups[month] = [];
                groups[month].push(enc);
            });
        return groups;
    }, [medical_encounters]);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Patients', href: '/patients' },
                { title: patient.last_name, href: patients.show.url(patient.patient_id) },
                {
                    title: `${patient.last_name}${patient.last_name.endsWith('s') ? "'" : "'s"} Encounters`,
                    href: patients.show.url(patient.patient_id),
                },
            ]}
        >
            <Head title="Medical Encounters" />

            <div className="flex h-[calc(100vh-8.5rem)] gap-4 p-4">
                {/* --- LEFT PANEL: Encounter List --- */}
                <Card className="flex w-1/4 flex-col border border-muted/30 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-md font-semibold">Medical Encounters</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">
                        <ScrollArea className="h-full pr-2">
                            {Object.entries(encountersByMonth).map(([month, encounters]) => (
                                <div key={month} className="mb-4">
                                    <h3 className="mb-2 text-sm font-semibold text-gray-600">{month}</h3>
                                    <ul className="space-y-1">
                                        {encounters.map((enc: any) => (
                                            <li
                                                key={enc.encounter_id}
                                                onClick={() => setSelectedEncounter(enc)}
                                                className={cn(
                                                    'cursor-pointer rounded-md border p-2 text-sm transition hover:bg-accent/50',
                                                    selectedEncounter?.encounter_id === enc.encounter_id && 'bg-accent',
                                                )}
                                            >
                                                <div className="flex justify-between">
                                                    <span className="font-medium">{enc.encounter_type}</span>
                                                    <span className="text-xs text-gray-500">{new Date(enc.encounter_date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="truncate text-xs text-gray-700">{enc.chief_complaint ?? 'No complaint'}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* --- RIGHT PANEL: Encounter Viewer --- */}
                <Card className="flex w-3/4 flex-col border border-muted/30 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-md font-semibold">
                            {selectedEncounter ? `Encounter: ${selectedEncounter.encounter_type}` : 'Select an Encounter'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-6">
                        {selectedEncounter ? (
                            <div className="space-y-6">
                                {/* Encounter Summary */}
                                <div>
                                    <h2 className="mb-2 font-semibold text-gray-800">Summary</h2>
                                    <p className="text-sm text-gray-700">
                                        <strong>Complaint:</strong> {selectedEncounter.chief_complaint ?? 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <strong>Intervention:</strong> {selectedEncounter.intervention ?? selectedEncounter.encounter_class ?? 'N/A'}
                                    </p>
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <h2 className="mb-2 font-semibold text-gray-800">Vital Signs</h2>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline">
                                                    + Add Vital Signs
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-lg">
                                                <DialogHeader>
                                                    <DialogTitle>Update Vital Signs</DialogTitle>
                                                    <DialogDescription>Add a new vital signs reading for this medical encounter.</DialogDescription>
                                                </DialogHeader>

                                                {/* Vital Signs Upload Form */}
                                                <VitalSignsForm data={{ encounter_id: selectedEncounter.encounter_id }} />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                                {/* Vital Signs */}
                                {selectedEncounter.vital_signs && selectedEncounter.vital_signs.length > 0 && (
                                    <VitalSignsDashboard vitalSigns={selectedEncounter.vital_signs} />
                                )}

                                {/* Prescriptions */}
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <h2 className="mb-2 font-semibold text-gray-800">Prescriptions</h2>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline">
                                                    + Add Prescription
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-lg">
                                                <DialogHeader>
                                                    <DialogTitle>Upload Attachment</DialogTitle>
                                                    <DialogDescription>Add a new attachment for this medical encounter.</DialogDescription>
                                                </DialogHeader>

                                                {/* Attachment Upload Form */}
                                                <PatientPrescriptionForm
                                                    data={{ encounter_id: selectedEncounter.encounter_id }}
                                                    onSubmit={(e: any) => {
                                                        e.preventDefault();
                                                        // Handle submission logic (e.g., Inertia form post)
                                                    }}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    {selectedEncounter.patient_prescriptions?.length > 0 ? (
                                        <ul className="ml-4 list-disc space-y-1 text-sm text-gray-700">
                                            {selectedEncounter.patient_prescriptions.map((rx: any) => (
                                                <li key={rx.prescription_id}>
                                                    {rx.medication_name} — {rx.dosage ?? ''} {rx.frequency ?? ''}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No prescriptions recorded.</p>
                                    )}
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <h2 className="font-semibold text-gray-800">Attached Documents</h2>

                                        {/* Upload Attachment Dialog */}
                                        <Dialog open={open} onOpenChange={setOpen}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline">
                                                    + Upload Attachment
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent
                                                className="sm:max-w-lg"
                                                onInteractOutside={(e) => e.preventDefault()}
                                                onEscapeKeyDown={(e) => e.preventDefault()}
                                            >
                                                <DialogHeader>
                                                    <DialogTitle>Upload Attachment</DialogTitle>
                                                    <DialogDescription>Add a new attachment for this medical encounter.</DialogDescription>
                                                </DialogHeader>

                                                <AttachmentUploadForm
                                                    patient={patient}
                                                    encounter={selectedEncounter}
                                                    onSuccess={() => setOpen(false)} // ✅ Close dialog only after success
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    {selectedEncounter.attachments?.length > 0 ? (
                                        <ScrollArea className="max-h-[300px] rounded-xl border p-2">
                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                {selectedEncounter.attachments.map((file: any) => {
                                                    const isImage = file.filename?.match(/\.(jpg|jpeg|png|gif)$/i);
                                                    const isPDF = file.filename?.match(/\.pdf$/i);

                                                    return (
                                                        <Card key={file.attachment_id} className="w-fit overflow-hidden">
                                                            <CardContent className="space-y-2 p-3">
                                                                <div className="flex aspect-video items-center justify-center overflow-hidden rounded-md bg-muted/40">
                                                                    {isImage ? (
                                                                        <img
                                                                            src={file.url}
                                                                            alt={file.filename}
                                                                            className="h-full w-full object-cover"
                                                                        />
                                                                    ) : isPDF ? (
                                                                        <FileText className="h-10 w-10 text-muted-foreground" />
                                                                    ) : (
                                                                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                                                                    )}
                                                                </div>

                                                                <div className="truncate text-sm font-medium text-gray-800">
                                                                    {file.label || file.filename}
                                                                </div>

                                                                <div className="flex justify-between gap-4">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="secondary"
                                                                        onClick={() => window.open(file.url, '_blank')}
                                                                    >
                                                                        <Eye className="mr-2 h-4 w-4" /> Preview
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => {
                                                                            const link = document.createElement('a');
                                                                            link.href = file.url;
                                                                            link.download = file.filename;
                                                                            link.click();
                                                                        }}
                                                                    >
                                                                        <Download className="mr-2 h-4 w-4" /> Download
                                                                    </Button>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    );
                                                })}
                                            </div>
                                        </ScrollArea>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No documents attached.</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                Select an encounter from the left to view details.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
