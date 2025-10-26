import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function FlashMessages() {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (!flash) return;

        // ✅ Standard flash messages
        if (flash.success) {
            toast.success(flash.success);
        }

        if (flash.error) {
            toast.error(flash.error);
        }

        if (flash.warning) {
            toast.warning(flash.warning);
        }

        // ✅ Custom toast for invitation link
        if (flash?.invitation_link) {
            toast.custom(
                (t) => (
                    <div
                        className={cn(
                            'relative flex flex-col gap-3 rounded-xl border border-green-300/40 bg-gradient-to-br from-emerald-50 to-green-100 p-4 shadow-lg',
                            'dark:border-green-700/50 dark:from-emerald-950 dark:to-green-900',
                            'w-full max-w-sm overflow-hidden',
                        )}
                    >
                        {/* Accent bar */}
                        {/* <div className="absolute top-0 left-0 h-full w-1 rounded-l-xl bg-green-600 dark:bg-green-500" /> */}

                        <div className="flex flex-col space-y-2 pl-3">
                            <p className="text-sm font-semibold text-green-800 dark:text-green-300">Patient Invitation Link Generated</p>

                            <div className="flex items-center gap-2">
                                <Input
                                    readOnly
                                    value={flash.invitation_link}
                                    className={cn('border-green-300 bg-white/80 text-xs dark:border-green-800 dark:bg-green-950 dark:text-green-100')}
                                    onFocus={(e) => e.target.select()}
                                />
                                <Button
                                    size="sm"
                                    className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400"
                                    onClick={() => {
                                        navigator.clipboard.writeText(flash.invitation_link);
                                        toast.success('Copied to clipboard');
                                    }}
                                >
                                    Copy
                                </Button>
                            </div>
                        </div>
                    </div>
                ),
                { duration: 9000 },
            );
        }
    }, [flash]);

    return null;
}
