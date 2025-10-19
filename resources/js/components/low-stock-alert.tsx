import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import inventory from '@/routes/inventory';
import { router } from '@inertiajs/react';

interface LowStockItem {
    inventory_id: string;
    medication?: {
        generic_name?: string;
    };
    current_stock: number;
    minimum_stock_level?: number;
    reorder_point?: number;
    medication_id: string;
}

interface LowStockAlertCardProps {
    lowStocks: LowStockItem[];
}

export default function LowStockAlertCard({ lowStocks }: LowStockAlertCardProps) {
    if (!lowStocks?.length) {
        return (
            <>
                <CardHeader>
                    <CardTitle className="text-green-700">✅ All stocks are sufficient</CardTitle>
                </CardHeader>
            </>
        );
    }

    return (
        <>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">⚠️ Low Stock Alerts ({lowStocks.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[250px]">
                    <Table className="w-full text-sm">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Medication</TableHead>
                                <TableHead>Current</TableHead>
                                <TableHead>Reorder Pt.</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lowStocks.map((item) => (
                                <TableRow
                                    key={item.inventory_id}
                                    className="cursor-pointer transition-colors hover:bg-muted/50"
                                    onClick={() => router.get(inventory.item.show(item.medication_id))}
                                >
                                    <TableCell>{item.medication?.generic_name ?? '—'}</TableCell>
                                    <TableCell
                                        className={
                                            item.current_stock < (item.minimum_stock_level ?? 0)
                                                ? 'font-semibold text-red-600'
                                                : 'font-medium text-amber-600'
                                        }
                                    >
                                        {item.current_stock}
                                    </TableCell>
                                    <TableCell>{item.reorder_point ?? '—'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </>
    );
}
