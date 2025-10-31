import { FacilityMedicationInventory } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './datacolumnheader';

type EditHandler = (id: string, field: keyof FacilityMedicationInventory, value: any) => void;

export const StocksColumns: ColumnDef<FacilityMedicationInventory>[] = [
    {
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Brand Name" />;
        },
        accessorKey: 'medication.brand_names',
    },
    {
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Generic Name" />;
        },
        accessorKey: 'medication.generic_name',
    },
    {
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Min Stock" />;
        },
        accessorKey: 'total_minimum_stock_level',
    },
    {
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Reorder Point" />;
        },
        accessorKey: 'total_reorder_point',
    },
    {
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Current Stock" />;
        },
        accessorKey: 'total_stock',
    },
];
