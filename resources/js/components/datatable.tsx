import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, X } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

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
    onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    paginator,
    filters = {},
    label,
    field,
    baseUrl,
    onRowClick,
}: DataTableProps<TData, TValue>) {
    const [query, setQuery] = useState(filters[field] ?? '');
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const handleSearch = () => {
        navigate({ [field]: query, page: 1 }); // Reset to page 1 when searching
    };

    const handleReset = () => {
        setQuery('');
        navigate({ [field]: '', page: 1 });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

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
        // Build URL with existing filters plus new params
        const urlParams = new URLSearchParams(window.location.search);
        
        // Update or add new params
        Object.entries(params).forEach(([key, value]) => {
            if (value === '' || value === null || value === undefined) {
                urlParams.delete(key);
            } else {
                urlParams.set(key, value.toString());
            }
        });
        
        // Preserve existing filters that aren't being updated
        Object.entries(filters).forEach(([key, value]) => {
            if (!(key in params) && value !== '' && value !== null && value !== undefined) {
                urlParams.set(key, value.toString());
            }
        });
        
        const newUrl = `${baseUrl}?${urlParams.toString()}`;
        router.get(newUrl, {}, { preserveState: true, preserveScroll: true });
    };

    // Sync query state with URL parameters
    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const currentQuery = urlParams.get(field) || '';
        if (currentQuery !== query) {
            setQuery(currentQuery);
        }
    }, [field]);

    return (
        <div className="space-y-4">
            {/* Filter */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Input
                        placeholder={`Filter ${label ?? field}...`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pr-10"
                    />
                    {query && (
                        <button
                            onClick={handleReset}
                            className="absolute top-1/2 right-1 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <Button onClick={handleSearch} size="sm" className="gap-2">
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">Search</span>
                </Button>
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
                                <TableRow
                                    key={row.id}
                                    className={onRowClick ? 'cursor-pointer transition-colors hover:bg-muted/50' : ''}
                                    onClick={(e) => {
                                        if (!onRowClick) return;

                                        // ✅ Prevent clicks on interactive elements from triggering navigation
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
                    Showing {((paginator.current_page - 1) * paginator.per_page) + 1} to {Math.min(paginator.current_page * paginator.per_page, paginator.total)} of {paginator.total} records
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                        <Button 
                            size="icon" 
                            variant="outline" 
                            disabled={paginator.current_page === 1} 
                            onClick={() => navigate({ page: 1 })}
                            className="h-8 w-8"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            disabled={paginator.current_page === 1}
                            onClick={() => navigate({ page: paginator.current_page - 1 })}
                            className="h-8 w-8"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        
                        <div className="flex items-center justify-center text-sm font-medium min-w-[3rem]">
                            {paginator.current_page}
                        </div>
                        
                        <Button
                            size="icon"
                            variant="outline"
                            disabled={paginator.current_page === paginator.last_page}
                            onClick={() => navigate({ page: paginator.current_page + 1 })}
                            className="h-8 w-8"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            disabled={paginator.current_page === paginator.last_page}
                            onClick={() => navigate({ page: paginator.last_page })}
                            className="h-8 w-8"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
