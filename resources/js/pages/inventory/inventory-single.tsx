import { dispose, zeroOut } from '@/actions/App/Http/Controllers/Inventory/StockEndOfLifeController';
import ConfirmDialog from '@/components/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import inventory from '@/routes/inventory';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function InventorySingle() {
    const page = usePage<any>();
    const { medication, facility } = page.props;
    const user = page.props.auth?.user;
    const userRole = user?.role ?? 'guest';

    // 🧭 Role-based breadcrumbs
    const breadcrumbs: BreadcrumbItem[] =
        userRole === 'patient'
            ? [
                  { title: 'Medications', href: inventory.patient.index.url() },
                  { title: medication.generic_name, href: inventory.item.show.url(medication.medication_id) },
              ]
            : [
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

            <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6 md:flex-row">
                {/* LEFT: Medication Details */}
                <Card className="h-fit w-full flex-1">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold break-words sm:text-2xl">{medication.generic_name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm sm:space-y-3 sm:text-base">
                        <p>
                            <span className="font-medium">Brand Names:</span> {medication.brand_names || '—'}
                        </p>
                        <p>
                            <span className="font-medium">Drug Class:</span> {medication.drug_class || '—'}
                        </p>
                        <p>
                            <span className="font-medium">Dosage Form:</span> {medication.dosage_form || '—'}
                        </p>
                        <p>
                            <span className="font-medium">Strength:</span> {medication.strength || '—'}
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

                {/* RIGHT: Facility Inventory — hidden for patients */}
                {userRole !== 'patient' && (
                    <Card className="w-full flex-[1.5]">
                        <CardHeader className="pb-2 sm:pb-4">
                            <CardTitle className="truncate text-lg sm:text-xl">Facility Inventory: {facility}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {medication.facility_medication_inventory?.length ? (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                                    {medication.facility_medication_inventory
                                        .slice()
                                        .sort((a: any, b: any) => {
                                            const dateA = a.expiration_date ? new Date(a.expiration_date).getTime() : Infinity;
                                            const dateB = b.expiration_date ? new Date(b.expiration_date).getTime() : Infinity;
                                            return dateA - dateB;
                                        })
                                        .map((inv: any, i: number) => {
                                            const status = getStockStatus(inv.current_stock, inv.minimum_stock_level);
                                            return (
                                                <Card key={i} className="border border-border shadow-sm transition hover:shadow-md">
                                                    <CardHeader className="pb-1 sm:pb-2">
                                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                            <CardTitle className="text-base font-semibold">Supplier: {inv.supplier}</CardTitle>
                                                            <Badge className={status.color}>{status.label}</Badge>
                                                        </div>
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            <ConfirmDialog
                                                                onConfirm={() => dispose(inv.inventory_id)}
                                                                trigger={
                                                                    <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                                                                        Disposed
                                                                    </Button>
                                                                }
                                                                title="Confirm Disposal of Stock"
                                                                description="Are you sure you have disposed of this stock?"
                                                                confirmLabel="Confirm"
                                                                cancelLabel="Cancel"
                                                            />
                                                            <ConfirmDialog
                                                                onConfirm={() => zeroOut(inv.inventory_id)}
                                                                trigger={
                                                                    <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                                                                        Depleted
                                                                    </Button>
                                                                }
                                                                title="Confirm Depletion of Stock"
                                                                description="Are you sure this stock reached 0 inventory?"
                                                                confirmLabel="Confirm"
                                                                cancelLabel="Cancel"
                                                            />
                                                        </div>
                                                    </CardHeader>

                                                    <CardContent className="space-y-1 text-xs sm:text-sm">
                                                        <p>
                                                            <span className="font-medium">Current Stock:</span> {inv.current_stock}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Minimum Stock:</span> {inv.minimum_stock_level}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Expiration Date:</span>{' '}
                                                            {inv.expiration_date
                                                                ? new Date(inv.expiration_date).toLocaleDateString('en-US', {
                                                                      year: 'numeric',
                                                                      month: 'long',
                                                                      day: 'numeric',
                                                                  })
                                                                : '—'}
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
                )}
            </div>
        </AppLayout>
    );
}
