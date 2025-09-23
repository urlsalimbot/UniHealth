import PatientForm from '@/components/patientform';
import AppLayout from '@/layouts/app-layout';
import patients from '@/routes/patients';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PatientSingleView() {
    const { patient, vital_signs, medical_encounters, patient_prescriptions } = usePage().props as any;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Patients', href: patients.index.url() },
        { title: patient.last_name, href: patients.show.url(patient.patient_id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patient Details" />
            <div className='mt-2 p-2'>
                {/* Patient Detail Modal */}
                <Dialog>
                    <DialogTrigger className="w-fit justify-end" asChild>
                        <Button>View Patient Details</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Patient Details</DialogTitle>
                        </DialogHeader>
                        <PatientForm data={patient} mode="view" />
                    </DialogContent>
                </Dialog>

                {/* Dashboard Section */}
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Vital Signs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Vital Signs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-64">
                                <ul className="space-y-2">
                                    {vital_signs.map((vs: any) => (
                                        <li key={vs.vital_sign_id} className="rounded-md border p-2 text-sm">
                                            <div>Date: {vs.measurement_date}</div>
                                            <div>
                                                BP: {vs.systolic_bp}/{vs.diastolic_bp}
                                            </div>
                                            <div>HR: {vs.heart_rate}</div>
                                            <div>Temp: {vs.temperature}</div>
                                        </li>
                                    ))}
                                </ul>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* Medical Encounters */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Medical Encounters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-64">
                                <ul className="space-y-2">
                                    {medical_encounters.map((enc: any) => (
                                        <li key={enc.encounter_id} className="rounded-md border p-2 text-sm">
                                            <div className="font-medium">{enc.encounter_type}</div>
                                            <div>Date: {enc.encounter_date}</div>
                                            <div>Status: {enc.encounter_status}</div>
                                        </li>
                                    ))}
                                </ul>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* Prescriptions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Prescriptions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-64">
                                <ul className="space-y-2">
                                    {patient_prescriptions.map((rx: any) => (
                                        <li key={rx.prescription_id} className="rounded-md border p-2 text-sm">
                                            <div className="font-medium">{rx.medication_name}</div>
                                            <div>Dosage: {rx.dosage}</div>
                                            <div>Frequency: {rx.frequency}</div>
                                        </li>
                                    ))}
                                </ul>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
