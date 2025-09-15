import PatientForm from '@/components/patientform';
import AppLayout from '@/layouts/app-layout';
import patients from '@/routes/patients';
import { type BreadcrumbItem } from '@/types';
import { router, useForm } from '@inertiajs/react';
import React from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Patients',
        href: patients.index.url(),
    },
    {
        title: 'Patient',
        href: patients.create.url(),
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        philhealth_id: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        router.post(patients.store.url());
    }

    return (
        <AppLayout>
            <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
                <h2 className="mb-4 text-lg font-bold">New Patient</h2>
                <PatientForm data={data} setData={setData} onSubmit={handleSubmit} processing={processing} errors={errors} />
            </div>
        </AppLayout>
    );
}
