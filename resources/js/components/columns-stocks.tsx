import { Input } from '@/components/ui/input';
import { FacilityMedicationInventory } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './datacolumnheader';

type EditHandler = (id: string, field: keyof FacilityMedicationInventory, value: any) => void;

export const getEditableStocksColumns = (handleChange: EditHandler): ColumnDef<FacilityMedicationInventory>[] => [
    {
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Inventory ID" />;
        },
        accessorKey: 'inventory_id',
    },
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
            return <DataTableColumnHeader column={column} title="Current Stock" />;
        },
        accessorKey: 'current_stock',
        cell: ({ row }) => (
            <Input
                type="number"
                className="w-24"
                value={row.original.current_stock ?? ''}
                onChange={(e) => handleChange(row.original.inventory_id, 'current_stock', e.target.value)}
            />
        ),
    },
    {
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Minimum Stock Level" />;
        },
        accessorKey: 'minimum_stock_level',
    },
    {
        header: 'Expiration Date',
        accessorKey: 'expiration_date',
        cell: ({ row }) => (
            <Input
                type="date"
                className="w-40"
                value={row.original.expiration_date ?? ''}
                onChange={(e) => handleChange(row.original.inventory_id, 'expiration_date', e.target.value)}
            />
        ),
    },
];
