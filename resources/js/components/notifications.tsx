import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotificationsDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        const { data } = await axios.get('/notifications');
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsViewed = async (id: any, actionUrl: any) => {
        await axios.post(`/notifications/${id}/view`);
        fetchNotifications();
        if (actionUrl) router.visit(actionUrl);
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
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
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
