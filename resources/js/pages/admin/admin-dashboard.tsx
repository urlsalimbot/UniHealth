import { usercolumns } from '@/components/columns-users';
import { DataTable } from '@/components/datatable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import patients from '@/routes/patients';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: admin.dashboard.url(),
    },
];

export default function AdminDashboard() {
    const { users, filters } = usePage().props as any;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-4 flex justify-between">
                    <h2 className="text-lg font-bold">Users</h2>
                    {/*     <Button onClick={() => router.get(patients.create.url())}>+ New Patient</Button> */}
                </div>

                <DataTable
                    data={users.data}
                    columns={usercolumns}
                    paginator={{
                        current_page: users.current_page,
                        last_page: users.last_page,
                        per_page: users.per_page,
                        total: users.total,
                    }}
                    filters={filters}
                    label="Name"
                    field="name"
                    baseUrl={admin.dashboard.url()}
                />
            </div>
        </AppLayout>
    );
}
