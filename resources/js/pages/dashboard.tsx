import LowStockAlertCard from '@/components/low-stock-alert';
import PatientsTriageUrgency from '@/components/patients-triage';
import { Card } from '@/components/ui/card';
import PatientEncountersHeatmap from '@/components/visits-heatmap';
import VisitsRadialChart from '@/components/visits-radial-chart';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { encounters, low_stocks, visitsLast7Days, maxWeeklyVisits, triageUrgency } = usePage().props as any;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mt-4 grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <VisitsRadialChart totalVisits={visitsLast7Days} maxVisits={maxWeeklyVisits} />
                    </Card>

                    <Card className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PatientsTriageUrgency triageUrgency={triageUrgency} />
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                    </Card>

                    {/* 🚨 Low Stock Card (3rd position) */}
                    <Card className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <LowStockAlertCard lowStocks={low_stocks} />
                    </Card>
                </div>

                <Card className="min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PatientEncountersHeatmap medicalEncounters={encounters} />
                </Card>
            </div>
        </AppLayout>
    );
}
