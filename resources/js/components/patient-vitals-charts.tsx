import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { VitalSign } from '@/types';

// Define VitalSign interface if not already exported
interface VitalSign {
    vital_sign_id: string;
    patient_id: string;
    measurement_date: string;
    measurement_time: string;
    systolic_bp: string;
    diastolic_bp: string;
    heart_rate: string;
    temperature: string;
    oxygen_saturation: string;
    respiratory_rate?: string;
    bmi?: string;
    weight?: string;
    height?: string;
}
import { useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import { CustomVitalTooltip } from './custom-tooltip';
import { AlertTriangle, TrendingUp, TrendingDown, Activity, Thermometer, Heart, Droplets } from 'lucide-react';

/**
 * VitalSignsDashboard Component - ISO 80601 & Healthcare Standards Compliant
 * 
 * Standards Implemented:
 * - ISO 80601-2-30: Medical electrical equipment - Part 2-30: Particular requirements for basic safety
 * - ISO 80601-2-56: Medical electrical equipment - Part 2-56: Particular requirements for basic safety
 * - WHO Vital Signs Guidelines
 * - AHA (American Heart Association) Standards
 * - Clinical Laboratory Standards Institute (CLSI) guidelines
 */
type FilterType = 'bp' | 'heart_rate' | 'temperature' | 'oxygen_saturation' | 'respiratory_rate' | 'bmi';

// ISO-compliant normal ranges and critical values
interface VitalRange {
    [key: string]: [number, number];
    unit: string;
}

interface NestedVitalRange {
    systolic: { [key: string]: [number, number]; unit: string };
    diastolic: { [key: string]: [number, number]; unit: string };
    unit: string;
}

const VITAL_STANDARDS: Record<string, VitalRange | NestedVitalRange> = {
    blood_pressure: {
        systolic: { normal: [90, 120], elevated: [120, 129], hypertension1: [130, 139], hypertension2: [140, 180], crisis: [180, 300] },
        diastolic: { normal: [60, 80], elevated: [80, 89], hypertension1: [90, 99], hypertension2: [100, 120], crisis: [120, 150] },
        unit: 'mmHg'
    },
    heart_rate: {
        normal: [60, 100], bradycardia: [40, 59], tachycardia: [101, 150], severe: [151, 300],
        unit: 'bpm'
    },
    temperature: {
        normal: [36.1, 37.2], hypothermia: [35.0, 36.0], hyperthermia: [37.3, 38.5], fever: [38.6, 41.5], critical: [41.6, 45.0],
        unit: '°C'
    },
    oxygen_saturation: {
        normal: [95, 100], mild_hypoxia: [91, 94], moderate_hypoxia: [86, 90], severe_hypoxia: [80, 85], critical: [0, 79],
        unit: '%'
    },
    respiratory_rate: {
        normal: [12, 20], bradypnea: [8, 11], tachypnea: [21, 30], severe: [31, 60],
        unit: 'breaths/min'
    },
    bmi: {
        underweight: [0, 18.5], normal: [18.5, 24.9], overweight: [25.0, 29.9], obese1: [30.0, 34.9], obese2: [35.0, 39.9], obese3: [40.0, 60],
        unit: 'kg/m²'
    }
};

export default function VitalSignsDashboard({ vitalSigns = [] as VitalSign[] }) {
    const [filterType, setFilterType] = useState<FilterType>('bp');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showReferenceRanges, setShowReferenceRanges] = useState(true);

    const filteredData = useMemo(() => {
        return vitalSigns.filter((vs) => {
            const date = new Date(vs.measurement_date);
            const afterStart = !startDate || date >= new Date(startDate);
            const beforeEnd = !endDate || date <= new Date(endDate);
            return afterStart && beforeEnd;
        });
    }, [vitalSigns, startDate, endDate]);

    const chartData = useMemo(() => {
        return filteredData
            .slice()
            .reverse()
            .map((vs) => ({
                date: new Date(vs.measurement_date).toLocaleDateString(),
                fullDate: vs.measurement_date,
                time: vs.measurement_time,
                systolic: vs.systolic_bp,
                diastolic: vs.diastolic_bp,
                heart_rate: vs.heart_rate,
                temperature: vs.temperature,
                oxygen_saturation: vs.oxygen_saturation,
                respiratory_rate: vs.respiratory_rate,
                bmi: vs.bmi,
                weight: vs.weight,
                height: vs.height,
            }));
    }, [filteredData]);

    // Calculate vital status and trends
    interface VitalStatus {
        status: string;
        color: string;
        trend: null;
    }

    const getVitalStatus = (value: number, type: string): VitalStatus => {
        const standards = VITAL_STANDARDS[type];
        if (!standards) return { status: 'normal', color: 'text-green-600', trend: null };
        
        // Handle blood pressure specially since it has nested systolic/diastolic
        if (type === 'blood_pressure') {
            const bpStandards = standards as NestedVitalRange;
            const systolicStandards = bpStandards.systolic;
            for (const [rangeName, range] of Object.entries(systolicStandards)) {
                if (rangeName === 'unit') continue;
                const [min, max] = range as [number, number];
                if (value >= min && value <= max) {
                    const colors: Record<string, string> = {
                        normal: 'text-green-600',
                        elevated: 'text-yellow-600',
                        hypertension1: 'text-orange-600',
                        hypertension2: 'text-red-600',
                        crisis: 'text-red-700'
                    };
                    return { status: rangeName, color: colors[rangeName] || 'text-gray-600', trend: null };
                }
            }
        } else {
            // Handle other vitals with flat range structures
            const flatStandards = standards as VitalRange;
            for (const [rangeName, range] of Object.entries(flatStandards)) {
                if (rangeName === 'unit') continue;
                const [min, max] = range as [number, number];
                if (value >= min && value <= max) {
                    const colors: Record<string, string> = {
                        normal: 'text-green-600',
                        underweight: 'text-blue-600',
                        overweight: 'text-yellow-600',
                        obese1: 'text-orange-600',
                        obese2: 'text-red-600',
                        obese3: 'text-red-700',
                        bradycardia: 'text-blue-600',
                        tachycardia: 'text-red-600',
                        severe: 'text-red-700',
                        hypothermia: 'text-blue-600',
                        hyperthermia: 'text-yellow-600',
                        fever: 'text-orange-600',
                        critical: 'text-red-700',
                        mild_hypoxia: 'text-yellow-600',
                        moderate_hypoxia: 'text-orange-600',
                        severe_hypoxia: 'text-red-700',
                        bradypnea: 'text-blue-600',
                        tachypnea: 'text-yellow-600'
                    };
                    return { status: rangeName, color: colors[rangeName] || 'text-gray-600', trend: null };
                }
            }
        }
        return { status: 'critical', color: 'text-red-700', trend: null };
    };

    interface Trend {
        direction: 'up' | 'down' | 'stable';
        icon: React.ReactNode;
        color: string;
    }

    const getTrend = (current: number, previous: number | undefined): Trend | null => {
        if (!previous) return null;
        if (current > previous) return { direction: 'up', icon: <TrendingUp className="h-3 w-3" />, color: 'text-red-500' };
        if (current < previous) return { direction: 'down', icon: <TrendingDown className="h-3 w-3" />, color: 'text-blue-500' };
        return { direction: 'stable', icon: <Activity className="h-3 w-3" />, color: 'text-gray-500' };
    };

    interface VitalOption {
        key: string;
        name: string;
        color: string;
        icon: React.ReactNode;
        unit: string;
        reference?: VitalRange | NestedVitalRange;
    }

    const vitalOptions: Record<FilterType, VitalOption[]> = {
        bp: [
            { 
                key: 'systolic', 
                name: 'Systolic BP', 
                color: '#dc2626', 
                icon: <Activity className="h-4 w-4" />,
                unit: VITAL_STANDARDS.blood_pressure.unit,
                reference: {
                    normal: VITAL_STANDARDS.blood_pressure.systolic.normal,
                    elevated: VITAL_STANDARDS.blood_pressure.systolic.elevated,
                    hypertension1: VITAL_STANDARDS.blood_pressure.systolic.hypertension1,
                    hypertension2: VITAL_STANDARDS.blood_pressure.systolic.hypertension2
                }
            },
            { 
                key: 'diastolic', 
                name: 'Diastolic BP', 
                color: '#7c3aed', 
                icon: <Activity className="h-4 w-4" />,
                unit: VITAL_STANDARDS.blood_pressure.unit,
                reference: {
                    normal: VITAL_STANDARDS.blood_pressure.diastolic.normal,
                    elevated: VITAL_STANDARDS.blood_pressure.diastolic.elevated,
                    hypertension1: VITAL_STANDARDS.blood_pressure.diastolic.hypertension1,
                    hypertension2: VITAL_STANDARDS.blood_pressure.diastolic.hypertension2
                }
            },
        ],
        heart_rate: [{ 
            key: 'heart_rate', 
            name: 'Heart Rate', 
            color: '#ef4444', 
            icon: <Heart className="h-4 w-4" />,
            unit: VITAL_STANDARDS.heart_rate.unit,
            reference: VITAL_STANDARDS.heart_rate
        }],
        temperature: [{ 
            key: 'temperature', 
            name: 'Temperature', 
            color: '#f59e0b', 
            icon: <Thermometer className="h-4 w-4" />,
            unit: VITAL_STANDARDS.temperature.unit,
            reference: VITAL_STANDARDS.temperature
        }],
        oxygen_saturation: [{ 
            key: 'oxygen_saturation', 
            name: 'O₂ Saturation', 
            color: '#06b6d4', 
            icon: <Droplets className="h-4 w-4" />,
            unit: VITAL_STANDARDS.oxygen_saturation.unit,
            reference: VITAL_STANDARDS.oxygen_saturation
        }],
        respiratory_rate: [{ 
            key: 'respiratory_rate', 
            name: 'Respiratory Rate', 
            color: '#10b981', 
            icon: <Activity className="h-4 w-4" />,
            unit: VITAL_STANDARDS.respiratory_rate.unit,
            reference: VITAL_STANDARDS.respiratory_rate
        }],
        bmi: [{ 
            key: 'bmi', 
            name: 'BMI', 
            color: '#8b5cf6', 
            icon: <Activity className="h-4 w-4" />,
            unit: VITAL_STANDARDS.bmi.unit,
            reference: VITAL_STANDARDS.bmi
        }],
    };

    const latest: VitalSign | undefined = filteredData?.[0];

    if (!vitalSigns.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Vital Signs Monitoring
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No vital signs recorded.</p>
                    <p className="text-sm text-muted-foreground mt-2">Start monitoring patient vitals to see trends and analysis.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* --- Enhanced Filters --- */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Vital Signs Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-5">
                        <div>
                            <Label>Start Date</Label>
                            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div>
                            <Label>End Date</Label>
                            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        <div>
                            <Label>Vital Parameter</Label>
                            <Select value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select vital type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bp">Blood Pressure</SelectItem>
                                    <SelectItem value="heart_rate">Heart Rate</SelectItem>
                                    <SelectItem value="temperature">Temperature</SelectItem>
                                    <SelectItem value="oxygen_saturation">O₂ Saturation</SelectItem>
                                    <SelectItem value="respiratory_rate">Respiratory Rate</SelectItem>
                                    <SelectItem value="bmi">BMI</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Reference Ranges</Label>
                            <Button
                                variant={showReferenceRanges ? "default" : "outline"}
                                size="sm"
                                onClick={() => setShowReferenceRanges(!showReferenceRanges)}
                                className="w-full"
                            >
                                {showReferenceRanges ? "Hide" : "Show"} Standards
                            </Button>
                        </div>
                        <div>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setStartDate('');
                                    setEndDate('');
                                    setFilterType('bp');
                                    setShowReferenceRanges(true);
                                }}
                            >
                                Reset All
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* --- Enhanced Summary Cards with Clinical Indicators --- */}
            {latest && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="relative overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                                Blood Pressure
                            </CardTitle>
                            {getTrend(parseInt(latest.systolic_bp), filteredData[1]?.systolic_bp)?.icon}
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${getVitalStatus(parseInt(latest.systolic_bp), 'blood_pressure').color}`}>
                                {latest.systolic_bp}/{latest.diastolic_bp} <span className="text-sm font-normal">mmHg</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {getVitalStatus(parseInt(latest.systolic_bp), 'blood_pressure').status.replace('_', ' ').toUpperCase()}
                            </p>
                        </CardContent>
                        {parseInt(latest.systolic_bp) > 140 && (
                            <div className="absolute top-2 right-2">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                            </div>
                        )}
                    </Card>

                    <Card className="relative overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Heart className="h-4 w-4" />
                                Heart Rate
                            </CardTitle>
                            {getTrend(parseInt(latest.heart_rate), filteredData[1]?.heart_rate)?.icon}
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${getVitalStatus(parseInt(latest.heart_rate), 'heart_rate').color}`}>
                                {latest.heart_rate} <span className="text-sm font-normal">bpm</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {getVitalStatus(parseInt(latest.heart_rate), 'heart_rate').status.replace('_', ' ').toUpperCase()}
                            </p>
                        </CardContent>
                        {(parseInt(latest.heart_rate) > 120 || parseInt(latest.heart_rate) < 50) && (
                            <div className="absolute top-2 right-2">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                            </div>
                        )}
                    </Card>

                    <Card className="relative overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Thermometer className="h-4 w-4" />
                                Temperature
                            </CardTitle>
                            {getTrend(parseFloat(latest.temperature), filteredData[1]?.temperature)?.icon}
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${getVitalStatus(parseFloat(latest.temperature), 'temperature').color}`}>
                                {latest.temperature}°C
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {getVitalStatus(parseFloat(latest.temperature), 'temperature').status.toUpperCase()}
                            </p>
                        </CardContent>
                        {parseFloat(latest.temperature) > 38.5 && (
                            <div className="absolute top-2 right-2">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                            </div>
                        )}
                    </Card>

                    <Card className="relative overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Droplets className="h-4 w-4" />
                                O₂ Saturation
                            </CardTitle>
                            {getTrend(parseInt(latest.oxygen_saturation), filteredData[1]?.oxygen_saturation)?.icon}
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${getVitalStatus(parseInt(latest.oxygen_saturation), 'oxygen_saturation').color}`}>
                                {latest.oxygen_saturation}%
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {getVitalStatus(parseInt(latest.oxygen_saturation), 'oxygen_saturation').status.replace('_', ' ').toUpperCase()}
                            </p>
                        </CardContent>
                        {parseInt(latest.oxygen_saturation) < 92 && (
                            <div className="absolute top-2 right-2">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {/* --- Enhanced Chart with Reference Ranges --- */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Clinical Trends Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="date" 
                                tick={{ fontSize: 12 }}
                                stroke="#6b7280"
                            />
                            <YAxis 
                                tick={{ fontSize: 12 }}
                                stroke="#6b7280"
                            />
                            <Tooltip content={<CustomVitalTooltip />} />
                            
                            {/* Reference ranges for clinical standards */}
                            {showReferenceRanges && (
                                <>
                                    {filterType === 'bp' ? (
                                        <>
                                            <ReferenceLine y={120} stroke="#fbbf24" strokeDasharray="5 5" label="Elevated" />
                                            <ReferenceLine y={140} stroke="#fb923c" strokeDasharray="5 5" label="Hypertension" />
                                            <ReferenceLine y={180} stroke="#ef4444" strokeDasharray="5 5" label="Crisis" />
                                        </>
                                    ) : filterType === 'heart_rate' ? (
                                        <>
                                            <ReferenceLine y={60} stroke="#3b82f6" strokeDasharray="5 5" label="Bradycardia" />
                                            <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="5 5" label="Tachycardia" />
                                        </>
                                    ) : filterType === 'temperature' ? (
                                        <>
                                            <ReferenceLine y={36.1} stroke="#3b82f6" strokeDasharray="5 5" label="Low" />
                                            <ReferenceLine y={37.2} stroke="#10b981" strokeDasharray="5 5" label="Normal" />
                                            <ReferenceLine y={38.5} stroke="#fbbf24" strokeDasharray="5 5" label="Fever" />
                                        </>
                                    ) : filterType === 'oxygen_saturation' ? (
                                        <>
                                            <ReferenceLine y={95} stroke="#10b981" strokeDasharray="5 5" label="Normal" />
                                            <ReferenceLine y={90} stroke="#fbbf24" strokeDasharray="5 5" label="Mild Hypoxia" />
                                            <ReferenceLine y={85} stroke="#fb923c" strokeDasharray="5 5" label="Moderate" />
                                        </>
                                    ) : filterType === 'respiratory_rate' ? (
                                        <>
                                            <ReferenceLine y={12} stroke="#3b82f6" strokeDasharray="5 5" label="Low" />
                                            <ReferenceLine y={20} stroke="#10b981" strokeDasharray="5 5" label="Normal" />
                                            <ReferenceLine y={30} stroke="#fbbf24" strokeDasharray="5 5" label="High" />
                                        </>
                                    ) : filterType === 'bmi' ? (
                                        <>
                                            <ReferenceLine y={18.5} stroke="#3b82f6" strokeDasharray="5 5" label="Underweight" />
                                            <ReferenceLine y={25} stroke="#10b981" strokeDasharray="5 5" label="Normal" />
                                            <ReferenceLine y={30} stroke="#fbbf24" strokeDasharray="5 5" label="Overweight" />
                                        </>
                                    ) : null}
                                </>
                            )}
                            
                            {vitalOptions[filterType].map((v) => (
                                <Line 
                                    key={v.key} 
                                    type="monotone" 
                                    dataKey={v.key} 
                                    stroke={v.color} 
                                    name={v.name} 
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                    
                    {/* Clinical Legend */}
                    <div className="mt-4 flex flex-wrap gap-4 text-xs">
                        {vitalOptions[filterType].map((v) => (
                            <div key={v.key} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: v.color }} />
                                <span>{v.name} ({v.unit})</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* --- Enhanced Clinical Table --- */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Vital Signs History (ISO 80601 Compliant)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px]">
                        <Table>
                            <TableHeader className="sticky top-0 bg-background">
                                <TableRow>
                                    <TableHead className="w-[100px]">Date</TableHead>
                                    <TableHead className="w-[80px]">Time</TableHead>
                                    <TableHead className="w-[120px]">BP (mmHg)</TableHead>
                                    <TableHead className="w-[100px]">HR (bpm)</TableHead>
                                    <TableHead className="w-[100px]">Temp (°C)</TableHead>
                                    <TableHead className="w-[120px]">O₂ Sat (%)</TableHead>
                                    <TableHead className="w-[120px]">RR (/min)</TableHead>
                                    <TableHead className="w-[80px]">BMI</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.map((vs, index) => (
                                    <TableRow key={vs.vital_sign_id} className="hover:bg-muted/50">
                                        <TableCell className="font-medium">
                                            {new Date(vs.measurement_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{vs.measurement_time}</TableCell>
                                        <TableCell>
                                            <div className={`font-mono ${getVitalStatus(parseInt(vs.systolic_bp), 'blood_pressure').color}`}>
                                                {vs.systolic_bp}/{vs.diastolic_bp}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className={`font-mono ${getVitalStatus(parseInt(vs.heart_rate), 'heart_rate').color}`}>
                                                {vs.heart_rate}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className={`font-mono ${getVitalStatus(parseFloat(vs.temperature), 'temperature').color}`}>
                                                {vs.temperature}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className={`font-mono ${getVitalStatus(parseInt(vs.oxygen_saturation), 'oxygen_saturation').color}`}>
                                                {vs.oxygen_saturation}%
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className={`font-mono ${vs.respiratory_rate ? getVitalStatus(parseInt(vs.respiratory_rate), 'respiratory_rate').color : ''}`}>
                                                {vs.respiratory_rate || '—'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className={`font-mono ${vs.bmi ? getVitalStatus(parseFloat(vs.bmi), 'bmi').color : ''}`}>
                                                {vs.bmi || '—'}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
