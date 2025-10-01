import { medicationscolumns } from '@/components/columns-medication';
import { stockscolumns } from '@/components/columns-stocks';
import { DataTable } from '@/components/datatable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import inventory from '@/routes/inventory';
import { BreadcrumbItem } from '@/types';

import { Head, router, usePage } from '@inertiajs/react';

type Medication = {
    medication_id: string;
    generic_name: string;
    brand_names: string;
    strength: string;
    dosage_form: string;
    drug_class: string;
};

type Inventory = {
    inventory_id: string;
    medication_id: string;
    current_stock: number;
    minimum_stock_level: number;
    expiration_date: string;
    supplier: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventory',
        href: inventory.index.url(),
    },
];

export default function Index() {
    const { medi, filters, curr_inventory } = usePage().props as any;

    console.log(curr_inventory)
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-4 flex justify-between">
                    <h2 className="text-lg font-bold">Inventory</h2>
                </div>

                {/* <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Stock Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {curr_inventory.filter((i: FacilityMedicationInventory) => i.current_stock <= i.minimum_stock_level).length === 0 ? (
                            <p className="text-sm text-gray-500">No low stock alerts</p>
                        ) : (
                            <ul className="text-sm">
                                {curr_inventory
                                    .filter((i: FacilityMedicationInventory) => i.current_stock <= i.minimum_stock_level)
                                    .map((i: FacilityMedicationInventory) => (
                                        <li key={i.inventory_id} className="text-red-500">
                                            Low stock for {i.medication_id} (current: {i.current_stock})
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </CardContent>
                </Card> */}
                <div className="flex space-x-4">
                    <Card className="mt-4 flex-1">
                        <CardHeader>
                            <CardTitle>Stocks</CardTitle>
                            <CardTitle>
                                <Button className="w-fit justify-end" onClick={() => router.get(inventory.create.url())}>
                                    + New Medication
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                data={curr_inventory.data}
                                columns={stockscolumns}
                                paginator={{
                                    current_page: curr_inventory.current_page,
                                    last_page: curr_inventory.last_page,
                                    per_page: curr_inventory.per_page,
                                    total: curr_inventory.total,
                                }}
                                filters={filters}
                                label="Current Stock"
                                field="current_stock"
                                baseUrl={inventory.index.url()}
                            />
                        </CardContent>
                    </Card>
                    <Card className="mt-4 flex flex-1">
                        <CardHeader className='flex flex-row items-center justify-between'>
                            <CardTitle>Medications</CardTitle>
                            <CardTitle>
                                <Button onClick={() => router.get(inventory.create.url())}>+ New Medication</Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
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
                                label="Generic Name"
                                field="generic_name"
                                baseUrl={inventory.index.url()}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
