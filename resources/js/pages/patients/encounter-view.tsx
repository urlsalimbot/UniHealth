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
import { useEffect, useMemo, useRef, useState } from 'react';

export default function MedicalEncounterView() {
    const { patient, medical_encounters, vitalsigns, flash } = usePage().props as any;
    const [selectedEncounter, setSelectedEncounter] = useState<any>(null);
    const [open, setOpen] = useState(false);
    const [vitalsDialogOpen, setVitalsDialogOpen] = useState(false);

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

    const didOpenFromFlash = useRef(false);

    useEffect(() => {
        if (!didOpenFromFlash.current && flash?.selected_encounter_id && medical_encounters?.length) {
            const match = medical_encounters.find((enc: any) => enc.encounter_id == flash.selected_encounter_id);
            if (match) {
                setSelectedEncounter(match);
                setVitalsDialogOpen(true);
                didOpenFromFlash.current = true;
            }
        }
    }, [flash, medical_encounters]);

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

            <div className="flex flex-col lg:flex-row h-[calc(100vh-8.5rem)] gap-4 p-4">
                {/* --- LEFT PANEL: Encounter List --- */}
                <Card className="flex flex-col lg:w-1/4 w-full border border-muted/30 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-md font-semibold">Medical Encounters</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">
                        <ScrollArea className="h-full pr-2 lg:pr-4">
                            {Object.entries(encountersByMonth).map(([month, encounters]) => (
                                <div key={month} className="mb-4">
                                    <h3 className="mb-2 text-sm font-semibold">{month}</h3>
                                    <ul className="space-y-1">
                                        {encounters.map((enc: any) => (
                                            <li
                                                key={enc.encounter_id}
                                                onClick={() => {
                                                    setSelectedEncounter(enc);
                                                    // Auto-close mobile panel after selection
                                                    if (window.innerWidth < 1024) {
                                                        setTimeout(() => {
                                                            document.getElementById('encounter-viewer')?.scrollIntoView({ behavior: 'smooth' });
                                                        }, 100);
                                                    }
                                                }}
                                                className={cn(
                                                    'cursor-pointer rounded-md border p-3 text-sm transition hover:bg-accent/50 active:bg-accent/70',
                                                    selectedEncounter?.encounter_id === enc.encounter_id && 'bg-accent',
                                                )}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                                    <span className="font-medium text-base sm:text-sm">{enc.encounter_type}</span>
                                                    <span className="text-xs text-muted-foreground">{new Date(enc.encounter_date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="truncate text-xs sm:text-xs text-muted-foreground mt-1">{enc.chief_complaint ?? 'No complaint'}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* --- RIGHT PANEL: Encounter Viewer --- */}
                <Card id="encounter-viewer" className="flex flex-col lg:w-3/4 w-full border border-muted/30 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-md font-semibold">
                            {selectedEncounter ? `Encounter: ${selectedEncounter.encounter_type}` : 'Select an Encounter'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 lg:p-6">
                        {selectedEncounter ? (
                            <div className="space-y-6">
                                {/* Encounter Summary */}
                                <div className="bg-muted/20 rounded-lg p-4">
                                    <h2 className="mb-3 font-semibold text-base lg:text-lg">Summary</h2>
                                    <div className="space-y-2">
                                        <p className="text-sm">
                                            <strong className="font-medium">Complaint:</strong> {selectedEncounter.chief_complaint ?? 'N/A'}
                                        </p>
                                        <p className="text-sm">
                                            <strong className="font-medium">Intervention:</strong> {selectedEncounter.intervention ?? selectedEncounter.encounter_class ?? 'N/A'}
                                        </p>
                                        <p className="text-sm">
                                            <strong className="font-medium">Date:</strong> {new Date(selectedEncounter.encounter_date).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm">
                                            <strong className="font-medium">Status:</strong> {selectedEncounter.encounter_status ?? 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-muted/20 rounded-lg p-4">
                                    <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <h2 className="font-semibold text-base lg:text-lg">Vital Signs</h2>
                                        <Dialog open={vitalsDialogOpen} onOpenChange={setVitalsDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => setVitalsDialogOpen(true)}>
                                                    + Add Vital Signs
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[95vw] max-h-[90vh] overflow-y-auto lg:max-w-lg">
                                                <DialogHeader>
                                                    <DialogTitle>Update Vital Signs</DialogTitle>
                                                    <DialogDescription>Add a new vital signs reading for this medical encounter.</DialogDescription>
                                                </DialogHeader>
                                                <VitalSignsForm
                                                    data={{ encounter_id: selectedEncounter.encounter_id }}
                                                    patient={patient}
                                                    encounter={selectedEncounter}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                                {/* Vital Signs */}
                                {selectedEncounter.vital_signs && selectedEncounter.vital_signs.length > 0 && (
                                    <VitalSignsDashboard vitalSigns={selectedEncounter.vital_signs} />
                                )}

                                {/* Prescriptions */}
                                <div className="bg-muted/20 rounded-lg p-4">
                                    <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <h2 className="font-semibold text-base lg:text-lg">Prescriptions</h2>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline" className="w-full sm:w-auto">
                                                    + Add Prescription
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[95vw] max-h-[90vh] overflow-y-auto lg:max-w-lg">
                                                <DialogHeader>
                                                    <DialogTitle>Add Prescription</DialogTitle>
                                                    <DialogDescription>Add a new prescription for this medical encounter.</DialogDescription>
                                                </DialogHeader>

                                                {/* Patient Prescription Form*/}
                                                <PatientPrescriptionForm
                                                    data={{ encounter_id: selectedEncounter.encounter_id }}
                                                    patient={patient}
                                                    encounter={selectedEncounter}
                                                    onSubmit={(e: any) => {
                                                        e.preventDefault();
                                                        // Handle submission logic (e.g., Inertia form post)
                                                    }}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    {selectedEncounter.patient_prescriptions?.length > 0 ? (
                                        <div className="space-y-2">
                                            {selectedEncounter.patient_prescriptions.map((rx: any) => (
                                                <div key={rx.prescription_id} className="bg-background rounded-md p-3 border">
                                                    <div className="font-medium text-sm">{rx.medication_name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {rx.dosage ?? ''} {rx.frequency ?? ''}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No prescriptions recorded.</p>
                                    )}
                                </div>

                                <div className="bg-muted/20 rounded-lg p-4">
                                    <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <h2 className="font-semibold text-base lg:text-lg">Attached Documents</h2>

                                        {/* Upload Attachment Dialog */}
                                        <Dialog open={open} onOpenChange={setOpen}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline" className="w-full sm:w-auto">
                                                    + Upload Attachment
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent
                                                className="sm:max-w-[95vw] max-h-[90vh] overflow-y-auto lg:max-w-lg"
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
                                                        <Card key={file.attachment_id} className="overflow-hidden">
                                                            <CardContent className="space-y-3 p-3">
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

                                                                <div className="truncate text-sm font-medium">{file.label || file.filename}</div>

                                                                <div className="flex flex-col sm:flex-row gap-2">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="secondary"
                                                                        className="flex-1"
                                                                        onClick={() => window.open(file.url, '_blank')}
                                                                    >
                                                                        <Eye className="mr-2 h-4 w-4" /> <span className="hidden sm:inline">Preview</span><span className="sm:hidden">View</span>
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="flex-1"
                                                                        onClick={() => {
                                                                            const link = document.createElement('a');
                                                                            link.href = file.url;
                                                                            link.download = file.filename;
                                                                            link.click();
                                                                        }}
                                                                    >
                                                                        <Download className="mr-2 h-4 w-4" /> <span className="hidden sm:inline">Download</span><span className="sm:hidden">Save</span>
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
                            <div className="flex h-full items-center justify-center p-8 text-center">
                                <div className="space-y-2">
                                    <div className="text-muted-foreground">
                                        Select an encounter from the list to view details.
                                    </div>
                                    <div className="text-xs text-muted-foreground lg:hidden">
                                        Scroll up to see the encounter list.
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
