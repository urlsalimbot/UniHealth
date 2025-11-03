import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import patients from '@/routes/patients';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

export default function ShowUser() {
    const { user } = usePage().props as any;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Users', href: admin.dashboard.url() },
        { title: user.name, href: admin.users.show.url(user.id) },
    ];

    const isPatient = user.role === 'patient';


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User: ${user.name}`} />

            <div className="mx-auto mt-6 max-w-3xl space-y-6">
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold">User Details</CardTitle>
                        <div className="space-x-2">
     {isPatient && <Button onClick={() => {router.visit(patients.show.url(user.patient_id))}}>
                        View Patient Record
                    </Button>}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">Delete</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. Are you sure you want to permanently delete{' '}
                                            <span className="font-semibold">{user.name}</span>?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-red-600 hover:bg-red-700"
                                            onClick={() => router.delete(admin.users.destroy.url(user))}
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Name</p>
                                <p className="text-base font-medium">{user.name}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="text-base font-medium">{user.email}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Role</p>
                                <span className="inline-flex rounded-full px-3 py-1 text-sm font-semibold">{user.role.replace('-', ' ')}</span>
                            </div>

                            {user.email_verified_at && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Email Verified At</p>
                                    <p className="text-base font-medium">{new Date(user.email_verified_at).toLocaleString()}</p>
                                </div>
                            )}

                            {user.patient && (
                                <div className="sm:col-span-2">
                                    <p className="text-sm text-muted-foreground">Linked Patient Record</p>
                                    <Button variant="outline" onClick={() => router.visit(`/patients/${user.patient.patient_id}`)}>
                                        View Patient #{user.patient.patient_id}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
