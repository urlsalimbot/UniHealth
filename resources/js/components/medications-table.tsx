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
        <div className="flex flex-col gap-4">
            {/* 🔍 Filter input */}
            <Input placeholder="Search medications..." value={search} onChange={onSearchChange} className="w-full" />

            {/* ✅ Fixed header table (non-scrollable) */}
            <div className="border-b">
                <Table className="w-full table-fixed text-sm">
                    <colgroup>
                        <col className="w-[20%]" />
                        <col className="w-[25%]" />
                        <col className="w-[20%]" />
                        <col className="w-[15%]" />
                        <col className="w-[20%]" />
                    </colgroup>
                    <TableHeader>
                        <TableRow className="bg-background text-left">
                            <TableHead className="p-2 font-medium">Generic Name</TableHead>
                            <TableHead className="p-2 font-medium">Brand Names</TableHead>
                            <TableHead className="p-2 font-medium">Dosage Form</TableHead>
                            <TableHead className="p-2 font-medium">Strength</TableHead>
                            <TableHead className="p-2 font-medium">Drug Class</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
            </div>

            {/* ✅ Scrollable body table (aligned via same colgroup) */}
            <ScrollArea className="h-[400px] rounded-md border">
                <Table className="w-full table-fixed text-sm">
                    <colgroup>
                        <col className="w-[20%]" />
                        <col className="w-[25%]" />
                        <col className="w-[20%]" />
                        <col className="w-[15%]" />
                        <col className="w-[20%]" />
                    </colgroup>
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
    );
}
