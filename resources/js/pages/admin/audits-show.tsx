import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { 
    User, 
    Calendar, 
    Activity, 
    FileText, 
    Copy, 
    Download, 
    ArrowLeft,
    Hash,
    Database,
    Clock
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AuditShow() {
    const { audit } = usePage().props as any;
    const [copiedSection, setCopiedSection] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Audits',
            href: admin.audits.index.url(),
        },
        {
            title: `Audit #${audit.id}`,
            href: admin.audits.show.url(audit.id),
        },
    ];

    const oldValues = audit.old_values || {};
    const newValues = audit.new_values || {};

    const getEventColor = (event: string) => {
        switch (event?.toLowerCase()) {
            case 'created': return 'bg-green-100 text-green-800 border-green-200';
            case 'updated': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'deleted': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getEventIcon = (event: string) => {
        switch (event?.toLowerCase()) {
            case 'created': return '➕';
            case 'updated': return '✏️';
            case 'deleted': return '🗑️';
            default: return '📋';
        }
    };

    const copyToClipboard = (text: string, section: string) => {
        navigator.clipboard.writeText(text);
        setCopiedSection(section);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopiedSection(null), 2000);
    };

    const exportAudit = () => {
        const auditData = {
            id: audit.id,
            user: audit.user?.name ?? 'System',
            event: audit.event,
            model: audit.auditable_type,
            created_at: audit.created_at,
            old_values: oldValues,
            new_values: newValues,
            ip_address: audit.ip_address,
            user_agent: audit.user_agent
        };
        
        const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-${audit.id}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Audit exported successfully!');
    };

    const formatJson = (obj: any) => {
        return JSON.stringify(obj, null, 2);
    };

    const hasChanges = Object.keys(oldValues).length > 0 || Object.keys(newValues).length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Audit #${audit.id} - UniHealth`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Audits
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Audit Details</h1>
                            <p className="text-muted-foreground">Review system activity and changes</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(formatJson(audit), 'full')}
                            className="flex items-center gap-2"
                        >
                            {copiedSection === 'full' ? '✓' : <Copy className="h-4 w-4" />}
                            Copy All
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={exportAudit}
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Audit Information Card */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Hash className="h-5 w-5" />
                                Audit Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">ID</span>
                                    <span className="font-mono text-sm">#{audit.id}</span>
                                </div>
                                
                                <Separator />
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        User
                                    </span>
                                    <span className="text-sm">{audit.user?.name ?? 'System'}</span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Activity className="h-4 w-4" />
                                        Event
                                    </span>
                                    <Badge className={getEventColor(audit.event)}>
                                        {getEventIcon(audit.event)} {audit.event}
                                    </Badge>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Database className="h-4 w-4" />
                                        Model
                                    </span>
                                    <span className="text-sm font-mono">
                                        {audit.auditable_type?.split('\\').pop() || 'Unknown'}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Date
                                    </span>
                                    <span className="text-sm">
                                        {new Date(audit.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Time
                                    </span>
                                    <span className="text-sm">
                                        {new Date(audit.created_at).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                            
                            {(audit.ip_address || audit.user_agent) && (
                                <>
                                    <Separator />
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold">Technical Details</h4>
                                        {audit.ip_address && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-muted-foreground">IP Address</span>
                                                <span className="font-mono text-sm">{audit.ip_address}</span>
                                            </div>
                                        )}
                                        {audit.user_agent && (
                                            <div>
                                                <span className="text-sm font-medium text-muted-foreground block mb-1">User Agent</span>
                                                <p className="text-xs text-muted-foreground break-all">{audit.user_agent}</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Changes Card */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Changes Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {hasChanges ? (
                                <div className="space-y-6">
                                    {/* Summary of Changes */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                Previous Values
                                            </h4>
                                            <p className="text-sm text-red-600 dark:text-red-400">
                                                {Object.keys(oldValues).length} fields changed
                                            </p>
                                        </div>
                                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                New Values
                                            </h4>
                                            <p className="text-sm text-green-600 dark:text-green-400">
                                                {Object.keys(newValues).length} fields updated
                                            </p>
                                        </div>
                                    </div>

                                    {/* Detailed Changes */}
                                    <div className="grid gap-4 lg:grid-cols-2">
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-semibold text-sm">Old Values</h3>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(formatJson(oldValues), 'old')}
                                                    className="h-6 px-2"
                                                >
                                                    {copiedSection === 'old' ? '✓' : <Copy className="h-3 w-3" />}
                                                </Button>
                                            </div>
                                            <div className="bg-muted/50 rounded-lg p-3 overflow-x-auto">
                                                <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                                                    {formatJson(oldValues)}
                                                </pre>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-semibold text-sm">New Values</h3>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(formatJson(newValues), 'new')}
                                                    className="h-6 px-2"
                                                >
                                                    {copiedSection === 'new' ? '✓' : <Copy className="h-3 w-3" />}
                                                </Button>
                                            </div>
                                            <div className="bg-muted/50 rounded-lg p-3 overflow-x-auto">
                                                <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                                                    {formatJson(newValues)}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-muted-foreground">
                                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-sm">No data changes recorded for this audit</p>
                                        <p className="text-xs mt-1">This might be a system event or metadata-only change</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
