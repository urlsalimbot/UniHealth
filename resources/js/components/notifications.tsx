import { ScrollArea } from '@/components/ui/scroll-area';
import admin from '@/routes/admin';
import { Link } from '@inertiajs/react';

export default function NotificationsPanel({ auth, notifications }: any) {
    return (
        <ScrollArea className="h-80">
            {notifications?.length > 0 ? (
                notifications.map((n: any) => {
                    const content = (
                        <div key={n.id} className="rounded-md border-b p-2 transition hover:bg-accent/30">
                            <span className="font-medium text-foreground">
                                {n.action ?? 'Action'} {n.entity ?? 'Entity'}
                            </span>
                            <p className="text-xs text-muted-foreground">{n.created_at}</p>
                        </div>
                    );

                    // 🔗 If admin, wrap with Inertia Link
                    if (auth?.user?.role === 'administrator') {
                        return (
                            <Link
                                key={n.id}
                                href={admin.audits.show(n.id)} // fallback if no link
                                className="block"
                            >
                                {content}
                            </Link>
                        );
                    }

                    // 👤 For non-admins, show as plain text
                    return content;
                })
            ) : (
                <p className="mt-4 text-center text-sm text-muted-foreground">No notifications found.</p>
            )}
        </ScrollArea>
    );
}
