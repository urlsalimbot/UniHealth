import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, QrCode } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function Register() {
    const [role, setRole] = useState<string>('user');
    const [patientId, setPatientId] = useState<string>('');
    const [scanError, setScanError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setScanError('');
        
        try {
            const scanner = new Html5Qrcode('qr-reader');
            const result = await scanner.scanFile(file, true);
            
            // Try to parse as JSON first (for structured QR codes)
            try {
                const parsed = JSON.parse(result);
                // If it's a patient QR code object, extract the id
                if (parsed.type === 'patient' && parsed.id) {
                    setPatientId(parsed.id);
                } else if (parsed.id) {
                    // Fallback to id field if type is not specified
                    setPatientId(parsed.id);
                } else {
                    // If JSON but no id field, use the raw result
                    setPatientId(result);
                }
            } catch (jsonError) {
                // Not JSON, treat as plain UUID string
                setPatientId(result);
            }
            
            setScanError('');
        } catch (err) {
            setScanError('Failed to read QR code from image. Please try another image.');
            console.error('QR Scanner Error:', err);
        }
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="patient_id">Patient UHID (UUID)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="patient_id"
                                        type="text"
                                        name="patient_id"
                                        placeholder="Scan QR or enter UUID"
                                        required
                                        value={patientId}
                                        onChange={(e) => setPatientId(e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="shrink-0"
                                    >
                                        <QrCode className="h-4 w-4" />
                                    </Button>
                                </div>
                                <InputError message={errors.patient_id} />
                                {scanError && <p className="text-sm text-destructive">{scanError}</p>}
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <div id="qr-reader" className="hidden"></div>

                            <Button type="submit" className="mt-2 w-full" tabIndex={5}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={6}>
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
