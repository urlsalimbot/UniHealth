import ExistingPatientController from '@/actions/App/Http/Controllers/Patients/ExistingPatientController';
import CreateEncounterModal from '@/components/form-encounter';
import PatientForm from '@/components/form-patient';
import VitalSignsDashboard from '@/components/patient-vitals-charts';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import patients from '@/routes/patients';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function PatientSingleView() {
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { patient, medical_encounters, latest_encounter, vitalsigns, encounterTypes } = usePage().props as any;

    const breadcrumbs = [
        { title: 'Patients', href: '/patients' },
        { title: patient.last_name, href: patients.show.url(patient.patient_id) },
    ];

    const handleConfirmEdit = () => {
        setConfirmOpen(false);
        setOpen(true);
    };

    const latestVitals = latest_encounter?.vital_signs?.[0] || patient.vital_signs?.[0] || {};

    // console.log(vitalsigns);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patient Details" />
            <div className="mt-4 h-[calc(100vh-8.5rem)] space-y-4 px-4">
                {/* --- Top Row: View Button + Summary Cards --- */}
                <div className="flex flex-wrap items-center justify-start gap-3">
                    {/* View Patient Details Button */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="shrink-0">View Patient Details</Button>
                        </DialogTrigger>

                        <DialogContent className="h-[90vh] max-w-[95vw] overflow-hidden p-0 md:max-w-6xl">
                            <DialogHeader className="p-4 pb-0">
                                <DialogTitle className="text-lg font-semibold">Patient Details</DialogTitle>
                            </DialogHeader>

                            {/* Scrollable area for the patient form */}
                            <ScrollArea className="h-[calc(90vh-5rem)] px-6 pb-6">
                                <PatientForm data={patient} mode="view" />
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>

                    <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                        <AlertDialogTrigger asChild>
                            <Button className="shrink-0">Edit Patient Details</Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Edit</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You are about to edit this patient’s details. Please ensure that any changes are correct before saving.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleConfirmEdit}>Proceed to Edit</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* --- Step 2: Unclosable Edit Dialog --- */}
                    <Dialog open={open}>
                        <DialogContent
                            className="h-[90vh] max-w-[95vw] overflow-hidden p-0 md:max-w-6xl [&>button]:hidden"
                            onPointerDownOutside={(e) => e.preventDefault()} // disable backdrop close
                            onEscapeKeyDown={(e) => e.preventDefault()} // disable Esc close
                        >
                            {/* Header Row: Title (left) + Cancel (right) */}
                            <div className="flex items-center justify-between border-b bg-background p-4">
                                <DialogTitle className="text-lg font-semibold">Edit Patient Details</DialogTitle>
                                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                            </div>

                            {/* Scrollable Patient Form */}
                            <ScrollArea className="h-[calc(90vh-4rem)]">
                                <div className="px-6 py-6">
                                    <PatientForm {...ExistingPatientController.update.put(patient.patient_id)} data={patient} mode="edit" />
                                </div>
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* --- Dashboard Below --- */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                    <div className="space-y-4 lg:col-span-3">
                        <Card>
                            <CardHeader>
                                {/* <CardTitle>Vital Signs Dashboard</CardTitle> */}
                                {/* Inline Summary Cards */}
                                <CardTitle className="flex flex-1 flex-wrap justify-start gap-3">
                                    {/* Chief Complaint */}
                                    <Card className="w-[260px] border shadow-sm">
                                        <CardHeader>
                                            <CardTitle className="text-md font-bold">Chief Complaint</CardTitle>
                                        </CardHeader>
                                        <CardContent className="truncate pt-0 text-sm">
                                            {latest_encounter?.chief_complaint ?? 'No complaint recorded'}
                                        </CardContent>
                                    </Card>

                                    {/* Medical Intervention */}
                                    <Card className="w-[260px] border shadow-sm">
                                        <CardHeader>
                                            <CardTitle className="text-md font-bold">Intervention</CardTitle>
                                        </CardHeader>
                                        <CardContent className="truncate pt-0 text-sm">
                                            {latest_encounter?.intervention ?? latest_encounter?.encounter_class ?? 'No intervention recorded'}
                                        </CardContent>
                                    </Card>

                                    {/* Current Prescriptions */}
                                    <Card className="w-[260px] border shadow-sm">
                                        <CardHeader>
                                            <CardTitle className="text-md font-bold">Current Medication</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0 text-sm">
                                            {latest_encounter?.patient_prescriptions?.length > 0 ? (
                                                <ul className="ml-4 list-disc space-y-0.5">
                                                    {latest_encounter.patient_prescriptions.slice(0, 2).map((rx: any) => (
                                                        <li key={rx.prescription_id} className="truncate">
                                                            {rx.medication_name}
                                                        </li>
                                                    ))}
                                                    {latest_encounter.patient_prescriptions.length > 2 && (
                                                        <li className="text-xs">+ more medications</li>
                                                    )}
                                                </ul>
                                            ) : (
                                                <span className="text-sm">No prescriptions</span>
                                            )}
                                        </CardContent>
                                    </Card>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <VitalSignsDashboard vitalSigns={vitalsigns} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right sidebar encounters */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader className="flex items-center justify-between">
                                <CardTitle>Medical Encounters</CardTitle>
                                <CreateEncounterModal patient={patient} lastEncounter={latest_encounter} encounterTypes={encounterTypes} />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e: any) => {
                                        router.get(patients.encounters.index.url(patient.patient_id));
                                    }}
                                >
                                    Expand
                                </Button>
                            </CardHeader>

                            <CardContent>
                                <ScrollArea className="h-[32rem] pr-2">
                                    {medical_encounters.length > 0 ? (
                                        <ul className="space-y-2">
                                            {medical_encounters.map((enc: any) => (
                                                <li key={enc.encounter_id} className="rounded-md border p-2 text-sm">
                                                    <div className="font-semibold">{enc.encounter_type}</div>
                                                    <div className="text-xs">{enc.encounter_date}</div>
                                                    <div className="mt-1">
                                                        <span className="font-medium">Complaint:</span> {enc.chief_complaint ?? 'N/A'}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No medical encounters yet.</p>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
