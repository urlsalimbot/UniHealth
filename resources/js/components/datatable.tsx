import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';

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
    sorts?: string[]; // e.g., ['name', '-created_at']
    baseUrl: string;
    onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    paginator,
    filters = {},
    sorts = [],
    baseUrl,
    onRowClick,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        pageCount: paginator.last_page,
    });

    // Navigate with manual query string building
    const navigate = (updates: { page?: number; sort?: string }) => {
        const queryParams = new URLSearchParams();

        // Preserve existing filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                queryParams.append(`filter[${key}]`, value.toString());
            }
        });

        // Handle pagination
        const targetPage = updates.page || paginator.current_page;
        if (targetPage > 1) {
            queryParams.append('page', targetPage.toString());
        }

        // Handle sorting
        if (updates.sort !== undefined) {
            // If clicking the same column, toggle direction
            const currentSort = sorts.find(s => s.replace('-', '') === updates.sort?.replace('-', ''));
            
            if (updates.sort === '') {
                // Clear sort - don't add to query
            } else if (currentSort) {
                if (currentSort.startsWith('-')) {
                    // Currently desc, remove sort (don't add to query)
                } else {
                    // Currently asc, change to desc
                    queryParams.append('sort', `-${updates.sort}`);
                }
            } else {
                // New sort, default to asc
                queryParams.append('sort', updates.sort);
            }
        } else {
            // Preserve existing sorts
            if (sorts.length > 0) {
                queryParams.append('sort', sorts.join(','));
            }
        }

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        router.get(
            baseUrl + queryString,
            {},
            { preserveState: true, preserveScroll: true }
        );
    };

    // Helper to get sort state for a column
    const getSortState = (columnId: string): 'asc' | 'desc' | null => {
        const sort = sorts.find(s => s.replace('-', '') === columnId);
        if (!sort) return null;
        return sort.startsWith('-') ? 'desc' : 'asc';
    };

    // Create sorting handler that can be passed to column headers
    const handleSort = (columnId: string) => {
        navigate({ sort: columnId });
    };

    // Make columns sortable
    const enhancedColumns = columns.map(column => {
        // Check if column has custom header function
        if (typeof column.header === 'function') {
            // Return column as-is, but add sort helpers to the context
            return {
                ...column,
                header: (props: any) => {
                    const sortKey = (column as any).id || (column as any).accessorKey;
                    const sortState = getSortState(sortKey);
                    
                    // Call original header with enhanced props
                    return (column.header as Function)({
                        ...props,
                        sortState,
                        onSort: () => handleSort(sortKey),
                    });
                },
            };
        }
        
        // For simple string headers or no custom sorting
        return {
            ...column,
            header: ({ column: col }: any) => {
                const originalHeader = column.header;
                const sortKey = (column as any).id || (column as any).accessorKey;
                
                if (!sortKey || (column as any).enableSorting === false) {
                    return originalHeader;
                }

                const sortState = getSortState(sortKey);

                return (
                    <button
                        onClick={() => handleSort(sortKey)}
                        className="flex items-center gap-2 hover:text-foreground transition-colors"
                    >
                        {originalHeader}
                        {sortState === 'asc' && <ArrowUp className="h-4 w-4" />}
                        {sortState === 'desc' && <ArrowDown className="h-4 w-4" />}
                        {sortState === null && <ArrowUpDown className="h-4 w-4 opacity-50" />}
                    </button>
                );
            },
        };
    });

    const enhancedTable = useReactTable({
        data,
        columns: enhancedColumns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        pageCount: paginator.last_page,
    });

    return (
        <div className="space-y-4">
            {/* Table */}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {enhancedTable.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {data.length ? (
                            enhancedTable.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className={onRowClick ? 'cursor-pointer transition-colors hover:bg-muted/50' : ''}
                                    onClick={(e) => {
                                        if (!onRowClick) return;

                                        // Prevent clicks on interactive elements from triggering navigation
                                        const target = e.target as HTMLElement;
                                        if (
                                            target.tagName === 'INPUT' ||
                                            target.tagName === 'BUTTON' ||
                                            target.closest('button') ||
                                            target.closest('a')
                                        ) {
                                            return;
                                        }

                                        onRowClick(row.original);
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    Showing {((paginator.current_page - 1) * paginator.per_page) + 1} to{' '}
                    {Math.min(paginator.current_page * paginator.per_page, paginator.total)} of {paginator.total} records
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                        <Button
                            size="icon"
                            variant="outline"
                            disabled={paginator.current_page === 1}
                            onClick={() => navigate({ page: 1 })}
                            className="h-8 w-8"
                            title="First page"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            disabled={paginator.current_page === 1}
                            onClick={() => navigate({ page: paginator.current_page - 1 })}
                            className="h-8 w-8"
                            title="Previous page"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center justify-center text-sm font-medium min-w-[5rem] px-2">
                            Page {paginator.current_page} of {paginator.last_page}
                        </div>

                        <Button
                            size="icon"
                            variant="outline"
                            disabled={paginator.current_page === paginator.last_page}
                            onClick={() => navigate({ page: paginator.current_page + 1 })}
                            className="h-8 w-8"
                            title="Next page"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            disabled={paginator.current_page === paginator.last_page}
                            onClick={() => navigate({ page: paginator.last_page })}
                            className="h-8 w-8"
                            title="Last page"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}