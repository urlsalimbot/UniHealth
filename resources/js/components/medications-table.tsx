import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface MedicationsTableProps {
    medications: any[];
    search: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRowClick: (id: string) => void;
}

export default function MedicationsTable({ medications, search, onSearchChange, onRowClick }: MedicationsTableProps) {
    return (
        <div className="flex w-full flex-col gap-4">
            {/* 🔍 Search bar */}
            <Input placeholder="Search medications..." value={search} onChange={onSearchChange} className="w-full text-sm md:text-base" />

            {/* 💻 Desktop Table View */}
            <div className="hidden rounded-md border md:block">
                <ScrollArea className="h-[400px] rounded-md">
                    <Table className="w-full table-fixed text-sm">
                        <TableHeader>
                            <TableRow className="bg-muted/30 text-left">
                                <TableHead className="p-2 font-medium">Generic Name</TableHead>
                                <TableHead className="p-2 font-medium">Brand Names</TableHead>
                                <TableHead className="p-2 font-medium">Dosage Form</TableHead>
                                <TableHead className="p-2 font-medium">Strength</TableHead>
                                <TableHead className="p-2 font-medium">Drug Class</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {medications.length > 0 ? (
                                medications.map((row) => (
                                    <TableRow
                                        key={row.medication_id}
                                        className="cursor-pointer border-b transition-colors hover:bg-muted/50"
                                        onClick={() => onRowClick(row.medication_id)}
                                    >
                                        <TableCell className="p-2">{row.generic_name}</TableCell>
                                        <TableCell className="p-2">{row.brand_names || '—'}</TableCell>
                                        <TableCell className="p-2">{row.dosage_form || '—'}</TableCell>
                                        <TableCell className="p-2">{row.strength || '—'}</TableCell>
                                        <TableCell className="p-2">{row.drug_class || '—'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="p-4 text-center text-muted-foreground">
                                        No medications found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>

            {/* 📱 Mobile Card View */}
            <div className="flex flex-col gap-2 md:hidden">
                {medications.length > 0 ? (
                    medications.map((row) => (
                        <div
                            key={row.medication_id}
                            className="rounded-lg border bg-background p-3 shadow-sm transition active:bg-muted/50"
                            onClick={() => onRowClick(row.medication_id)}
                        >
                            <div className="text-base font-semibold">{row.generic_name}</div>
                            <div className="text-sm text-muted-foreground">{row.brand_names || '—'}</div>
                            <div className="mt-1 text-sm">
                                <span className="font-medium">Form:</span> {row.dosage_form || '—'}
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">Strength:</span> {row.strength || '—'}
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">Class:</span> {row.drug_class || '—'}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="py-6 text-center text-sm text-muted-foreground">No medications found.</p>
                )}
            </div>
        </div>
    );
}
    