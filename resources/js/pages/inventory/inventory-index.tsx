import { StocksColumns } from '@/components/columns-stocks';
import { DataTable } from '@/components/datatable';
import { ApproveModal } from '@/components/form-medreq-modal';
import InventoryLowStockAlerts from '@/components/inventory-low-stock-alert';
import MedicationRequestsTable from '@/components/med-request-table';
import MedicationsTable from '@/components/medications-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import inventory from '@/routes/inventory';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Inventory', href: inventory.index.url() }];

export default function Index() {
    const { medications, filters, curr_inventory, low_stock_items, requests } = usePage().props as any;

    // 💊 Search handling
    const [searchMedication, setSearchMedication] = useState('');
    const [openApprove, setOpenApprove] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

    const handleApprove = (req: any) => {
        setSelectedRequest(req);
        setOpenApprove(true);
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
            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* ======================= */}
                {/* 📦 Inventory + Medications */}
                {/* ======================= */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* 🧾 Stocks */}
                    <Card className="overflow-hidden lg:col-span-2">
                        <CardHeader className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                            <CardTitle>Stocks</CardTitle>
                            <Button size="sm" onClick={() => router.get(inventory.stock.create.url())}>
                                + Intake Stock
                            </Button>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <DataTable
                                data={curr_inventory.data}
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

                    {/* 💊 Medications */}
                    <Card className="overflow-hidden">
                        <CardHeader className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                            <CardTitle>Medications</CardTitle>
                            <Button size="sm" onClick={() => router.get(inventory.medication.create.url())}>
                                + New Medication
                            </Button>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <MedicationsTable
                                medications={filteredMeds}
                                search={searchMedication}
                                onSearchChange={(e) => setSearchMedication(e.target.value)}
                                onRowClick={(id) => router.get(inventory.item.show(id))}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* ======================= */}
                {/* 📋 Medication Requests */}
                {/* ======================= */}
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle>Medication Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <MedicationRequestsTable requests={requests} onApprove={handleApprove} />
                    </CardContent>
                </Card>

                {/* ======================= */}
                {/* 🚨 Low Stock Alerts */}
                {/* ======================= */}
                {low_stock_items.length > 0 && (
                    <InventoryLowStockAlerts lowStockItems={low_stock_items} onItemClick={(id) => router.get(inventory.item.show(id))} />
                )}
            </div>

            {/* ======================= */}
            {/* ✅ Approve Modal */}
            {/* ======================= */}
            {selectedRequest && (
                <ApproveModal requestId={selectedRequest.id} medications={filteredMeds} open={openApprove} onClose={() => setOpenApprove(false)} />
            )}
        </AppLayout>
    );
}
