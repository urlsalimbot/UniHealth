import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface LowStockItem {
    medication_id: string;
    inventory_id?: string;
    current_stock: number;
    reorder_point: number;
    minimum_stock_level?: number;
    medication?: {
        generic_name?: string;
    };
}

interface LowStockAlertsProps {
    lowStockItems: LowStockItem[];
    onItemClick?: (medicationId: string) => void;
}

export default function InventoryLowStockAlerts({ lowStockItems, onItemClick }: LowStockAlertsProps) {
    if (!lowStockItems?.length) return null;

    const handleClick = (id: string) => {
        if (onItemClick) onItemClick(id);
    };

    return (
        <Card className="mt-4 border-red-300 bg-red-50 dark:bg-red-950/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">⚠️ Low Stock Alerts ({lowStockItems.length})</CardTitle>
            </CardHeader>

            <CardContent>
                <ScrollArea className="max-h-64">
                    <Table className="w-full text-sm">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/2">Medication</TableHead>
                                <TableHead className="w-1/4 text-right">Current Stock</TableHead>
                                <TableHead className="w-1/4 text-right">Reorder Point</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {lowStockItems.map((item, index) => {
                                // ✅ Fallback for missing inventory_id
                                const key = item.inventory_id || `${item.medication_id}-${index}`;

                                return (
                                    <TableRow
                                        key={key}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleClick(item.inventory_id ?? item.medication_id)}
                                    >
                                        <TableCell>{item.medication?.generic_name ?? '—'}</TableCell>
                                        <TableCell
                                            className={`text-right ${
                                                item.current_stock < (item.minimum_stock_level ?? item.reorder_point)
                                                    ? 'font-semibold text-red-600'
                                                    : 'font-medium text-amber-600'
                                            }`}
                                        >
                                            {item.current_stock}
                                        </TableCell>
                                        <TableCell className="text-right">{item.reorder_point}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
