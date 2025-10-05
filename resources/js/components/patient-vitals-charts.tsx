'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PolarAngleAxis, RadialBar, RadialBarChart, Tooltip } from 'recharts';

// normal ranges reference
const normalRanges = {
    systolic_bp: { min: 90, max: 120, label: 'mmHg' },
    diastolic_bp: { min: 60, max: 80, label: 'mmHg' },
    heart_rate: { min: 60, max: 100, label: 'bpm' },
    respiratory_rate: { min: 12, max: 20, label: '/min' },
    temperature: { min: 36.5, max: 37.5, label: '°C' },
    oxygen_saturation: { min: 95, max: 100, label: '%' },
    bmi: { min: 18.5, max: 24.9, label: 'kg/m²' },
};

// helper to compute percentage vs normal range
const getChartData = (value: number, type: keyof typeof normalRanges) => {
    const { min, max } = normalRanges[type];
    const avg = (min + max) / 2;
    const diff = value - avg;
    const percent = Math.min(100, Math.max(0, (value / max) * 100));

    return {
        value,
        diff,
        percent,
    };
};

type Props = {
    vitals: {
        systolic_bp: number;
        diastolic_bp: number;
        heart_rate: number;
        respiratory_rate: number;
        temperature: number;
        oxygen_saturation: number;
        bmi: number;
    };
};

export default function VitalSignsDashboard({ vitals }: Props) {
    const vitalKeys = Object.keys(vitals) as (keyof typeof normalRanges)[];

    return (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
            {vitalKeys.map((key) => {
                const range = normalRanges[key];
                if (!range) return null;

                const { label, min, max } = range;
                const { value, diff, percent } = getChartData(vitals[key], key);

                const data = [{ name: key, value: percent, fill: '#4f46e5' }];  
                return (
                    <Card key={key} className="rounded-2xl shadow-md">
                        <CardHeader>
                            <CardTitle className="capitalize">{key.replace('_', ' ')}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center">
                            <RadialBarChart
                                width={160}
                                height={160}
                                cx="50%"
                                cy="50%"
                                innerRadius="70%"
                                outerRadius="100%"
                                barSize={14}
                                data={data}
                                startAngle={90}
                                endAngle={-270}
                            >
                                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                <RadialBar background dataKey="value" cornerRadius={8} />
                                <Tooltip />
                            </RadialBarChart>
                            <div className="mt-2 text-center">
                                <p className="text-xl font-semibold">
                                    {value} {label}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Normal: {min}-{max} {label}
                                </p>
                                <p className={`text-sm ${diff > 0 ? 'text-red-500' : diff < 0 ? 'text-blue-500' : 'text-green-600'}`}>
                                    {diff > 0 ? '+' : ''}
                                    {diff.toFixed(1)} from normal
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
