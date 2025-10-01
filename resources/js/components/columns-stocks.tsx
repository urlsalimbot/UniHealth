import { Button } from '@/components/ui/button';
// import medications from '@/routes/medications';
import { Medication } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './datacolumnheader';

export const stockscolumns: ColumnDef<Medication>[] = [
    {
        accessorKey: 'medication.generic_name',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Generic Name" />;
        },
    },
    {
        accessorKey: 'medication.brand_names',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Brand Name" />;
        },
    },
    {
        accessorKey: 'medication.strength',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Strength" />;
        },
    },
    {
        accessorKey: 'medication.dosage_form',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Dosage Form" />;
        },
    },
    {
        accessorKey: 'current_stock',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Current Stock" />;
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
    // {
    //     header: 'Actions',
    //     id: 'actions',
    //     cell: ({ row }) => {
    //         const medication = row.original;

    //         return (
    //             <div className="w-fit space-x-2">
    //                 {/* <Button variant="default" className="p-2" onClick={() => router.get(medication.view.url(patient.patient_id))}>
    //                     View
    //                 </Button> */}
    //                 {/* <Button variant="outline" className="p-2" onClick={() => router.get(medications.edit.url(medication.medication_id))}>
    //                     Edit
    //                 </Button>
    //                 <Button variant="destructive" className="p-2" onClick={() => router.delete(medications.destroy.url(medication.medication_id))}>
    //                     Delete
    //                 </Button> */}
    //             </div>
    //         );
    //     },
    // },
];
