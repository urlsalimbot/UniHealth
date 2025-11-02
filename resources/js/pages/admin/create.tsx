import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, usePage, router } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import admin from '@/routes/admin';
import { LoaderCircle, Mail, UserCheck, Key } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User',
        href: admin.dashboard.url(),
    },
    {
        title: 'Create new User',
        href: admin.users.create.url(),
    },
];

export default function Create() {
    const [role, setRole] = useState<string>('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.warning) {
            toast.warning(flash.warning);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData(e.currentTarget);
        
        router.post(admin.users.store.url(), formData, {
            onSuccess: () => {
                setProcessing(false);
                // Success is handled by flash message effect
            },
            onError: (errors) => {
                setProcessing(false);
                setErrors(errors);
                toast.error('Please fix the errors in the form');
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />

            <div className="mx-auto mt-8 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5" />
                            Create New User Account
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Create a new user account. A temporary password will be automatically generated and sent to the user's email address.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input 
                                    id="name" 
                                    type="text" 
                                    required 
                                    autoFocus 
                                    tabIndex={1} 
                                    name="name" 
                                    placeholder="Enter the user's full name"
                                    disabled={processing}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="user@example.com"
                                    disabled={processing}
                                />
                                <InputError message={errors.email} />
                                <p className="text-xs text-muted-foreground mt-1">
                                    A temporary password will be sent to this email address
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="role">Role</Label>
                                <Select name="role" value={role} onValueChange={setRole} required disabled={processing}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="intake-staff">
                                            <div className="flex items-center gap-2">
                                                <UserCheck className="h-4 w-4" />
                                                Intake Staff
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="doctor">
                                            <div className="flex items-center gap-2">
                                                <UserCheck className="h-4 w-4" />
                                                Doctor
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="inventory-staff">
                                            <div className="flex items-center gap-2">
                                                <UserCheck className="h-4 w-4" />
                                                Inventory Staff
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <Key className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-blue-900 dark:text-blue-100">Password Information</h4>
                                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                            A secure temporary password will be automatically generated and sent to the user's email address upon successful account creation.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => window.history.back()}
                                    tabIndex={4}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" tabIndex={5} disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                    Create Account & Send Email
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
