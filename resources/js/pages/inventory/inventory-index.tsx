import { medicationscolumns } from '@/components/columns-medication';
import { getEditableStocksColumns } from '@/components/columns-stocks';
import { DataTable } from '@/components/datatable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import inventory from '@/routes/inventory';
import { BreadcrumbItem, FacilityMedicationInventory } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventory',
        href: inventory.index.url(),
    },
];

export default function Index() {
    const { medi, filters, curr_inventory } = usePage().props as any;

    const [editableStocks, setEditableStocks] = useState(curr_inventory.data);
    const [changedStocks, setChangedStocks] = useState<Record<string, Partial<FacilityMedicationInventory>>>({});

    const handleStockChange = (id: string, field: keyof FacilityMedicationInventory, value: any) => {
        setEditableStocks((prev: FacilityMedicationInventory[]) =>
            prev.map((item: FacilityMedicationInventory) => (item.inventory_id === id ? { ...item, [field]: value } : item)),
        );
        setChangedStocks((prev) => ({
            ...prev,
            [id]: { ...prev[id], [field]: value },
        }));
    };

    const handleSubmitChanges = () => {
        if (Object.keys(changedStocks).length === 0) return;

        router.put(
            inventory.bulkupdate.url(),
            { changes: changedStocks },
            {
                preserveScroll: true,
                onSuccess: () => setChangedStocks({}),
            },
        );
    };

    const handleResetChanges = () => {
        setEditableStocks(curr_inventory.data);
        setChangedStocks({});
    };

    const editableStocksColumns = getEditableStocksColumns(handleStockChange);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex space-x-4">
                    {/* 🧾 Stocks Table (Editable) */}
                    <Card className="mt-4 flex-3">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Stocks</CardTitle>
                            {/* ✅ Confirm/Reset Buttons */}
                            {Object.keys(changedStocks).length > 0 ? (
                                <div className="flex w-fit justify-end gap-2">
                                    <Button onClick={handleSubmitChanges} variant="default">
                                        Confirm Changes ({Object.keys(changedStocks).length})
                                    </Button>
                                    <Button variant="outline" onClick={handleResetChanges}>
                                        Reset
                                    </Button>
                                </div>
                            ) : (
                                <Button className="w-fit justify-end" onClick={() => router.get(inventory.create.url())}>
                                    + New Stock
                                </Button>
                            )}
                        </CardHeader>

                        <CardContent>
                            <DataTable
                                data={editableStocks}
                                columns={editableStocksColumns}
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
                                onRowClick={(row) => router.get(inventory.show(row.inventory_id))} // ✅ works now
                            />
                        </CardContent>
                    </Card>
                                
                    {/* 💊 Medications Table (Unchanged) */}
                    <Card className="mt-4 flex flex-1">
                        <CardHeader className="flex flex-row items-center justify-between">
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
                                onRowClick={(row) => router.get(inventory.medication.show(row.medication_id))} // ✅ works nowI
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
