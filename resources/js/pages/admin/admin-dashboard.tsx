import { usercolumns } from '@/components/columns-users';
import { DataTable } from '@/components/datatable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

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
                    <Card className="mt-4 flex flex-1">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Users</CardTitle>
                        </CardHeader>
                        <CardContent>
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
