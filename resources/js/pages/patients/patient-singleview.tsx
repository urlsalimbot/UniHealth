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
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import patients from '@/routes/patients';
import { Head, router, usePage } from '@inertiajs/react';
import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';
import { User, Calendar, Activity, FileText, Pill, Edit, Eye, Plus, ArrowRight } from 'lucide-react';

export default function PatientSingleView() {
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { patient, medical_encounters, latest_encounter, vitalsigns, encounterTypes, auth } = usePage().props as any;
    
    // Check if current user is a patient
    const isPatient = auth?.user?.role === 'patient';

    const breadcrumbs = [
        { title: 'Patients', href: '/patients' },
        { title: patient.last_name, href: patients.show.url(patient.patient_id) },
    ];

    const handleConfirmEdit = () => {
        setConfirmOpen(false);
        setOpen(true);
    };

    const latestVitals = latest_encounter?.vital_signs?.[0] || patient.vital_signs?.[0] || {};

    // Calculate patient age and format full name
    const patientAge = patient.date_of_birth 
        ? Math.floor((new Date().getTime() - new Date(patient.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 365))
        : null;
    const patientFullName = `${patient.first_name} ${patient.middle_name ? patient.middle_name + ' ' : ''}${patient.last_name}`;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patient Details" />
            <div className="flex h-[calc(100vh-8.5rem)] flex-col gap-6 p-6">
                {/* --- Patient Header with Actions --- */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{patientFullName}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                {patientAge && <span>Age: {patientAge} years</span>}
                                {patient.gender && <span>Gender: {patient.gender}</span>}
                                {patient.patient_id && <span>ID: {patient.patient_id}</span>}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <Eye className="h-4 w-4" />
                                    View Details
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="h-[90vh] max-w-[95vw] overflow-hidden p-0 md:max-w-6xl">
                                <DialogHeader className="flex items-center justify-between p-6 pb-0">
                                    <DialogTitle className="font-semibold text-lg">Patient Details</DialogTitle>
                                </DialogHeader>

                                <ScrollArea className="h-[calc(90vh-5rem)] px-6 pb-6">
                                    <div className="flex items-start justify-between gap-8">
                                        <div className="flex-1">
                                            <PatientForm data={patient} mode="view" />
                                        </div>
                                        {patient?.patient_id && (
                                            <div className="flex flex-col items-center justify-start">
                                                <div className="rounded-lg border bg-muted/20 p-4">
                                                    <QRCodeCanvas value={patient.patient_id.toString()} size={200} level="H" includeMargin={true} />
                                                    <p className="mt-2 text-center text-xs font-medium">UHID: {patient.patient_id}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>

                        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                            <AlertDialogTrigger asChild>
                                <Button className="gap-2">
                                    <Edit className="h-4 w-4" />
                                    Edit Patient
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Edit</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        You are about to edit this patient's details. Please ensure that any changes are correct before saving.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleConfirmEdit}>Proceed to Edit</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Dialog open={open}>
                            <DialogContent
                                className="h-[90vh] max-w-[95vw] overflow-hidden p-0 md:max-w-6xl [&>button]:hidden"
                                onPointerDownOutside={(e) => e.preventDefault()}
                                onEscapeKeyDown={(e) => e.preventDefault()}
                            >
                                <div className="flex items-center justify-between border-b bg-background p-6">
                                    <DialogTitle className="text-lg font-semibold">Edit Patient Details</DialogTitle>
                                    <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                                        Cancel
                                    </Button>
                                </div>

                                <ScrollArea className="h-[calc(90vh-4rem)]">
                                    <div className="px-6 py-6">
                                        <PatientForm {...ExistingPatientController.update.put(patient.patient_id)} data={patient} mode="edit" />
                                    </div>
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* --- Main Content Grid --- */}
                <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* --- Left Column: Clinical Overview --- */}
                    <div className="flex flex-col gap-6 lg:col-span-8">
                        {/* --- Quick Summary Cards --- */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <Card className="relative overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Chief Complaint
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm leading-relaxed">
                                        {latest_encounter?.chief_complaint ?? 'No complaint recorded'}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <Activity className="h-4 w-4" />
                                        Intervention
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm leading-relaxed">
                                        {latest_encounter?.intervention ?? latest_encounter?.encounter_class ?? 'No intervention recorded'}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <Pill className="h-4 w-4" />
                                        Current Medications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {latest_encounter?.patient_prescriptions?.length > 0 ? (
                                        <div className="space-y-1">
                                            {latest_encounter.patient_prescriptions.slice(0, 2).map((rx: any) => (
                                                <div key={rx.prescription_id} className="text-sm">
                                                    <span className="font-medium">{rx.medication?.generic_name || rx.medication_name}</span>
                                                    {rx.dosage && <span className="text-muted-foreground"> - {rx.dosage}</span>}
                                                </div>
                                            ))}
                                            {latest_encounter.patient_prescriptions.length > 2 && (
                                                <p className="text-xs text-muted-foreground">
                                                    +{latest_encounter.patient_prescriptions.length - 2} more medications
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No prescriptions</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* --- Vital Signs Dashboard --- */}
                        <Card className="flex-1">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Vital Signs Monitoring
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-full">
                                <VitalSignsDashboard vitalSigns={vitalsigns} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- Right Column: Encounters --- */}
                    <div className="flex flex-col gap-4 lg:col-span-4">
                        <Card className="flex-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Medical Encounters
                                </CardTitle>
                                <div className="flex gap-2">
                                    {!isPatient && <CreateEncounterModal patient={patient} lastEncounter={latest_encounter} encounterTypes={encounterTypes} />}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e: any) => {
                                            router.get(patients.encounters.index.url(patient.patient_id));
                                        }}
                                        className="gap-1"
                                    >
                                        <ArrowRight className="h-3 w-3" />
                                        All
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <ScrollArea className="h-[400px] pr-2">
                                    {medical_encounters.length > 0 ? (
                                        <div className="space-y-3">
                                            {medical_encounters.map((enc: any) => (
                                                <div key={enc.encounter_id} className="rounded-lg border bg-card p-3 hover:bg-muted/50 transition-colors">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                                                                <span className="font-semibold text-sm">{enc.encounter_type}</span>
                                                            </div>
                                                            <div className="mt-1 text-xs text-muted-foreground">
                                                                {new Date(enc.encounter_date).toLocaleDateString()}
                                                            </div>
                                                            <div className="mt-2 text-sm">
                                                                <span className="text-muted-foreground">Complaint:</span> {enc.chief_complaint ?? 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <Calendar className="h-12 w-12 text-muted-foreground mb-3" />
                                            <p className="text-sm text-muted-foreground">No medical encounters yet</p>
                                            <p className="text-xs text-muted-foreground mt-1">Create the first encounter to get started</p>
                                        </div>
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
