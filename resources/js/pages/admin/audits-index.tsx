import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { Head, Link, usePage } from '@inertiajs/react';

export default function AuditIndex() {
    const { audits, filters } = usePage().props as any;

    return (
        <AppLayout>
            <Head title="Inventory" />
            <div className="flex h-[calc(100vh-8.5rem)] flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex space-x-4">
                    <Card className="mt-4 flex flex-1">
                        <CardHeader>
                            <CardTitle>Audit Logs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form method="get" className="mb-4 flex gap-2">
                                <Input name="search" placeholder="Search model or event..." defaultValue={filters.search} />
                                <Button type="submit">Search</Button>
                            </form>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Event</TableHead>
                                        <TableHead>Model</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {audits.data.map((a: any) => (
                                        <TableRow key={a.id}>
                                            <TableCell>{a.user?.name ?? 'System'}</TableCell>
                                            <TableCell>
                                                <Badge variant={a.event === 'updated' ? 'default' : 'outline'}>{a.event}</Badge>
                                            </TableCell>
                                            <TableCell>{a.auditable_type.split('\\').pop()}</TableCell>
                                            <TableCell>{new Date(a.created_at).toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Link href={admin.audits.show(a.id)} className="text-blue-600 hover:underline">
                                                    <Button variant={"default"}> View</Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
