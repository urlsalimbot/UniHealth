import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface LaravelPaginatorMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    paginator: LaravelPaginatorMeta;
    filters?: Record<string, any>;
    label: string;
    field: string;
    baseUrl: string;
}

export function DataTable<TData, TValue>({ columns, data, paginator, filters = {}, label, field, baseUrl }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    });

    const navigate = (params: Record<string, any>) => {
        router.get(baseUrl, { ...filters, ...params }, { preserveState: true });
    };

    return (
        <div className="space-y-4">
            {/* Filter */}
            <div className="flex items-center py-2">
                <Input
                    placeholder={`Filter ${label ?? field}`}
                    value={filters[field] ?? ''}
                    onChange={(e) => navigate({ [field]: e.target.value })}
                    className="max-w-sm"
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => (
                                    <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {data.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    Page {paginator.current_page} of {paginator.last_page} — {paginator.total} records
                </div>

                <div className="flex items-center space-x-4">
                    <Select value={`${paginator.per_page}`} onValueChange={(v) => navigate({ per_page: Number(v), page: 1 })}>
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={paginator.per_page} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 25, 50].map((n) => (
                                <SelectItem key={n} value={`${n}`}>
                                    {n}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex items-center space-x-1">
                        <Button size="icon" variant="outline" disabled={paginator.current_page === 1} onClick={() => navigate({ page: 1 })}>
                            <ChevronsLeft />
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            disabled={paginator.current_page === 1}
                            onClick={() => navigate({ page: paginator.current_page - 1 })}
                        >
                            <ChevronLeft />
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            disabled={paginator.current_page === paginator.last_page}
                            onClick={() => navigate({ page: paginator.current_page + 1 })}
                        >
                            <ChevronRight />
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            disabled={paginator.current_page === paginator.last_page}
                            onClick={() => navigate({ page: paginator.last_page })}
                        >
                            <ChevronsRight />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
