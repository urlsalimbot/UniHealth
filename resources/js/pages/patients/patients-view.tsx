import { patientcolumns } from '@/components/columns-patients';
import { DataTable } from '@/components/datatable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import patients from '@/routes/patients';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Users, 
    Plus, 
    Mail, 
    Search, 
    Filter, 
    Download,
    UserPlus,
    Activity,
    Calendar,
    Shield
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Patients',
        href: patients.index.url(),
    },
];

// ISO 80601 Healthcare Standards: Patient data management compliance
const PATIENT_STATUS_OPTIONS = [
    { value: 'active', label: 'Active', color: 'bg-green-500' },
    { value: 'inactive', label: 'Inactive', color: 'bg-gray-500' },
    { value: 'critical', label: 'Critical Care', color: 'bg-red-500' },
    { value: 'outpatient', label: 'Outpatient', color: 'bg-blue-500' },
];

const ADMISSION_TYPE_OPTIONS = [
    { value: 'emergency', label: 'Emergency' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'referral', label: 'Referral' },
];

export default function Patients() {
    const { patient, filters } = usePage().props as any;
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const handleAdvancedFilter = (filterType: string, value: string) => {
        const params = new URLSearchParams(window.location.search);
        if (value && value !== 'all') {
            params.set(filterType, value);
        } else {
            params.delete(filterType);
        }
        params.set('page', '1'); // Reset to first page
        router.get(`${patients.index.url()}?${params.toString()}`, {}, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patients Management" />
            <div className="flex h-[calc(100vh-8.5rem)] flex-1 flex-col gap-6 p-4 md:p-6">
                {/* --- Compact Header with Actions --- */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold">Patients Management</h1>
                            <p className="text-sm text-muted-foreground">
                                {patient?.total || 0} total patients
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    <span className="hidden sm:inline">New Patient</span>
                                    <span className="sm:hidden">Add</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Register New Patient</DialogTitle>
                                    <DialogDescription>
                                        Create a new patient record following ISO 80601 healthcare standards.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col gap-4 py-4">
                                    <Button 
                                        onClick={() => router.get(patients.create.url())}
                                        className="w-full"
                                    >
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Complete Registration
                                    </Button>
                                    <Separator />
                                    <p className="text-xs text-muted-foreground text-center">
                                        All patient data is encrypted and stored according to healthcare compliance standards.
                                    </p>
                                </div>
                            </DialogContent>
                        </Dialog>
{/* 
                        <Button 
                            onClick={() => router.post(patients.invite.url())}
                            size="sm"
                            className="gap-2"
                        >
                            <Mail className="h-4 w-4" />
                            <span className="hidden sm:inline">Invite Patient</span>
                            <span className="sm:hidden">Invite</span>
                        </Button>
 */}

                    </div>
                </div>

                {/* --- Advanced Filters (Optional) --- */}
                {/* <Card className="border-dashed">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                className="gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                Advanced Filters
                                <Badge variant="secondary" className="ml-2">
                                    {Object.keys(filters || {}).filter(key => key !== 'last_name' && filters[key]).length}
                                </Badge>
                            </Button>
                        </div>

                        {showAdvancedFilters && (
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Status</label>
                                    <Select 
                                        value={filters?.status || 'all'} 
                                        onValueChange={(value) => handleAdvancedFilter('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            {PATIENT_STATUS_OPTIONS.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-2 w-2 rounded-full ${option.color}`} />
                                                        {option.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Admission Type</label>
                                    <Select 
                                        value={filters?.admission_type || 'all'} 
                                        onValueChange={(value) => handleAdvancedFilter('admission_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            {ADMISSION_TYPE_OPTIONS.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Date Range</label>
                                    <Input 
                                        type="date" 
                                        value={filters?.date || ''}
                                        onChange={(e) => handleAdvancedFilter('date', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Department</label>
                                    <Select 
                                        value={filters?.department || 'all'} 
                                        onValueChange={(value) => handleAdvancedFilter('department', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All departments" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Departments</SelectItem>
                                            <SelectItem value="emergency">Emergency</SelectItem>
                                            <SelectItem value="icu">ICU</SelectItem>
                                            <SelectItem value="general">General Ward</SelectItem>
                                            <SelectItem value="pediatrics">Pediatrics</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card> */}

                {/* --- Main Data Table --- */}
                <Card className="flex-1 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-lg font-semibold">Patient Registry</CardTitle>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Last updated: {new Date().toLocaleDateString()}
                        </div>
                    </CardHeader>
                    
                    <CardContent className="p-8">
                        <div className="h-[calc(100vh-20rem)]">
                            <DataTable
                                data={patient?.data || []}
                                columns={patientcolumns}
                                paginator={{
                                    current_page: patient?.current_page || 1,
                                    last_page: patient?.last_page || 1,
                                    per_page: patient?.per_page || 10,
                                    total: patient?.total || 0,
                                }}
                                filters={filters}
                                label="patients"
                                field="last_name"
                                baseUrl={patients.index.url()}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* --- Mobile Stats Footer --- */}
                <div className="grid grid-cols-2 gap-4 lg:hidden">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100">
                                <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Total Patients</p>
                                <p className="text-lg font-bold">{patient?.total || 0}</p>
                            </div>
                        </div>
                    </Card>
                    
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-green-100">
                                <Activity className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Active Today</p>
                                <p className="text-lg font-bold">
                                    {patient?.data?.filter((p: any) => p.status === 'active').length || 0}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
