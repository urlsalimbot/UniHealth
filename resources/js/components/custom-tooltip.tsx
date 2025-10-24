import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { TooltipProps } from 'recharts';

export const CustomVitalTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
        <Card className={cn('rounded-lg border border-primary/20 bg-background/90 p-2 shadow-lg backdrop-blur-md')}>
            <CardContent className="space-y-1 p-2">
                <div className="text-sm font-medium text-foreground/80">{new Date(label).toLocaleString()}</div>
                <Separator className="my-1" />
                {payload.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 text-sm">
                        <span className="flex items-center gap-2" style={{ color: item.color }}>
                            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                            {item.name}
                        </span>
                        <span className="font-semibold text-foreground">
                            {item.value}
                            {item.unit ? ` ${item.unit}` : ''}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
