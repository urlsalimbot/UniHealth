import { patientcolumns } from '@/components/columns-patients';
import { DataTable } from '@/components/datatable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
                <div className="flex space-x-4">
                    <Card className="mt-4 flex flex-1">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Patients</CardTitle>
                            <CardTitle>
                                <Button onClick={() => router.get(patients.create.url())}>+ New Patient</Button>
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
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
                                label="Last Name"
                                field="last_name"
                                baseUrl={patients.index.url()}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
