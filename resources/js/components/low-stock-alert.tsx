import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Package, TrendingDown, ExternalLink } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface LowStockItem {
    inventory_id: string;
    medication?: {
        generic_name?: string;
        brand_names?: string;
        strength?: string;
        dosage_form?: string;
    };
    current_stock: number;
    minimum_stock_level?: number;
    reorder_point?: number;
    maximum_stock_level?: number;
    medication_id: string;
    lot_number?: string;
    expiration_date?: string;
    facility?: {
        name?: string;
    };
}

interface LowStockAlertCardProps {
    lowStocks: LowStockItem[];
}

export default function LowStockAlertCard({ lowStocks }: LowStockAlertCardProps) {
    const [sortBy, setSortBy] = useState<'urgency' | 'name'>('urgency');

    if (!lowStocks?.length) {
        return (
            <>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                        <Package className="h-5 w-5" />
                        ✅ All stocks are sufficient
                    </CardTitle>
                </CardHeader>
            </>
        );
    }

    // Calculate urgency level and sort
    const processedStocks = lowStocks.map(item => {
        const stockPercentage = item.minimum_stock_level 
            ? (item.current_stock / item.minimum_stock_level) * 100 
            : 50; // Default to moderate if no minimum set
        
        let urgency: 'critical' | 'high' | 'moderate';
        let urgencyColor: string;
        
        if (stockPercentage <= 25) {
            urgency = 'critical';
            urgencyColor = 'destructive';
        } else if (stockPercentage <= 50) {
            urgency = 'high';
            urgencyColor = 'destructive';
        } else {
            urgency = 'moderate';
            urgencyColor = 'secondary';
        }

        return {
            ...item,
            urgency,
            urgencyColor,
            stockPercentage,
            daysUntilExpiry: item.expiration_date 
                ? Math.ceil((new Date(item.expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : null
        };
    }).sort((a, b) => {
        if (sortBy === 'urgency') {
            const urgencyOrder = { critical: 0, high: 1, moderate: 2 };
            return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        }
        return (a.medication?.generic_name || '').localeCompare(b.medication?.generic_name || '');
    });

    const getUrgencyBadge = (urgency: 'critical' | 'high' | 'moderate') => {
        const variants: Record<'critical' | 'high' | 'moderate', "default" | "secondary" | "destructive" | "outline"> = {
            critical: 'destructive',
            high: 'destructive', 
            moderate: 'secondary'
        };
        
        const labels = {
            critical: 'CRITICAL',
            high: 'HIGH',
            moderate: 'MODERATE'
        };

        return (
            <Badge variant={variants[urgency]}>
                {labels[urgency]}
            </Badge>
        );
    };

    const handleItemClick = (item: LowStockItem) => {
        router.get(`/inventory/medications/${item.medication_id}`);
    };

    const handleReorderClick = (e: React.MouseEvent, item: LowStockItem) => {
        e.stopPropagation();
        router.post('/inventory/reorder', {
            medication_id: item.medication_id,
            inventory_id: item.inventory_id
        });
    };

    return (
        <>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Low Stock Alerts ({lowStocks.length})
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSortBy(sortBy === 'urgency' ? 'name' : 'urgency')}
                        >
                            Sort by {sortBy === 'urgency' ? 'Name' : 'Urgency'}
                        </Button>
                        {/* <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.get('/inventory/low-stock')}
                        >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View All
                        </Button> */}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[300px]">
                    <Table className="w-full text-sm">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Medication</TableHead>
                                <TableHead>Stock Level</TableHead>
                                <TableHead>Reorder Point</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {processedStocks.map((item) => (
                                <TableRow
                                    key={item.inventory_id}
                                    className="cursor-pointer transition-colors hover:bg-muted/50"
                                    // onClick={() => handleItemClick(item)}
                                >
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="font-medium">
                                                {item.medication?.generic_name ?? '—'}
                                            </div>
                                            {item.medication?.strength && (
                                                <div className="text-xs text-muted-foreground">
                                                    {item.medication.strength} {item.medication.dosage_form}
                                                </div>
                                            )}
                                            {item.lot_number && (
                                                <div className="text-xs text-muted-foreground">
                                                    Lot: {item.lot_number}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className={`font-semibold ${
                                                item.current_stock < (item.minimum_stock_level ?? 0)
                                                    ? 'text-red-600'
                                                    : 'text-amber-600'
                                            }`}>
                                                {item.current_stock}
                                            </div>
                                            {item.maximum_stock_level && (
                                                <div className="text-xs text-muted-foreground">
                                                    of {item.maximum_stock_level} max
                                                </div>
                                            )}
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div 
                                                    className={`h-1.5 rounded-full ${
                                                        item.urgency === 'critical' ? 'bg-red-600' :
                                                        item.urgency === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                                                    }`}
                                                    style={{ width: `${Math.min(100, item.stockPercentage)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="font-medium">
                                                {item.reorder_point ?? '—'}
                                            </div>
                                            {item.minimum_stock_level && (
                                                <div className="text-xs text-muted-foreground">
                                                    Min: {item.minimum_stock_level}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            {getUrgencyBadge(item.urgency)}
                                            {item.daysUntilExpiry !== null && item.daysUntilExpiry <= 90 && (
                                                <div className="text-xs text-orange-600">
                                                    Expires in {item.daysUntilExpiry} days
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                   
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </>
    );
}
