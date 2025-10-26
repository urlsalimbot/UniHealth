import admin from '@/routes/admin';
import { User } from '@/types';
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
import { Button } from './ui/button';

export const usercolumns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Name" />;
        },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Email" />;
        },
    },
    {
        accessorKey: 'role',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Role" />;
        },
    },
    {
        header: () => <div className="text-right">Actions</div>,
        id: 'actions',
        cell: ({ row }) => {
            const user = row.original;

            return (
                <div className="flex justify-end gap-2">
                    {/* View Button */}
                    <Button variant="default" className="p-2" onClick={() => router.get(admin.users.show.url(user.id))}>
                        View
                    </Button>

                    
                </div>
            );
        },
    },
];
