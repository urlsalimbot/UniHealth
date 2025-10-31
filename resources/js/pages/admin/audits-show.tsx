import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function AuditShow() {
    const { audit } = usePage().props as any;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Audits',
            href: admin.audits.index.url(),
        },
        {
            title: `${audit.created_at}`,
            href: admin.audits.show.url(audit.id),
        },
    ];

    const oldValues = audit.old_values || {};
    const newValues = audit.new_values || {};

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory" />
            <div className="flex h-[calc(100vh-8.5rem)] flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex space-x-4">
                    <Card className="mt-4 flex flex-1">
                        <CardHeader>
                            <CardTitle>Audit #{audit.id}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>
                                <strong>User:</strong> {audit.user?.name ?? 'System'}
                            </p>
                            <p>
                                <strong>Event:</strong> <Badge>{audit.event}</Badge>
                            </p>
                            <p>
                                <strong>Model:</strong> {audit.auditable_type.split('\\').pop()}
                            </p>
                            <p>
                                <strong>Date:</strong> {new Date(audit.created_at).toLocaleString()}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="mb-2 font-semibold">Old Values</h3>
                                    <pre className="overflow-x-auto rounded p-2 text-sm">{JSON.stringify(oldValues, null, 2)}</pre>
                                </div>
                                <div>
                                    <h3 className="mb-2 font-semibold">New Values</h3>
                                    <pre className="overflow-x-auto rounded p-2 text-sm">{JSON.stringify(newValues, null, 2)}</pre>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
