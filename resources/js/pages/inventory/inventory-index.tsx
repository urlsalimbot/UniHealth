import { StocksColumns } from '@/components/columns-stocks';
import { DataTable } from '@/components/datatable';
import InventoryLowStockAlerts from '@/components/inventory-low-stock-alert';
import MedicationsTable from '@/components/medications-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import inventory from '@/routes/inventory';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventory',
        href: inventory.index.url(),
    },
];

export default function Index() {
    const { medications, filters, curr_inventory, low_stock_items } = usePage().props as any;

    // 🔍 Separate search states
    const [searchStock, setSearchStock] = useState('');
    const [searchMedication, setSearchMedication] = useState('');

    // 🔍 STOCK search handler (affects DataTable / inventory stock list)
    const handleStockSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchStock(value);
        router.get(
            inventory.index.url(),
            { ...filters, stock_search: value }, // optional param name
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    // 💊 MEDICATION search handler
    const handleMedicationSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchMedication(value);
        router.get(
            inventory.index.url(),
            { ...filters, medication_search: value }, // optional param name
            { preserveScroll: true, preserveState: true, replace: true },
        );
    };

    const filteredMeds = useMemo(() => {
        const meds = Array.isArray(medications) ? medications : (medications?.data ?? []);
        if (!searchMedication) return meds;
        const term = searchMedication.toLowerCase();
        return meds.filter(
            (m: any) =>
                m.generic_name?.toLowerCase().includes(term) ||
                m.brand_names?.toLowerCase().includes(term) ||
                m.drug_class?.toLowerCase().includes(term),
        );
    }, [medications, searchMedication]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory" />

            <div className="flex flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex h-[95%] space-x-4">
                    {/* 🧾 Stocks Table (Editable) */}
                    <Card className="mt-4 flex-3">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Stocks</CardTitle>
                            <div className='space-x-6'>
                                <Button className="w-fit justify-end" onClick={() => router.get(inventory.stock.create.url())}>
                                    + Intake Stock
                                </Button>
                                <Button className="w-fit justify-end" onClick={() => router.get(inventory.stock.release.url())}>
                                    - Release Medication
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {/* 🔍 Stock Search Input */}
                            <DataTable
                                data={curr_inventory.data} // ✅ access .data for paginated result
                                columns={StocksColumns}
                                paginator={{
                                    current_page: curr_inventory.current_page,
                                    last_page: curr_inventory.last_page,
                                    per_page: curr_inventory.per_page,
                                    total: curr_inventory.total,
                                }}
                                filters={filters}
                                baseUrl={inventory.index.url()}
                                label="Current Stock"
                                field="current_stock"
                                onRowClick={(row) => router.get(inventory.item.show(row.medication_id))}
                            />
                        </CardContent>
                    </Card>

                    {/* 💊 Medications Panel */}
                    <Card className="mt-4 flex flex-1">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Medications</CardTitle>
                            <CardTitle>
                                <Button onClick={() => router.get(inventory.medication.create.url())}>+ New Medication</Button>
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <MedicationsTable
                                medications={filteredMeds}
                                search={searchMedication}
                                onSearchChange={handleMedicationSearch}
                                onRowClick={(id) => router.get(inventory.item.show(id))}
                            />
                        </CardContent>
                    </Card>

                    {/* 🚨 Low Stock Alert Panel */}
                    {low_stock_items.length > 0 && (
                        <InventoryLowStockAlerts lowStockItems={low_stock_items} onItemClick={(id) => router.get(inventory.item.show(id))} />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
