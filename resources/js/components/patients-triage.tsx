import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

type Props = {
    triageUrgency: Record<string, number>;
};

const COLORS = ['#dc2626', '#f97316', '#facc15', '#22c55e']; // red, orange, yellow, green

export default function PatientsTriageUrgency({ triageUrgency }: Props) {
    const data = Object.entries(triageUrgency).map(([level, total]) => ({
        name: level,
        value: total,
    }));

    return (
        <>
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Patients Triage Urgency</CardTitle>
            </CardHeader>
            <CardContent className="flex h-[250px] items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={4}>
                            {data.map((_, i) => (
                                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </>
    );
}
