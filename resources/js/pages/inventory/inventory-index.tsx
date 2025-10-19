import { getEditableStocksColumns } from '@/components/columns-stocks';
import { DataTable } from '@/components/datatable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import inventory from '@/routes/inventory';
import { BreadcrumbItem, FacilityMedicationInventory } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventory',
        href: inventory.index.url(),
    },
];

export default function Index() {
    const { medi, filters, curr_inventory, low_stock_items } = usePage().props as any;

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

    const [search, setSearch] = useState('');

    // Filter meds client-side by generic or brand name
    const filteredMeds = useMemo(() => {
        if (!search) return medi.data;
        const term = search.toLowerCase();
        return medi.data.filter(
            (m: any) =>
                m.generic_name.toLowerCase().includes(term) ||
                (m.brand_names && m.brand_names.toLowerCase().includes(term)) ||
                (m.drug_class && m.drug_class.toLowerCase().includes(term)),
        );
    }, [medi.data, search]);

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
                                <CardTitle className="flex w-fit justify-end gap-2">
                                    <Button onClick={handleSubmitChanges} variant="default">
                                        Confirm Changes ({Object.keys(changedStocks).length})
                                    </Button>
                                    <Button variant="outline" onClick={handleResetChanges}>
                                        Reset
                                    </Button>
                                </CardTitle>
                            ) : (
                                <Button className="w-fit justify-end" onClick={() => router.get(inventory.stockcreate.url())}>
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
                                onRowClick={(row) => router.get(inventory.item.show(row.medication_id))} // ✅ works now
                            />
                        </CardContent>
                    </Card>

                    <Card className="mt-4 flex flex-1">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Medications</CardTitle>
                            <CardTitle>
                                <Button onClick={() => router.get(inventory.medicationcreate.url())}>+ New Medication</Button>
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            {/* 🔍 Filter input */}
                            <div className="mb-4">
                                <Input
                                    placeholder="Search medications..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            {/* 💊 Scrollable Table */}
                            <ScrollArea className="h-fit rounded-md border">
                                <Table className="w-full text-sm">
                                    <TableHeader className="sticky top-0 z-10 bg-background">
                                        <TableRow className="border-b text-left">
                                            <TableHead className="p-2 font-medium">Generic Name</TableHead>
                                            <TableHead className="p-2 font-medium">Brand Names</TableHead>
                                            <TableHead className="p-2 font-medium">Dosage Form</TableHead>
                                            <TableHead className="p-2 font-medium">Strength</TableHead>
                                            <TableHead className="p-2 font-medium">Drug Class</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredMeds.length ? (
                                            filteredMeds.map((row: any) => (
                                                <TableRow
                                                    key={row.medication_id}
                                                    className="cursor-pointer border-b transition-colors hover:bg-muted/50"
                                                    onClick={() => router.get(inventory.item.show(row.medication_id))}
                                                >
                                                    <TableCell className="p-2">{row.generic_name}</TableCell>
                                                    <TableCell className="p-2">{row.brand_names || '—'}</TableCell>
                                                    <TableCell className="p-2">{row.dosage_form || '—'}</TableCell>
                                                    <TableCell className="p-2">{row.strength || '—'}</TableCell>
                                                    <TableCell className="p-2">{row.drug_class || '—'}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="p-4 text-center text-muted-foreground">
                                                    No matching medications found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                    {/* 🚨 Low Stock Alert Panel */}
                    {low_stock_items.length > 0 && (
                        <Card className="mt-4 border-red-300 bg-red-50 dark:bg-red-950/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600">⚠️ Low Stock Alerts ({low_stock_items.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="max-h-64">
                                    <Table className="w-full text-sm">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Medication</TableHead>
                                                <TableHead>Current Stock</TableHead>
                                                <TableHead>Reorder Point</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {low_stock_items.map((item: any) => (
                                                <TableRow
                                                    key={item.inventory_id}
                                                    className="cursor-pointer hover:bg-muted/50"
                                                    onClick={() => router.get(inventory.item.show(item.medication_id))}
                                                >
                                                    <TableCell>{item.medication?.generic_name ?? '—'}</TableCell>
                                                    <TableCell
                                                        className={
                                                            item.current_stock < item.minimum_stock_level
                                                                ? 'font-semibold text-red-600'
                                                                : 'font-medium text-amber-600'
                                                        }
                                                    >
                                                        {item.current_stock}
                                                    </TableCell>
                                                    <TableCell>{item.reorder_point}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
