import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
    Activity, 
    UserPlus, 
    Pill, 
    FileText, 
    Stethoscope,
    Calendar,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityItem {
    id: string;
    type: 'encounter' | 'patient' | 'prescription' | 'appointment';
    title: string;
    description: string;
    timestamp: string;
    status?: 'completed' | 'pending' | 'in-progress' | 'cancelled';
}

interface RecentActivityFeedProps {
    activities?: ActivityItem[];
    maxItems?: number;
}

export default function RecentActivityFeed({ 
    activities = [], 
    maxItems = 8 
}: RecentActivityFeedProps) {
    
   

    const displayActivities = activities.length > 0 ? activities : [];
    const limitedActivities = displayActivities.slice(0, maxItems);

    const getActivityIcon = (type: ActivityItem['type']) => {
        switch (type) {
            case 'encounter':
                return Stethoscope;
            case 'patient':
                return UserPlus;
            case 'prescription':
                return Pill;
            case 'appointment':
                return Calendar;
            default:
                return Activity;
        }
    };

    const getActivityColor = (type: ActivityItem['type']) => {
        switch (type) {
            case 'encounter':
                return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20';
            case 'patient':
                return 'text-green-600 bg-green-50 dark:bg-green-950/20';
            case 'prescription':
                return 'text-purple-600 bg-purple-50 dark:bg-purple-950/20';
            case 'appointment':
                return 'text-orange-600 bg-orange-50 dark:bg-orange-950/20';
            default:
                return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20';
        }
    };

    const getStatusBadge = (status?: ActivityItem['status']) => {
        if (!status) return null;

        const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive'; className: string }> = {
            completed: { label: 'Completed', variant: 'default', className: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200' },
            pending: { label: 'Pending', variant: 'secondary', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200' },
            'in-progress': { label: 'In Progress', variant: 'default', className: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200' },
            cancelled: { label: 'Cancelled', variant: 'destructive', className: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200' },
        };

        const config = statusConfig[status] || statusConfig['completed']; // Fallback to 'completed' if status not found
        
        return (
            <Badge variant={config.variant} className={cn('text-xs', config.className)}>
                {config.label}
            </Badge>
        );
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                </CardTitle>
            </div>
            <CardContent className="px-0 pb-0">
                <ScrollArea className="h-[320px] pr-4">
                    <div className="space-y-3">
                        {limitedActivities.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Activity className="h-12 w-12 text-muted-foreground/50 mb-3" />
                                <p className="text-sm text-muted-foreground">No recent activity</p>
                            </div>
                        ) : (
                            limitedActivities.map((activity:ActivityItem) => {
                                const Icon = getActivityIcon(activity.type);
                                const colorClass = getActivityColor(activity.type);

                                return (
                                    <div
                                        key={activity.id}
                                        className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors duration-200 cursor-pointer"
                                    >
                                        <div className={cn('p-2 rounded-lg flex-shrink-0', colorClass)}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-sm font-medium leading-tight truncate">
                                                    {activity.title}
                                                </p>
                                                {getStatusBadge(activity.status)}
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {activity.description}
                                            </p>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {formatTimestamp(activity.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </CardHeader>
    );
}
