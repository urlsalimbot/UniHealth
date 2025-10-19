import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';

type VisitsRadialChartProps = {
    totalVisits: number;
    maxVisits: number;
};

export default function VisitsRadialChart({ totalVisits, maxVisits }: VisitsRadialChartProps) {
    const percentage = Math.min(Math.round((totalVisits / maxVisits) * 100), 100);

    const data = [
        {
            name: 'Visits',
            value: totalVisits,
            fill: '#16a34a', // emerald-600
        },
    ];

    return (
        <>
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Visits (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="relative flex h-[250px] items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" barSize={16} startAngle={90} endAngle={-270} data={data}>
                        <PolarAngleAxis type="number" domain={[0, maxVisits]} tick={false} />
                        <RadialBar dataKey="value" cornerRadius={10} background fill="#16a34a" />
                    </RadialBarChart>
                </ResponsiveContainer>

                <div className="absolute text-center">
                    <p className="text-4xl font-bold text-emerald-600">{totalVisits}</p>
                    <p className="text-sm text-muted-foreground">{percentage}% of max</p>
                </div>
            </CardContent>
        </>
    );
}
