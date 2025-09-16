import { Button } from '@/components/ui/button';
import { Patient } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './datacolumnheader';
import patients from '@/routes/patients';

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
    // {
    //     accessorKey: 'amount',
    //     header: () => <div className="text-right">Amount</div>,
    //     cell: ({ row }) => {
    //         const amount = parseFloat(row.getValue('amount'));
    //         const formatted = new Intl.NumberFormat('en-US', {
    //             style: 'currency',
    //             currency: 'USD',
    //         }).format(amount);

    //         return <div className="text-right font-medium">{formatted}</div>;
    //     },
    // },
    {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => {
            const patient = row.original;

            return (
                <div className="w-fit space-x-2">
                    <Button variant="default" className="p-2" onClick={() => router.get(patients.single.url(patient.patient_id))}>
                        View
                    </Button>
                    <Button variant="outline" className="p-2" onClick={() => router.get(patients.edit.url(patient.patient_id))}>
                        Edit
                    </Button>
                    <Button variant="destructive" className="p-2" onClick={() => router.delete(patients.destroy.url(patient.patient_id))}>
                        Delete
                    </Button>
                </div>
            );
        },
    },
];
