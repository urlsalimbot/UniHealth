import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Head, router } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

export default function Error403() {
    // Automatically go back after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            router.visit(document.referrer || '/', { replace: true });
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title="403 Forbidden" />
            <div className="flex min-h-screen items-center justify-center bg-background p-6">
                <Card className="max-w-md text-center shadow-lg">
                    <CardContent className="p-8">
                        <div className="flex flex-col items-center space-y-4">
                            <AlertTriangle className="h-12 w-12 text-destructive" />
                            <h1 className="text-2xl font-semibold">Access Denied</h1>
                            <p className="text-muted-foreground">You don’t have permission to view this page. Redirecting you back...</p>

                            <Button variant="outline" onClick={() => router.visit(document.referrer || '/', { replace: true })} className="mt-4">
                                Go Back Now
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
