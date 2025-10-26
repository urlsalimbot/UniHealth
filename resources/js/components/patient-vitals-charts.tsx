import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VitalSign } from '@/types';
import { useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CustomVitalTooltip } from './custom-tooltip';

/**
 * VitalSignsDashboard Component
 * @param {Object} props
 * @param {Array} props.vitalSigns - Array of vital sign records from Laravel backend
 */
type FilterType = 'bp' | 'heart_rate' | 'temperature' | 'oxygen_saturation';

export default function VitalSignsDashboard({ vitalSigns = [] as VitalSign[] }) {
    const [filterType, setFilterType] = useState<FilterType>('bp');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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
                systolic: vs.systolic_bp,
                diastolic: vs.diastolic_bp,
                heart_rate: vs.heart_rate,
                temperature: vs.temperature,
                oxygen_saturation: vs.oxygen_saturation,
            }));
    }, [filteredData]);

    const vitalOptions: Record<FilterType, { key: string; name: string; color: string }[]> = {
        bp: [
            { key: 'systolic', name: 'Systolic BP', color: '#8884d8' },
            { key: 'diastolic', name: 'Diastolic BP', color: '#82ca9d' },
        ],
        heart_rate: [{ key: 'heart_rate', name: 'Heart Rate', color: '#ff7300' }],
        temperature: [{ key: 'temperature', name: 'Temperature', color: '#f87171' }],
        oxygen_saturation: [{ key: 'oxygen_saturation', name: 'O₂ Saturation', color: '#38bdf8' }],
    };

    const latest = filteredData?.[0];

    if (!vitalSigns.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Vital Signs</CardTitle>
                </CardHeader>
                <CardContent>No vital signs recorded.</CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* --- Filters --- */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-md font-bold">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
                        <div>
                            <Label>Start Date</Label>
                            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div>
                            <Label>End Date</Label>
                            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        <div>
                            <Label>Vital Type</Label>
                            <Select value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select vital type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bp">Blood Pressure</SelectItem>
                                    <SelectItem value="heart_rate">Heart Rate</SelectItem>
                                    <SelectItem value="temperature">Temperature</SelectItem>
                                    <SelectItem value="oxygen_saturation">Oxygen Saturation</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setStartDate('');
                                    setEndDate('');
                                    setFilterType('bp');
                                }}
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* --- Summary --- */}
            {latest && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Blood Pressure</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">
                            {latest.systolic_bp}/{latest.diastolic_bp} mmHg
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Heart Rate</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">{latest.heart_rate} bpm</CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Temperature</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">{latest.temperature}°C</CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>O₂ Saturation</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">{latest.oxygen_saturation}%</CardContent>
                    </Card>
                </div>
            )}

            {/* --- Chart --- */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-md font-bold">Vital Trends</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip content={<CustomVitalTooltip />} />
                            {vitalOptions[filterType].map((v) => (
                                <Line key={v.key} type="monotone" dataKey={v.key} stroke={v.color} name={v.name} strokeWidth={2} />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* --- Table --- */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-md font-bold">Vital Signs History</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[300px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>BP</TableHead>
                                    <TableHead>HR</TableHead>
                                    <TableHead>Temp</TableHead>
                                    <TableHead>O₂ Sat</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.map((vs) => (
                                    <TableRow key={vs.vital_sign_id}>
                                        <TableCell>{new Date(vs.measurement_date).toLocaleDateString()}</TableCell>
                                        <TableCell>{vs.measurement_time}</TableCell>
                                        <TableCell>
                                            {vs.systolic_bp}/{vs.diastolic_bp}
                                        </TableCell>
                                        <TableCell>{vs.heart_rate}</TableCell>
                                        <TableCell>{vs.temperature}°C</TableCell>
                                        <TableCell>{vs.oxygen_saturation}%</TableCell>
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
