import { DataTable } from '@/components/datatable';
import { medicationscolumns } from '@/components/medicationscolumns';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import medications from '@/routes/medications';
import { BreadcrumbItem, Medication } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventory',
        href: medications.index.url(),
    },
];

export default function Index() {
    const { medi, filters, flash } = usePage().props as any;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-4 flex justify-between">
                    <h2 className="text-lg font-bold">Inventory</h2>
                    <Button onClick={() => router.get(medications.create.url())}>+ New Medication</Button>
                </div>

                <DataTable
                    data={medi.data}
                    columns={medicationscolumns}
                    paginator={{
                        current_page: medi.current_page,
                        last_page: medi.last_page,
                        per_page: medi.per_page,
                        total: medi.total,
                    }}
                    filters={filters}
                    label='Generic Name'
                    field='generic_name'
                    baseUrl={medications.index.url()}
                />
            </div>
        </AppLayout>
    );
}
