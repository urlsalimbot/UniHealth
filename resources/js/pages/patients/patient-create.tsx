import PatientCreateController from '@/actions/App/Http/Controllers/Patients/PatientCreateController';
import PatientForm from '@/components/patientform';
import AppLayout from '@/layouts/app-layout';
import patients from '@/routes/patients';
import { SharedData, type BreadcrumbItem } from '@/types';
import { router, usePage } from '@inertiajs/react';
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
    // console.log(PatientsController.store.form())
    const { auth } = usePage<SharedData>().props;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        router.post(patients.store.url());
    }

    return (
        <AppLayout>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h2 className="mb-4 text-lg font-bold">New Patient</h2>
                <PatientForm {...PatientCreateController.store.form()} mode={'create'} />
            </div>
        </AppLayout>
    );
}
