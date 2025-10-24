import PatientRegistrationController from '@/actions/App/Http/Controllers/Patients/PatientRegistrationController';
import PatientForm from '@/components/form-patient';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function PatientRegister({ token }: any) {
    return (
        <AppLayout>
            <Head title="Patient Registration" />
            <div className="flex h-full flex-1 flex-col overflow-x-auto rounded-xl p-4 pt-2">
                <Card className="mt-4 flex-3">
                    <CardContent>
                        <PatientForm {...PatientRegistrationController.submit.form(token)} mode={'create'} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
