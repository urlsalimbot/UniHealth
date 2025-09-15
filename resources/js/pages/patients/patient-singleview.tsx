import PatientForm from '@/components/patientform';
import AppLayout from '@/layouts/app-layout';
import patients from '@/routes/patients';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function PatientSingleView() {
    const { patient } = usePage().props as any;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Patients',
            href: patients.index.url(),
        },
        {
            title: patient.last_name, 
            href: patients.single.url(patient.patient_id), 
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patients" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h2 className="mb-4 text-lg font-bold">Patient Details</h2>
                <PatientForm data={patient} mode="view" />
            </div>
        </AppLayout>
    );
}
