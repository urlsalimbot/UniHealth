import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Info } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface VisitsRadialChartProps {
    totalVisits: number;
    maxVisits: number;
    isLoading?: boolean;
    error?: string | null;
    period?: string;
    showTooltip?: boolean;
    animated?: boolean;
}

export default function VisitsRadialChart({ 
    totalVisits, 
    maxVisits, 
    isLoading = false, 
    error = null, 
    period = 'Last 7 Days',
    showTooltip = true,
    animated = true
}: VisitsRadialChartProps) {
    const [isHovered, setIsHovered] = useState(false);
    // Handle edge cases
    if (error) {
        return (
            <>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Visits ({period})
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[250px]">
                    <div className="text-center text-destructive">
                        <p className="text-sm font-medium">Error loading data</p>
                        <p className="text-xs text-muted-foreground">{error}</p>
                    </div>
                </CardContent>
            </>
        );
    }

    if (isLoading) {
        return (
            <>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Visits ({period})
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[250px]">
                    <div className="text-center text-muted-foreground">
                        <p className="text-sm">Loading...</p>
                    </div>
                </CardContent>
            </>
        );
    }

    // Validate inputs
    const validTotalVisits = Math.max(0, Number(totalVisits) || 0);
    const validMaxVisits = Math.max(1, Number(maxVisits) || 1);
    const percentage = Math.min(Math.round((validTotalVisits / validMaxVisits) * 100), 100);

    // Dynamic color based on percentage with enhanced palette
    const getChartColor = () => {
        if (percentage >= 80) return '#10b981'; // emerald-500
        if (percentage >= 60) return '#06b6d4'; // cyan-500
        if (percentage >= 40) return '#f59e0b'; // amber-500
        return '#ef4444'; // red-500
    };

    const getBackgroundGradient = () => {
        if (percentage >= 80) return 'from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20';
        if (percentage >= 60) return 'from-cyan-50 to-cyan-100 dark:from-cyan-950/20 dark:to-cyan-900/20';
        if (percentage >= 40) return 'from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20';
        return 'from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20';
    };

    const chartColor = getChartColor();

    const data = [
        {
            name: 'Visits',
            value: validTotalVisits,
            fill: chartColor,
        },
    ];

    return (
        <div 
            className={cn(
                'relative h-full transition-all duration-300',
                isHovered && 'transform scale-[1.02]'
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Visits ({period})
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm font-normal text-muted-foreground">
                            <TrendingUp className="h-4 w-4" />
                            {percentage}%
                        </div>
                        {showTooltip && (
                            <div className="group relative">
                                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                                <div className="absolute right-0 top-6 z-50 hidden w-48 rounded-lg border bg-popover p-2 text-xs text-popover-foreground shadow-md group-hover:block">
                                    <p className="font-medium">Visit Performance</p>
                                    <p className="text-muted-foreground">
                                        {percentage >= 80 ? 'Excellent performance' :
                                         percentage >= 60 ? 'Good performance' :
                                         percentage >= 40 ? 'Moderate performance' :
                                         'Low performance - needs attention'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className={cn(
                'relative flex h-[250px] items-center justify-center',
                getBackgroundGradient()
            )}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                        cx="50%" 
                        cy="50%" 
                        innerRadius="60%" 
                        outerRadius="100%" 
                        barSize={16} 
                        startAngle={90} 
                        endAngle={-270} 
                        data={data}
                    >
                        <PolarAngleAxis 
                            type="number" 
                            domain={[0, validMaxVisits]} 
                            tick={false} 
                        />
                        <RadialBar 
                            dataKey="value" 
                            cornerRadius={10} 
                            background={{ 
                                fill: '#f1f5f9',
                                opacity: 0.3
                            }}
                            fill={chartColor}
                            animationBegin={animated ? 0 : undefined}
                            animationDuration={animated ? 1500 : 0}
                            animationEasing="ease-out"
                        />
                    </RadialBarChart>
                </ResponsiveContainer>

                <div className="absolute text-center">
                    <p 
                        className={cn(
                            'text-4xl font-bold transition-all duration-300',
                            isHovered && 'scale-110'
                        )}
                        style={{ color: chartColor }}
                    >
                        {validTotalVisits.toLocaleString()}
                    </p>
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-sm text-muted-foreground">
                            {percentage}% of max ({validMaxVisits.toLocaleString()})
                        </p>
                        <div className="flex items-center gap-1">
                            {percentage >= 80 && (
                                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                    <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                                    Excellent
                                </span>
                            )}
                            {percentage >= 60 && percentage < 80 && (
                                <span className="flex items-center gap-1 text-xs text-cyan-600 font-medium">
                                    <span className="w-2 h-2 bg-cyan-600 rounded-full"></span>
                                    Good
                                </span>
                            )}
                            {percentage >= 40 && percentage < 60 && (
                                <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                                    <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                                    Moderate
                                </span>
                            )}
                            {percentage < 40 && (
                                <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
                                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                                    Low
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </div>
    );
}
