import PatientCreateController from '@/actions/App/Http/Controllers/Patients/PatientCreateController';
import PatientForm from '@/components/patientform';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import patients from '@/routes/patients';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Patients',
        href: patients.index.url(),
    },
    {
        title: 'Create Patient',
        href: patients.create.url(),
    },
];

export default function Create() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Patient - Create`} />
            <div className="flex h-full flex-1 flex-col overflow-x-auto rounded-xl p-4 pt-2">
                <Card className="mt-4 flex-3">
                    <CardContent>
                        <PatientForm {...PatientCreateController.store.form()} mode={'create'} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
