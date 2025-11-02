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
        header: ({ column }) => <DataTableColumnHeader column={column} title="Min Stock" className="text-right" />,
        accessorKey: 'total_minimum_stock_level',
        cell: ({ row }) => {
            const value = row.getValue<number>('total_minimum_stock_level');
            return (
                <div className="text-right">
                    {value != null && !isNaN(value) ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(value) : '—'}
                </div>
            );
        },
    },
    {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Reorder Point" className="text-right" />,
        accessorKey: 'total_reorder_point',
        cell: ({ row }) => {
            const value = row.getValue<number>('total_reorder_point');
            return (
                <div className="text-right">
                    {value != null && !isNaN(value) ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(value) : '—'}
                </div>
            );
        },
    },
    {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Current Stock" className="text-right" />,
        accessorKey: 'total_stock',
        cell: ({ row }) => {
            const value = row.getValue<number>('total_stock');
            return (
                <div className="text-right">
                    {value != null && !isNaN(value) ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(value) : '—'}
                </div>
            );
        },
    },
];
