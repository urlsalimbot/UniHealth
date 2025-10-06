import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import inventory from '@/routes/inventory';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function InventorySingle() {
    const { medication } = usePage().props as any;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Inventory', href: inventory.index.url() },
        { title: medication.generic_name, href: inventory.item.show.url(medication.medication_id) },
    ];

    const getStockStatus = (current: number, minimum: number) => {
        if (current <= minimum) return { label: 'Low Stock', color: 'bg-red-100 text-red-700' };
        if (current <= minimum * 1.5) return { label: 'Moderate', color: 'bg-yellow-100 text-yellow-700' };
        return { label: 'Healthy', color: 'bg-green-100 text-green-700' };
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Medication - ${medication.generic_name}`} />

            <div className="flex flex-col gap-6 p-6 md:flex-row">
                {/* LEFT: Medication Hero */}
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold">{medication.generic_name}</CardTitle>
                        <CardDescription>
                            {medication.drug_class} • {medication.dosage_form} • {medication.strength}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p>
                            <span className="font-medium">Brand Names:</span> {medication.brand_names || '—'}
                        </p>
                        <p>
                            <span className="font-medium">FDA Registration:</span> {medication.fda_registration || 'N/A'}
                        </p>
                        <p>
                            <span className="font-medium">Controlled Substance:</span>{' '}
                            {medication.controlled_substance ? <Badge variant="destructive">Yes</Badge> : <Badge variant="outline">No</Badge>}
                        </p>
                    </CardContent>
                </Card>

                {/* RIGHT: Facility Inventory */}
                <Card className="flex-[1.5]">
                    <CardHeader>
                        <CardTitle className="text-xl">Facility Inventory</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {medication.facility_medication_inventory?.length ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {medication.facility_medication_inventory.map((inv: any, i: number) => {
                                    const status = getStockStatus(inv.current_stock, inv.minimum_stock);
                                    return (
                                        <Card key={i} className="border border-border shadow-sm transition hover:shadow-md">
                                            <CardHeader className="pb-2">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-base font-semibold">{inv.facility?.facility_name}</CardTitle>
                                                    <Badge className={status.color}>{status.label}</Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-1 text-sm">
                                                <p>
                                                    <span className="font-medium">Current Stock:</span> {inv.current_stock}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Minimum Stock:</span> {inv.minimum_stock_level}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Expiration Date:</span>{' '}
                                                    {inv.expiration_date ? new Date(inv.expiration_date).toLocaleDateString() : '—'}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No inventory records found for this medication.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
