import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle, Users, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState, useMemo } from 'react';

type Props = {
    triageUrgency: Record<string, number>;
};

const URGENCY_CONFIG = {
    'Critical': { 
        color: '#dc2626', 
        icon: '🚨', 
        description: 'Immediate attention required',
        priority: 1
    },
    'High': { 
        color: '#f97316', 
        icon: '⚡', 
        description: 'Urgent attention needed',
        priority: 2
    },
    'Moderate': { 
        color: '#facc15', 
        icon: '⏰', 
        description: 'Prompt attention needed',
        priority: 3
    },
    'Low': { 
        color: '#22c55e', 
        icon: '✅', 
        description: 'Routine attention',
        priority: 4
    }
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        const config = URGENCY_CONFIG[data.name as keyof typeof URGENCY_CONFIG];
        
        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{config.icon}</span>
                    <span className="font-semibold">{data.name}</span>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                    {config.description}
                </div>
                <div className="text-lg font-bold" style={{ color: config.color }}>
                    {data.value} patients
                </div>
            </div>
        );
    }
    return null;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (value === 0) return null;

    return (
        <text 
            x={x} 
            y={y} 
            fill="white" 
            textAnchor={x > cx ? 'start' : 'end'} 
            dominantBaseline="central"
            className="font-semibold text-sm"
        >
            {value}
        </text>
    );
};

export default function PatientsTriageUrgency({ triageUrgency }: Props) {
    const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

    // Process and sort data by priority
    const data = useMemo(() => {
        return Object.entries(triageUrgency)
            .filter(([_, value]) => value > 0) // Filter out zero values
            .map(([level, total]) => ({
                name: level,
                value: total,
                config: URGENCY_CONFIG[level as keyof typeof URGENCY_CONFIG]
            }))
            .sort((a, b) => a.config.priority - b.config.priority);
    }, [triageUrgency]);

    // Calculate statistics
    const totalPatients = useMemo(() => {
        return Object.values(triageUrgency).reduce((sum, count) => sum + count, 0);
    }, [triageUrgency]);

    const criticalPatients = useMemo(() => {
        return triageUrgency['Critical'] || 0;
    }, [triageUrgency]);

    const highPriorityPatients = useMemo(() => {
        return (triageUrgency['Critical'] || 0) + (triageUrgency['High'] || 0);
    }, [triageUrgency]);

    const handleSegmentClick = (data: any) => {
        setSelectedSegment(data.name === selectedSegment ? null : data.name);
    };

    const getUrgencyBadge = (level: string) => {
        const config = URGENCY_CONFIG[level as keyof typeof URGENCY_CONFIG];
        const variant = level === 'Critical' ? 'destructive' : 
                       level === 'High' ? 'default' : 
                       level === 'Moderate' ? 'secondary' : 'outline';
        
        return (
            <Badge variant={variant} className="text-xs">
                {config.icon} {level}
            </Badge>
        );
    };

    if (totalPatients === 0) {
        return (
            <>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        Patients Triage Urgency
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex h-[250px] items-center justify-center">
                    <div className="text-center text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No patients in triage</p>
                    </div>
                </CardContent>
            </>
        );
    }

    return (
        <>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        Patients Triage Urgency
                    </div>
                    <div className="flex items-center gap-2">
                        {criticalPatients > 0 && (
                            <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {criticalPatients} Critical
                            </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                            {totalPatients} Total
                        </Badge>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Statistics Summary */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-red-50 rounded-lg border border-red-100">
                        <div className="text-lg font-bold text-red-600">{criticalPatients}</div>
                        <div className="text-xs text-red-600">Critical</div>
                    </div>
                    <div className="p-2 bg-orange-50 rounded-lg border border-orange-100">
                        <div className="text-lg font-bold text-orange-600">{highPriorityPatients}</div>
                        <div className="text-xs text-orange-600">High Priority</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="text-lg font-bold text-blue-600">{totalPatients}</div>
                        <div className="text-xs text-blue-600">Total Patients</div>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={data} 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={60} 
                                outerRadius={100} 
                                dataKey="value" 
                                paddingAngle={2}
                                label={CustomLabel}
                                onClick={handleSegmentClick}
                                className="cursor-pointer"
                            >
                                {data.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.config.color}
                                        stroke={selectedSegment === entry.name ? '#1f2937' : 'none'}
                                        strokeWidth={selectedSegment === entry.name ? 2 : 0}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                                verticalAlign="bottom" 
                                height={80}
                                formatter={(value: string) => (
                                    <span className="text-sm">{value}</span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Detailed Breakdown */}
                {selectedSegment && (
                    <div className="p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {getUrgencyBadge(selectedSegment)}
                                <span className="font-semibold">
                                    {triageUrgency[selectedSegment as keyof typeof triageUrgency]} patients
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">
                            {URGENCY_CONFIG[selectedSegment as keyof typeof URGENCY_CONFIG].description}
                        </p>
                        <div className="mt-2 text-xs text-gray-500">
                            {((triageUrgency[selectedSegment as keyof typeof triageUrgency] / totalPatients) * 100).toFixed(1)}% of total patients
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2 pt-2">
                    <button 
                        className="flex-1 text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100 transition-colors"
                        onClick={() => setSelectedSegment('Critical')}
                    >
                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                        Focus Critical
                    </button>
                    <button 
                        className="flex-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                        onClick={() => setSelectedSegment(null)}
                    >
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                        View All
                    </button>
                </div>
            </CardContent>
        </>
    );
}
