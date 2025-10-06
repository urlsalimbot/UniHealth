import StockCreateController from '@/actions/App/Http/Controllers/Inventory/StockCreateController';
import StockForm from '@/components/stockform';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import inventory from '@/routes/inventory';
import { BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function InventoryIntakePage() {
    const { medications, facilities } = usePage().props as any;

    const form = useForm({
        facility_id: '',
        medication_id: '',
        current_stock: '',
        minimum_stock_level: '',
        lot_number: '',
        expiration_date: '',
        unit_cost: '',
        storage_location: '',
        supplier: '',
        received_date: '',
        received_by: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Inventory', href: inventory.index.url() },
        { title: 'Intake', href: inventory.stockcreate.url() },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory Intake" />

            <div className="flex h-full flex-1 flex-col overflow-x-auto rounded-xl p-4 pt-2">
                <Card className="flex flex-1">
                    <CardContent className="p-6">
                        <StockForm medications={medications} facilities={facilities} {...StockCreateController.store.form()} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
