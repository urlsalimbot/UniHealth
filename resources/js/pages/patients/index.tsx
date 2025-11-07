import { patientcolumns } from '@/components/columns-patients';
import { DataTable } from '@/components/datatable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import patients from '@/routes/patients';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Activity, Calendar, Plus, UserPlus, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Patients', href: patients.index.url() }];

export default function Patients() {
    const { patient, filters = {} } = usePage().props as {
        patient: any;
        filters?: Record<string, string>;
    };

    // Initialize form data properly for Spatie QueryBuilder (filter[..] syntax)
    const { data, setData, get } = useForm({
        'filter[first_name]': filters.first_name || '',
        'filter[last_name]': filters.last_name || '',
        'filter[email]': filters.email || '',
        'filter[mobile_number]': filters.mobile_number || '',
        'filter[date_of_birth]': filters.date_of_birth || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        get(patients.index.url(), { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patients Management" />

            <div className="flex h-[calc(100vh-8.5rem)] flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold">Patients Management</h1>
                            <p className="text-sm text-muted-foreground">{patient?.total || 0} total patients</p>
                        </div>
                    </div>

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
                                <DialogDescription>Create a new patient record.</DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-4 py-4">
                                <Button onClick={() => router.get(patients.create.url())} className="w-full">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Complete Registration
                                </Button>
                                <Separator />
                                <p className="text-center text-xs text-muted-foreground">
                                    All patient data is encrypted and stored according to healthcare compliance standards.
                                </p>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* --- Filter Form --- */}
                <Card className="flex-1 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-lg font-semibold">Patient Registry</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                        </div>
                    </CardHeader>

                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
                            <Input
                                type="text"
                                name="filter[first_name]"
                                value={data['filter[first_name]']}
                                onChange={handleChange}
                                placeholder="First Name"
                            />
                            <Input
                                type="text"
                                name="filter[last_name]"
                                value={data['filter[last_name]']}
                                onChange={handleChange}
                                placeholder="Last Name"
                            />
                            <Input type="email" name="filter[email]" value={data['filter[email]']} onChange={handleChange} placeholder="Email" />
                            <Input
                                type="text"
                                name="filter[mobile_number]"
                                value={data['filter[mobile_number]']}
                                onChange={handleChange}
                                placeholder="Mobile Number"
                            />
                            <Input type="date" name="filter[date_of_birth]" value={data['filter[date_of_birth]']} onChange={handleChange} />
                            <Button type="submit">Search</Button>
                        </form>

                        <div className="mt-4 h-[calc(100vh-20rem)]">
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

                {/* Mobile footer */}
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
                                <p className="text-lg font-bold">{patient?.data?.filter((p: any) => p.status === 'active').length || 0}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
