import { patientcolumns } from '@/components/columns-patients';
import { DataTable } from '@/components/datatable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import patients from '@/routes/patients';
import { type BreadcrumbItem } from '@/types';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import { Activity, Plus, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Patients', href: patients.index.url() }];

type PageProps = InertiaPageProps & {
    totalpatients: number;
    patient: any;
    filters?: Record<string, string>;
    sorts?: string[];
};

export default function Patients() {
    const { totalpatients, patient, filters = {}, sorts = [] } = usePage<PageProps>().props;
    const [showNoResultsDialog, setShowNoResultsDialog] = useState(false);

    // Local state for form inputs
    const [formData, setFormData] = useState({
        first_name: filters.first_name || '',
        last_name: filters.last_name || '',
        email: filters.email || '',
        mobile_number: filters.mobile_number || '',
        date_of_birth: filters.date_of_birth || '',
        created_at_from: filters.created_at_from || '',
        created_at_to: filters.created_at_to || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (!patient?.data?.length) {
            setShowNoResultsDialog(true);
        }
    }, [patient]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Build query string manually for Spatie format
        const queryParams = new URLSearchParams();

        // Add filters only if they have values
        if (formData.first_name) queryParams.append('filter[first_name]', formData.first_name);
        if (formData.last_name) queryParams.append('filter[last_name]', formData.last_name);
        if (formData.email) queryParams.append('filter[email]', formData.email);
        if (formData.mobile_number) queryParams.append('filter[mobile_number]', formData.mobile_number);
        if (formData.date_of_birth) queryParams.append('filter[date_of_birth]', formData.date_of_birth);
        if (formData.created_at_from) queryParams.append('filter[created_at_from]', formData.created_at_from);
        if (formData.created_at_to) queryParams.append('filter[created_at_to]', formData.created_at_to);

        // Build the query string
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

        // Navigate with Inertia
        router.get(
            patients.index.url() + queryString,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleClearFilters = () => {
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            mobile_number: '',
            date_of_birth: '',
            created_at_from: '',
            created_at_to: '',
        });

        // Navigate to base URL without filters
        router.get(
            patients.index.url(),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Check if any filters are active
    const hasActiveFilters = Object.values(formData).some((value) => value !== '');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patients Management" />
            <Dialog open={showNoResultsDialog} onOpenChange={setShowNoResultsDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>No Patient Records Found</DialogTitle>
                        <DialogDescription>
                            We couldn’t find any patient matching your search. Would you like to register a new patient?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={() => setShowNoResultsDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => router.visit(patients.create.url())} className="bg-primary text-white">
                            Create New Patient
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Header */}
            <div className="flex h-fit flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold">Patients Management</h1>
                            <p className="text-sm text-muted-foreground">{totalpatients}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="p-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100">
                                        <Users className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Total Patients</p>
                                        <p className="text-lg font-bold">{totalpatients}</p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded bg-green-100">
                                        <Activity className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Active Today</p>
                                        <p className="text-lg font-bold">{patient?.data?.filter((p: any) => p.status === 'active').length || 0}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="default" size="sm" className="gap-2 p-8">
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">Intake Patient</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="min-h-[30rem] min-w-[50rem]">
                            <DialogHeader>
                                <DialogTitle>Search Database for Possible Past Record</DialogTitle>
                                <DialogDescription>Input partial patient record.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex flex-wrap items-end gap-2">
                                    <Input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        className="min-w-[150px] flex-1"
                                    />
                                    <Input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        placeholder="Last Name"
                                        className="min-w-[150px] flex-1"
                                    />
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                        className="min-w-[200px] flex-1"
                                    />
                                    <Input
                                        type="text"
                                        name="mobile_number"
                                        value={formData.mobile_number}
                                        onChange={handleChange}
                                        placeholder="Mobile Number"
                                        className="min-w-[150px] flex-1"
                                    />
                                    <Input
                                        type="date"
                                        name="date_of_birth"
                                        value={formData.date_of_birth}
                                        onChange={handleChange}
                                        className="min-w-[150px] flex-1"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit">Search</Button>
                                    {hasActiveFilters && (
                                        <Button type="button" variant="outline" onClick={handleClearFilters}>
                                            <X className="mr-2 h-4 w-4" />
                                            Clear
                                        </Button>
                                    )}
                                </div>

                                {/* Active Filters Display */}
                                {hasActiveFilters && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        <span className="text-sm text-muted-foreground">Active filters:</span>
                                        {Object.entries(formData).map(([key, value]) =>
                                            value ? (
                                                <span
                                                    key={key}
                                                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                                                >
                                                    {key.replace('_', ' ')}: {value}
                                                </span>
                                            ) : null,
                                        )}
                                    </div>
                                )}
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="max-h-fit flex-1 overflow-hidden">
                    <CardContent className="p-8">
                        <div className="h-fit">
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
                                sorts={sorts}
                                baseUrl={patients.index.url()}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
