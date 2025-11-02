import LowStockAlertCard from '@/components/low-stock-alert';
import PatientsTriageUrgency from '@/components/patients-triage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PatientEncountersHeatmap from '@/components/visits-heatmap';
import VisitsRadialChart from '@/components/visits-radial-chart';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { 
    Users, 
    Activity, 
    Pill, 
    FileText, 
    Stethoscope, 
    TrendingUp, 
    TrendingDown,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for type safety
interface DashboardStats {
    total: number;
    new_this_month?: number;
    low_stock?: number;
    active?: number;
    doctors?: number;
    nurses?: number;
}

interface DashboardProps {
    encounters?: any[];
    lowStocks?: any[];
    visitsLast7Days?: { total: number };
    maxWeeklyVisits?: number;
    triageUrgency?: any;
    patientStats?: DashboardStats;
    medicationStats?: DashboardStats;
    prescriptionStats?: DashboardStats;
    staffStats?: DashboardStats;
    expiringSoon?: any[];
    isLoading?: boolean;
    error?: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { 
        encounters, 
        lowStocks, 
        visitsLast7Days, 
        maxWeeklyVisits, 
        triageUrgency,
        patientStats,
        medicationStats,
        prescriptionStats,
        staffStats,
        expiringSoon,
        isLoading = false,
        error = null
    } = usePage().props as DashboardProps;

    // Loading state
    if (isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard - Loading" />
                <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-4">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </AppLayout>
        );
    }

    // Error state
    if (error) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard - Error" />
                <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-4">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                    <div className="text-center">
                        <p className="font-medium text-destructive">Error loading dashboard</p>
                        <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="UniHealth Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here's an overview of your healthcare facility.
                    </p>
                </div>

                {/* Main Charts Row */}
                <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                    <Card className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border hover:shadow-lg transition-shadow duration-200">
                        <VisitsRadialChart 
                            totalVisits={visitsLast7Days?.total || 0} 
                            maxVisits={maxWeeklyVisits || 100}
                            isLoading={isLoading}
                            error={error}
                        />
                    </Card>

                    <Card className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border hover:shadow-lg transition-shadow duration-200">
                        <PatientsTriageUrgency triageUrgency={triageUrgency} />
                    </Card>

                    <Card className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border hover:shadow-lg transition-shadow duration-200">
                        <LowStockAlertCard lowStocks={lowStocks || []} />
                    </Card>
                </div>

                {/* Statistics Cards Row */}
                <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
                    <StatsCard
                        title="Patients"
                        value={patientStats?.total || 0}
                        subtitle={`${patientStats?.new_this_month || 0} new this month`}
                        icon={Users}
                        color="blue"
                        trend={patientStats?.new_this_month ? 'up' : undefined}
                    />

                    <StatsCard
                        title="Medications"
                        value={medicationStats?.total || 0}
                        subtitle={`${medicationStats?.low_stock || 0} low stock`}
                        icon={Pill}
                        color="green"
                        trend={medicationStats?.low_stock && medicationStats.low_stock > 0 ? 'down' : 'up'}
                    />

                    <StatsCard
                        title="Prescriptions"
                        value={prescriptionStats?.total || 0}
                        subtitle={`${prescriptionStats?.active || 0} active`}
                        icon={FileText}
                        color="purple"
                        trend="up"
                    />

                    <StatsCard
                        title="Staff"
                        value={staffStats?.total || 0}
                        subtitle={`${staffStats?.doctors || 0} doctors, ${staffStats?.nurses || 0} nurses`}
                        icon={Stethoscope}
                        color="orange"
                        trend="up"
                    />
                </div>

                {/* Heatmap Section */}
                <div className="flex-1">
                    <Card className="h-full min-h-[400px] overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border hover:shadow-lg transition-shadow duration-200">
                        <PatientEncountersHeatmap medicalEncounters={encounters || []} />
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

// Stats Card Component
interface StatsCardProps {
    title: string;
    value: number;
    subtitle: string;
    icon: React.ElementType;
    color: 'blue' | 'green' | 'purple' | 'orange';
    trend?: 'up' | 'down';
}

function StatsCard({ title, value, subtitle, icon: Icon, color, trend }: StatsCardProps) {
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20',
        green: 'text-green-600 bg-green-50 dark:bg-green-950/20',
        purple: 'text-purple-600 bg-purple-50 dark:bg-purple-950/20',
        orange: 'text-orange-600 bg-orange-50 dark:bg-orange-950/20',
    };

    return (
        <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                    <p className="text-3xl font-bold">{value.toLocaleString()}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                        {trend && (
                            trend === 'up' ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                            )
                        )}
                    </div>
                </div>
                <div className={cn('p-3 rounded-lg', colorClasses[color])}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </Card>
    );
}
