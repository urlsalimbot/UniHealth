import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import patients from '@/routes/patients';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Folder, MoreHorizontal, Trash } from 'lucide-react';

// Define your Patient type
export type Patient = {
    patient_id: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: string;
    date_of_birth: string;
    created_at: string;
    updated_at: string;
};

export const patientcolumns: ColumnDef<Patient>[] = [
    {
        accessorKey: 'first_name',
        header: 'First Name',
    },
    {
        accessorKey: 'last_name',
        header: 'Last Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'mobile_number',
        header: 'Mobile Number',
    },
    {
        accessorKey: 'date_of_birth',
        header: 'Date of Birth',
        cell: ({ row }) => {
            const date = row.getValue('date_of_birth') as string;
            if (!date) return '-';
            return new Date(date).toLocaleDateString();
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Registered',
        cell: ({ row }) => {
            const date = row.getValue('created_at') as string;
            return new Date(date).toLocaleDateString();
        },
    },
    {
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => {
            const patient = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(patient.patient_id)}>Copy patient ID</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.get(patients.show(patient.patient_id))}>
                            <Folder className="mr-2 h-4 w-4" />
                            Edit patient
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete patient
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
