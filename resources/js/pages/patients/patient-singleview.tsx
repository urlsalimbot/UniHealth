import VitalSignsDashboard from '@/components/patient-vitals-charts';
import PatientForm from '@/components/patientform';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@headlessui/react';
import { Head, usePage } from '@inertiajs/react';

export default function PatientSingleView() {
    const { patient, medical_encounters, latest_encounter } = usePage().props as any;

    const breadcrumbs = [
        { title: 'Patients', href: '/patients' },
        { title: patient.last_name, href: `/patients/${patient.patient_id}` },
    ];

    const latestVitals = latest_encounter?.vital_signs?.[0] || patient.vital_signs?.[0] || {};

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patient Details" />
            <div className="mt-4 space-y-6 p-4">
                
                {/* --- Top Row: View Button + Summary Cards --- */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* View Patient Details Button */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="shrink-0">View Patient Details</Button>
                        </DialogTrigger>
                        <DialogContent className="w-full">
                            <DialogHeader>
                                <DialogTitle>Patient Details</DialogTitle>
                            </DialogHeader>
                            <PatientForm data={patient} mode="view" />
                        </DialogContent>
                    </Dialog>

                    {/* Inline Summary Cards */}
                    <div className="flex flex-1 flex-wrap justify-end gap-3">
                        {/* Chief Complaint */}
                        <Card className="w-[260px] border border-muted/30 shadow-sm">
                            <CardHeader className="pb-1">
                                <CardTitle className="text-sm font-semibold text-gray-700">Chief Complaint</CardTitle>
                            </CardHeader>
                            <CardContent className="truncate pt-0 text-sm text-gray-800">
                                {latest_encounter?.chief_complaint ?? 'No complaint recorded'}
                            </CardContent>
                        </Card>

                        {/* Medical Intervention */}
                        <Card className="w-[260px] border border-muted/30 shadow-sm">
                            <CardHeader className="pb-1">
                                <CardTitle className="text-sm font-semibold text-gray-700">Intervention</CardTitle>
                            </CardHeader>
                            <CardContent className="truncate pt-0 text-sm text-gray-800">
                                {latest_encounter?.intervention ?? latest_encounter?.encounter_class ?? 'No intervention recorded'}
                            </CardContent>
                        </Card>

                        {/* Current Prescriptions */}
                        <Card className="w-[260px] border border-muted/30 shadow-sm">
                            <CardHeader className="pb-1">
                                <CardTitle className="text-sm font-semibold text-gray-700">Current Medication</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 text-sm text-gray-800">
                                {latest_encounter?.patient_prescriptions?.length > 0 ? (
                                    <ul className="ml-4 list-disc space-y-0.5">
                                        {latest_encounter.patient_prescriptions.slice(0, 2).map((rx: any) => (
                                            <li key={rx.prescription_id} className="truncate">
                                                {rx.medication_name}
                                            </li>
                                        ))}
                                        {latest_encounter.patient_prescriptions.length > 2 && (
                                            <li className="text-xs text-gray-500">+ more medications</li>
                                        )}
                                    </ul>
                                ) : (
                                    <span className="text-sm text-gray-500">No prescriptions</span>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* --- Dashboard Below --- */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                    <div className="space-y-4 lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Vital Signs Dashboard</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {latestVitals && Object.keys(latestVitals).length > 0 ? (
                                    <VitalSignsDashboard vitals={latestVitals} />
                                ) : (
                                    <p className="text-sm text-muted-foreground">No vital signs recorded.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right sidebar encounters */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Medical Encounters</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[32rem] pr-2">
                                    {medical_encounters.length > 0 ? (
                                        <ul className="space-y-2">
                                            {medical_encounters.map((enc: any) => (
                                                <li key={enc.encounter_id} className="rounded-md border p-2 text-sm">
                                                    <div className="font-semibold">{enc.encounter_type}</div>
                                                    <div className="text-xs text-gray-500">{enc.encounter_date}</div>
                                                    <div className="mt-1">
                                                        <span className="font-medium text-gray-700">Complaint:</span> {enc.chief_complaint ?? 'N/A'}
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
