import { patientcolumns } from '@/components/patientcolumns';
import { DataTable } from '@/components/datatable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import patients from '@/routes/patients';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Patients',
        href: patients.index.url(),
    },
];

export default function Patients() {
    const { patient, filters } = usePage().props as any;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patients" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-4 flex justify-between">
                    <h2 className="text-lg font-bold">Patients</h2>
                    <Button onClick={() => router.get(patients.create.url())}>+ New Patient</Button>
                </div>

                <DataTable
                    data={patient.data}
                    columns={patientcolumns}
                    paginator={{
                        current_page: patient.current_page,
                        last_page: patient.last_page,
                        per_page: patient.per_page,
                        total: patient.total,
                    }}
                    filters={filters}
                    label='Last Name'
                    field='last_name'
                    baseUrl={patients.index.url()}
                />
            </div>
        </AppLayout>
    );
}
