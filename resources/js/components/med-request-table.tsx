import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function MedicationRequestsTable({ requests, onApprove }: any) {
    if (!requests || requests.length === 0) {
        return <p className="text-sm text-gray-500">No medication requests found.</p>;
    }

    return (
        <div className="overflow-x-auto rounded-lg border p-2">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requests.map((req: any) => (
                        <TableRow key={req.id}>
                            <TableCell>{req.id}</TableCell>
                            <TableCell>{`${req.patient.last_name}, ${req.patient.first_name}`}</TableCell>
                            <TableCell>
                                <span
                                    className={`rounded px-2 py-1 text-xs ${
                                        req.status === 'fulfilled'
                                            ? 'bg-green-100 text-green-800'
                                            : req.status === 'rejected'
                                              ? 'bg-red-100 text-red-800'
                                              : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                >
                                    {req.status}
                                </span>
                            </TableCell>
                            <TableCell>{new Date(req.created_at).toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                                {req.status === 'pending' && (
                                    <Button size="sm" onClick={() => onApprove(req)}>
                                        Approve
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
