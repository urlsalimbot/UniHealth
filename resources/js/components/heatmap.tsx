import { Button } from '@/components/ui/button';
import { CardContent, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useMemo, useState } from 'react';

/**
 * PatientEncountersHeatmap
 * Props:
 *  - medicalEncounters: Array of encounters. Each encounter must have an `encounter_date` (ISO string or 'YYYY-MM-DD').
 *
 * Usage:
 * <PatientEncountersHeatmap medicalEncounters={medical_encounters} />
 *
 * This component renders a calendar heatmap (month view) using only Tailwind + shadcn/ui components.
 */

export default function PatientEncountersHeatmap({ medicalEncounters = [] }: { medicalEncounters?: any[] }) {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0-indexed

    // Normalize encounter dates into a map: yyyy-mm-dd => count
    const encountersByDate = useMemo(() => {
        const map: Record<string, number> = {};
        for (const e of medicalEncounters) {
            // Accept either encounter_date or encounter_date_iso etc.
            const raw = e.encounter_date ?? e.encounterDate ?? e.date ?? null;
            if (!raw) continue;
            const d = new Date(raw);
            if (isNaN(d.getTime())) continue;
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            map[key] = (map[key] ?? 0) + 1;
        }
        return map;
    }, [medicalEncounters]);

    // Build calendar matrix for current month (array of weeks; each week is array of Date|null)
    const monthMatrix = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);

        // We'll display weeks starting on Sunday (0) — change if you need Monday-first
        const startDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const weeks: Array<Array<Date | null>> = [];
        let week: Array<Date | null> = [];

        // fill initial nulls
        for (let i = 0; i < startDayOfWeek; i++) week.push(null);

        for (let d = 1; d <= daysInMonth; d++) {
            week.push(new Date(currentYear, currentMonth, d));
            if (week.length === 7) {
                weeks.push(week);
                week = [];
            }
        }

        if (week.length > 0) {
            while (week.length < 7) week.push(null);
            weeks.push(week);
        }

        return weeks;
    }, [currentYear, currentMonth]);

    // Compute max count in this month for color scaling
    const monthMax = useMemo(() => {
        let m = 0;
        for (const week of monthMatrix) {
            for (const d of week) {
                if (!d) continue;
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                m = Math.max(m, encountersByDate[key] ?? 0);
            }
        }
        return m;
    }, [monthMatrix, encountersByDate]);

    function prevMonth() {
        if (currentMonth === 0) {
            setCurrentYear((y) => y - 1);
            setCurrentMonth(11);
        } else setCurrentMonth((m) => m - 1);
    }
    function nextMonth() {
        if (currentMonth === 11) {
            setCurrentYear((y) => y + 1);
            setCurrentMonth(0);
        } else setCurrentMonth((m) => m + 1);
    }

    // Color scale: returns a Tailwind background color class based on intensity (0..1)
    function colorForCount(count: number) {
        if (count <= 0) return '';
        if (monthMax === 0) return 'bg-green-50 border-green-100';
        const t = count / monthMax;
        // we'll pick 5 buckets
        if (t > 0.75) return 'bg-emerald-700 text-white';
        if (t > 0.5) return 'bg-emerald-600 text-white';
        if (t > 0.25) return 'bg-emerald-500 text-white';
        return 'bg-emerald-200';
    }

    const monthName = new Date(currentYear, currentMonth).toLocaleString(undefined, { month: 'long' });

    return (
        <>
            {' '}
            <CardHeader className="flex items-center justify-between">
                {/* <CardTitle>Encounters Heatmap</CardTitle> */}
                <div className="flex items-center gap-2">
                    <div className="text-sm">
                        {monthName} {currentYear}
                    </div>
                    <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={prevMonth}>
                            Prev
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                setCurrentYear(today.getFullYear());
                                setCurrentMonth(today.getMonth());
                            }}
                        >
                            Today
                        </Button>
                        <Button size="sm" variant="ghost" onClick={nextMonth}>
                            Next
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-2 grid grid-cols-7 gap-1 text-xs">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                        <div key={d} className="text-center text-[12px] font-medium">
                            {d}
                        </div>
                    ))}
                </div>

                <div className="grid grid-rows-[repeat(6,1fr)] gap-2">
                    {monthMatrix.map((week, wi) => (
                        <div key={wi} className="grid grid-cols-7 gap-1">
                            {week.map((d, di) => {
                                if (!d) return <div key={di} className="h-12 w-full" />;
                                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                const count = encountersByDate[key] ?? 0;
                                const cls = colorForCount(count);

                                return (
                                    <Tooltip key={di}>
                                        <TooltipTrigger>
                                            <div className={`flex h-12 w-full items-start justify-start rounded-md border p-1 text-[11px] ${cls}`}>
                                                <div className="ml-1">{d.getDate()}</div>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>{`${key} — ${count} encounter${count !== 1 ? 's' : ''}`}</TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                        <div className="h-3 w-6 rounded-sm bg-slate-200" />
                        <div className="text-xs text-muted-foreground">0</div>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-3 w-6 rounded-sm bg-emerald-200" />
                        <div className="text-xs text-muted-foreground">low</div>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-3 w-6 rounded-sm bg-emerald-500" />
                        <div className="text-xs text-muted-foreground">medium</div>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-3 w-6 rounded-sm bg-emerald-700" />
                        <div className="text-xs text-muted-foreground">high</div>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                        Total encounters this month:{' '}
                        {Object.entries(encountersByDate)
                            .filter(([k]) => k.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`))
                            .reduce((s, [, v]) => s + v, 0)}
                    </div>
                </div>
            </CardContent>
        </>
    );
}
