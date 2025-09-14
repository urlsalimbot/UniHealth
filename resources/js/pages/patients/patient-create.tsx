import PatientForm from '@/components/patientform';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { router, useForm } from '@inertiajs/react';
import React from 'react';
import { route } from 'ziggy-js'; // If using the @routes directive or a globally available `route` function
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

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        philhealth_id: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        router.post(route('patients.store'));
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
