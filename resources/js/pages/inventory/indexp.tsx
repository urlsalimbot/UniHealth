import MedRequestForm from '@/components/form-med-request';
import MedicationsTable from '@/components/medications-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import inventory from '@/routes/inventory';
import { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventory',
        href: inventory.index.url(),
    },
];

export default function PatientIndex() {
    const { medications } = usePage().props as any;

    // 🔍 Local search state only (no server query)
    const [searchMedication, setSearchMedication] = useState('');

    const handleMedicationSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchMedication(e.target.value);
    };

    // ⚡ Filter client-side instantly - hide all medications unless searching
    const filteredMeds = useMemo(() => {
        const meds = Array.isArray(medications) ? medications : (medications?.data ?? []);
        if (!searchMedication.trim()) return [];

        const term = searchMedication.toLowerCase();
        return meds.filter(
            (m: any) =>
                m.generic_name?.toLowerCase().includes(term) ||
                m.brand_names?.toLowerCase().includes(term) ||
                m.drug_class?.toLowerCase().includes(term),
        );
    }, [medications, searchMedication]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory" />

            <div className="flex flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* ✅ Responsive flex container */}
                <div className="flex flex-col space-y-4 md:h-[95%] md:flex-row md:space-y-0 md:space-x-4">
                    {/* 🧾 Prescription Request Form */}
                    <div className="w-full md:w-1/3">
                        <MedRequestForm />
                    </div>
                    {/* 💊 Medications Panel */}
                    <Card className="w-full flex-1 md:w-2/3">
                        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
                            <CardTitle>Medications</CardTitle>
                        </CardHeader>

                        <CardContent className="overflow-x-auto">
                            <MedicationsTable
                                medications={filteredMeds}
                                search={searchMedication}
                                onSearchChange={handleMedicationSearch}
                                onRowClick={(id) => router.get(inventory.item.show(id))}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
