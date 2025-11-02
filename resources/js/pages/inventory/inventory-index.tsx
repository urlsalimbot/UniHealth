import { StocksColumns } from '@/components/columns-stocks';
import { DataTable } from '@/components/datatable';
import { ApproveModal } from '@/components/form-medreq-modal';
import LowStockAlertCard from '@/components/low-stock-alert';
import MedicationRequestsTable from '@/components/med-request-table';
import MedicationsTable from '@/components/medications-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import inventory from '@/routes/inventory';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { 
    Package, 
    AlertTriangle, 
    TrendingUp, 
    Clock, 
    Users, 
    Activity,
    Filter,
    RefreshCw
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Inventory', href: inventory.index.url() }];

export default function Index() {
    const { medications, filters, currInventory, lowStockAlerts, requests, stats, recentActivity } = usePage().props as any;

    // 💊 Search handling
    const [searchMedication, setSearchMedication] = useState('');
    const [openApprove, setOpenApprove] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');

    const handleApprove = (req: any) => {
        setSelectedRequest(req);
        setOpenApprove(true);
    };

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
        router.get(inventory.index.url(), { 
            ...filters, 
            status: value 
        }, { 
            preserveState: true,
            preserveScroll: true 
        });
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'fulfilled': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat().format(num);
    };

    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(num);
    };

    const refreshData = () => {
        router.get(inventory.index.url(), { 
            refresh: true 
        }, { 
            preserveState: false,
            preserveScroll: true 
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory Dashboard" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* ======================= */}
                {/* 📊 Dashboard Statistics */}
                {/* ======================= */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Inventory Dashboard</h1>
                        <p className="text-muted-foreground">Manage medications, stock levels, and requests</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={refreshData}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Medications</p>
                                    <p className="text-2xl font-bold">{formatNumber(stats?.total_medications || 0)}</p>
                                </div>
                                <Package className="h-8 w-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
                                    <p className="text-2xl font-bold">{formatCurrency(stats?.total_inventory_value || 0)}</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Critical Stock</p>
                                    <p className="text-2xl font-bold text-red-600">{formatNumber(stats?.critical_stock_count || 0)}</p>
                                </div>
                                <AlertTriangle className="h-8 w-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Expiring Soon</p>
                                    <p className="text-2xl font-bold text-orange-600">{formatNumber(stats?.expiring_soon_count || 0)}</p>
                                </div>
                                <Clock className="h-8 w-8 text-orange-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Request Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Request Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                            <div className="text-center">
                                <p className="text-2xl font-bold">{formatNumber(stats?.request_summary?.total || 0)}</p>
                                <p className="text-sm text-muted-foreground">Total Requests</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-yellow-600">{formatNumber(stats?.request_summary?.pending || 0)}</p>
                                <p className="text-sm text-muted-foreground">Pending</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">{formatNumber(stats?.request_summary?.approved || 0)}</p>
                                <p className="text-sm text-muted-foreground">Approved</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{formatNumber(stats?.request_summary?.fulfilled || 0)}</p>
                                <p className="text-sm text-muted-foreground">Fulfilled</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-red-600">{formatNumber(stats?.request_summary?.rejected || 0)}</p>
                                <p className="text-sm text-muted-foreground">Rejected</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ======================= */}
                {/* 📦 Inventory + Medications */}
                {/* ======================= */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* 🧾 Stocks */}
                    <Card className="overflow-hidden lg:col-span-2">
                        <CardHeader className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                            <CardTitle>Current Stock</CardTitle>
                            <Button size="sm" onClick={() => router.get(inventory.stock.create.url())}>
                                + Intake Stock
                            </Button>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <DataTable
                                data={currInventory.data}
                                columns={StocksColumns}
                                paginator={{
                                    current_page: currInventory.current_page,
                                    last_page: currInventory.last_page,
                                    per_page: currInventory.per_page,
                                    total: currInventory.total,
                                }}
                                filters={filters}
                                baseUrl={inventory.index.url()}
                                label="total_stock"
                                field="total_stock"
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
                    <CardHeader className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                        <CardTitle>Medication Requests</CardTitle>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <Select value={statusFilter} onValueChange={handleStatusFilter}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="fulfilled">Fulfilled</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <MedicationRequestsTable requests={requests} onApprove={handleApprove} />
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                {recentActivity && recentActivity.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentActivity.map((activity: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Badge className={getStatusColor(activity.action)}>
                                                {activity.action}
                                            </Badge>
                                            <div>
                                                <p className="text-sm font-medium">{activity.description}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Patient: {activity.patient_name} • By: {activity.user}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(activity.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* ======================= */}
                {/* 🚨 Low Stock Alerts */}
                {/* ======================= */}
                <Card>
                    <LowStockAlertCard lowStocks={lowStockAlerts} />
                </Card>
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
