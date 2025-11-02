import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function NotificationsDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // prevent re-fetching on unmounted component
    const isMounted = useRef(true);

    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get('/notifications');
            if (isMounted.current) {
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        isMounted.current = true;
        fetchNotifications();

        // 🌀 Start polling every 30 seconds (adjust as needed)
        const interval = setInterval(fetchNotifications, 30000);

        // 🧹 Cleanup on unmount
        return () => {
            isMounted.current = false;
            clearInterval(interval);
        };
    }, []);

    const markAsViewed = async (id: any, actionUrl: any) => {
        await axios.post(`/notifications/${id}/view`);
        fetchNotifications();
        if (actionUrl) router.visit(actionUrl);
    };

    const markAllAsViewed = async () => {
        await axios.post('/notifications/view-all');
        fetchNotifications();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-80">
                <div className="flex items-center justify-between px-2 py-1">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllAsViewed} className="text-xs text-blue-600 hover:text-blue-800">
                            Mark all as viewed
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-64">
                    {notifications.length === 0 && <div className="p-4 text-center text-sm text-gray-500">No notifications</div>}
                    {notifications.map((n: any) => (
                        <DropdownMenuItem
                            key={n.id}
                            onClick={() => markAsViewed(n.id, n.action_url)}
                            className={`flex flex-col items-start space-y-1 ${!n.is_viewed ? 'bg-secondary' : ''}`}
                        >
                            <div className="flex w-full justify-between">
                                <span className="font-semibold">{n.title}</span>
                                <span className="text-xs text-gray-400">{n.created_at}</span>
                            </div>
                            <span className="text-sm">{n.message}</span>
                            <span className={`text-[10px] uppercase ${n.type === 'audit' ? 'text-gray-400' : 'text-blue-400'}`}>
                                {n.type.replace('_', ' ')}
                            </span>
                        </DropdownMenuItem>
                    ))}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
