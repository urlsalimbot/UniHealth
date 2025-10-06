import { Button } from '@/components/ui/button';
// import medications from '@/routes/medications';
import { Medication } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './datacolumnheader';

export const medicationscolumns: ColumnDef<Medication>[] = [
    {
        accessorKey: 'generic_name',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Generic Name" />;
        },
    },
    {
        accessorKey: 'brand_names',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Brand Name" />;
        },
    },
    {
        accessorKey: 'strength',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Strength" />;
        },
    },
    {
        accessorKey: 'dosage_form',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Dosage Form" />;
        },
    },
    {
        accessorKey: 'drug_class',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Drug Class" />;
        },
    },
];
