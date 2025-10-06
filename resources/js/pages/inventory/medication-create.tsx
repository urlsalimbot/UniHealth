import MedicationCreateController from '@/actions/App/Http/Controllers/Inventory/MedicationCreateController';
import MedicationForm from '@/components/medicationform';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import inventory from '@/routes/inventory';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function MedicationCreate() {
    const { medication } = usePage().props as any;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Inventory', href: inventory.index.url() },
        { title: 'Create Medication', href: inventory.medicationcreate.url() },
    ];

    const getStockStatus = (current: number, minimum: number) => {
        if (current <= minimum) return { label: 'Low Stock', color: 'bg-red-100 text-red-700' };
        if (current <= minimum * 1.5) return { label: 'Moderate', color: 'bg-yellow-100 text-yellow-700' };
        return { label: 'Healthy', color: 'bg-green-100 text-green-700' };
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Medication - Create" />

            <div className="flex h-full flex-1 flex-col overflow-x-auto rounded-xl p-4 pt-2">
                <Card className="mx-auto mt-4 w-full max-w-4xl">
                    <CardContent className="p-6">
                        <MedicationForm {...MedicationCreateController.store.form()} mode="create" />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
