import PatientRegistrationController from '@/actions/App/Http/Controllers/Patients/PatientRegistrationController';
import PatientForm from '@/components/form-patient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import patients from '@/routes/patients';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Patients',
        href: patients.index.url(),
    },
    {
        title: 'Register Patient',
        href: patients.create.url(),
    },
];

export default function Create() {
    const { token } = usePage().props as any;

    return (
        <AppLayout>
            <Head title={`Patient Registrations`} />
            <div className="flex h-full flex-1 flex-col overflow-x-auto rounded-xl p-4 pt-2">
                <Card className="mt-4 flex-3">
                    <CardHeader>
                        <CardTitle>Patient Registration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PatientForm {...PatientRegistrationController.submit.form(token)} mode={'create'} token={token} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
