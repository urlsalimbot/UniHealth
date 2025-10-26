import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import admin from '@/routes/admin';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';

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
    const [role, setRole] = useState<string>('staff');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />

            <Card className="mx-auto mt-8 max-w-xl">
                <CardHeader>
                    <CardTitle>Create New User</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...RegisteredUserController.store.form()} disableWhileProcessing className="flex flex-col gap-6">
                        {({ processing, errors }) => (
                            <>
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" type="text" required autoFocus tabIndex={1} name="name" placeholder="Full name" />
                                    <InputError message={errors.name} />
                                </div>

                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="email@example.com"
                                    />
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="role">Role</Label>
                                    <Select name="role" value={role} onValueChange={setRole} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="staff">Intake-Staff</SelectItem>
                                            <SelectItem value="doctor">Doctor</SelectItem>
                                            <SelectItem value="pharm">Pharmacist</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.role} />
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" className="mt-2 w-full" tabIndex={5}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Create account
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
