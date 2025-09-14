import PatientForm from '@/components/patientform';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import React from 'react';
import { route } from 'ziggy-js'; // If using the @routes directive or a globally available `route` function
import { Patient } from '@/types';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Patients',
        href: route('patients.index'),
    },
    {
        title: 'Patient',
        href: route('patients.create'),
    },
];

export default function SingleView({ patient }: { patient: Patient }) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: patient.first_name || '',
        last_name: patient.last_name || '',
        philhealth_id: patient.philhealth_id || '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/patients/${patient.patient_id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <h2 className="mb-4 text-lg font-bold">Edit Patient</h2>
            <PatientForm data={data} setData={setData} onSubmit={handleSubmit} processing={processing} errors={errors} />
        </AppLayout>
    );
}
