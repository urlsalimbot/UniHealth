import { Button } from '@/components/ui/button';
import { Patient } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { route } from 'ziggy-js';
import { DataTableColumnHeader } from './datacolumnheader';

export const patientcolumns: ColumnDef<Patient>[] = [
    {
        accessorKey: 'last_name',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Email" />;
        },
    },
    {
        accessorKey: 'first_name',
        header: 'First Name',
    },
    {
        accessorKey: 'philhealth_id',
        header: 'Philhealth ID',
    },
    {
        accessorKey: 'amount',
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('amount'));
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(amount);

            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => {
            const patient = row.original;

            return (
                <div className="w-fit">
                    <Button variant="default" className="p-2" onClick={() => router.get(route('patients.single', patient.patient_id))}>
                        View
                    </Button>
                    <Button variant="outline" className="p-2" onClick={() => router.get(route('patients.edit', patient.patient_id))}>
                        Edit
                    </Button>
                    <Button variant="destructive" className="p-2" onClick={() => router.delete(route('patients.destroy', patient.patient_id))}>
                        Delete
                    </Button>
                </div>
            );
        },
    },
];
