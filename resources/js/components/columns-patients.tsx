import { Button } from '@/components/ui/button';
import patients from '@/routes/patients';
import { Patient } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './datacolumnheader';
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
} from './ui/alert-dialog';

export const patientcolumns: ColumnDef<Patient>[] = [
    {
        accessorKey: 'last_name',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Last Name" />;
        },
    },
    {
        accessorKey: 'first_name',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="First Name" />;
        },
    },
    {
        accessorKey: 'philhealth_id',
          header: ({ column }) => {
              return <DataTableColumnHeader column={column} title="PhilHealth ID" />;
          },
    },
    {
        accessorKey: 'pwd_id',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="PWD ID" />;
        },
    },
    {
        accessorKey: 'senior_citizen_id',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Senior Citizen ID" />;
        },
    },
    {
        header: () => <div className="text-right">Actions</div>,
        id: 'actions',
        cell: ({ row }) => {
            const patient = row.original;

            return (
                <div className="flex justify-end gap-2">
                    {/* View Button */}
                    <Button variant="default" className="p-2" onClick={() => router.get(patients.show.url(patient.patient_id))}>
                        View
                    </Button>

                    {/* Delete Alert Dialog */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="p-2">
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Patient</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. Are you sure you want to permanently delete{' '}
                                    <span className="font-semibold">
                                        {patient.last_name}, {patient.first_name}
                                    </span>
                                    ?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => router.delete(patients.destroy.url(patient.patient_id))}
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            );
        },
    },
];
