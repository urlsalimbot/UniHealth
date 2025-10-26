import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Transition } from '@headlessui/react';
import { Form } from '@inertiajs/react';
import InputError from './input-error';
import { Label } from './ui/label';

type PatientFormData = {
    patient_id?: string;
    philhealth_id?: string;
    pwd_id?: string;
    senior_citizen_id?: string;
    last_name: string;
    first_name: string;
    middle_name?: string;
    suffix?: string;
    maiden_name?: string;
    nickname?: string;
    date_of_birth: string;
    place_of_birth?: string;
    gender?: string;
    civil_status?: string;
    nationality: string;
    religion?: string;
    mobile_number?: string;
    landline_number?: string;
    email?: string;
    house_number?: string;
    street?: string;
    barangay: string;
    municipality_city: string;
    province: string;
    region: string;
    postal_code?: string;
    emergency_contact_name?: string;
    emergency_contact_relationship?: string;
    emergency_contact_number?: string;
    emergency_contact_address?: string;
    data_privacy_consent?: boolean;
    data_privacy_consent_date?: string;
};

export default function PatientForm({ data = null, mode = 'create', token = '', ...Actions }: any) {
    const isView = mode === 'view';

    const renderInput = (
        name: keyof PatientFormData,
        label: string,
        errors: any,
        explicitType?: string,
        opts?: { textarea?: boolean; rows?: number },
    ) => {
        if (opts?.textarea || name === 'emergency_contact_address') {
            return (
                <div className="space-y-1">
                    <Label className="block text-sm font-medium">{label}</Label>
                    <Textarea defaultValue={(data?.[name] as any) ?? ''} name={name} readOnly={isView} rows={opts?.rows ?? 3} className="w-full" />
                    <InputError className="mt-2" message={errors[name]} />
                </div>
            );
        }

        const n = String(name).toLowerCase();
        const type =
            explicitType ||
            (n.includes('date')
                ? 'date'
                : n.includes('email')
                  ? 'email'
                  : n.includes('number') || n.includes('phone') || n.includes('mobile')
                    ? 'tel'
                    : 'text');

        return (
            <div className="space-y-1">
                <Label htmlFor={name} className="block text-sm font-medium">
                    {label}
                </Label>
                <Input id={name} name={name} type={type} defaultValue={data?.[name] ?? ''} readOnly={isView} />
                <InputError className="mt-2" message={errors[name]} />
            </div>
        );
    };

    const renderConsentCheckbox = (errors: any) => (
        <Label className="flex items-center gap-2 text-sm font-medium">
            <Input type="checkbox" defaultChecked={!!data?.data_privacy_consent} readOnly={isView} className="h-4 w-4 rounded" />
            <span>Data Privacy Consent</span>
            {data?.data_privacy_consent_date && <span className="ml-2 text-xs text-muted-foreground">({data.data_privacy_consent_date})</span>}
            <InputError className="ml-2" message={errors['data_privacy_consent']} />
        </Label>
    );

    return (
        <Form {...Actions} className="space-y-4">
            {({ processing, recentlySuccessful, errors }) => (
                <>
                    {/* 3-column grid layout for cards */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
                        <input type="hidden" name="token" value={token} />
                        {/* Personal Info */}
                        <Card className="flex flex-col">
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {renderInput('first_name', 'First Name', errors)}
                                {renderInput('middle_name', 'Middle Name', errors)}
                                {renderInput('last_name', 'Last Name', errors)}
                                {renderInput('date_of_birth', 'Date of Birth', errors)}
                                {renderInput('place_of_birth', 'Place of Birth', errors)}
                                {renderInput('gender', 'Gender', errors)}
                                {renderInput('civil_status', 'Civil Status', errors)}
                                {renderInput('nationality', 'Nationality', errors)}
                            </CardContent>
                        </Card>

                        {/* Address */}
                        <Card className="flex flex-col">
                            <CardHeader>
                                <CardTitle>Address</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {renderInput('house_number', 'House Number', errors)}
                                {renderInput('street', 'Street', errors)}
                                {renderInput('barangay', 'Barangay', errors)}
                                {renderInput('municipality_city', 'Municipality / City', errors)}
                                {renderInput('province', 'Province', errors)}
                                {renderInput('region', 'Region', errors)}
                                {renderInput('postal_code', 'Postal Code', errors)}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Address + Emergency Contact Side by Side */}
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                        {/* Contact */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4">
                                {renderInput('email', 'Email', errors)}
                                {renderInput('mobile_number', 'Mobile Number', errors)}
                                {renderInput('landline_number', 'Landline Number', errors)}
                            </CardContent>
                        </Card>

                        {/* Identification */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Identification</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4">
                                {renderInput('philhealth_id', 'PhilHealth ID', errors)}
                                {renderInput('pwd_id', 'PWD ID', errors)}
                                {renderInput('senior_citizen_id', 'Senior Citizen ID', errors)}
                            </CardContent>
                        </Card>

                        {/* Emergency Contact */}
                        <Card className="flex flex-col">
                            <CardHeader>
                                <CardTitle>Emergency Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {renderInput('emergency_contact_name', 'Name', errors)}
                                {renderInput('emergency_contact_relationship', 'Relationship', errors)}
                                {renderInput('emergency_contact_number', 'Contact Number', errors)}
                                {renderInput('emergency_contact_address', 'Address', errors, undefined, { textarea: true })}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Submit + Consent Inline */}
                    {!isView && (
                        <div className="flex flex-col items-start justify-between rounded-md sm:flex-row sm:items-center">
                            <Label className="flex items-center gap-2 text-sm font-medium">
                                <Input
                                    type="checkbox"
                                    name="data_privacy_consent" // ✅ REQUIRED for Laravel validation
                                    value="1" // ✅ ensures Laravel sees "on" or "1"
                                    defaultChecked={!!data?.data_privacy_consent}
                                    readOnly={isView}
                                    className="h-4 w-4 rounded"
                                />
                                <span>Data Privacy Consent</span>

                                {data?.data_privacy_consent_date && (
                                    <span className="ml-2 text-xs text-muted-foreground">({data.data_privacy_consent_date})</span>
                                )}

                                <InputError className="ml-2" message={errors['data_privacy_consent']} />
                            </Label>{' '}
                            <div className="flex items-center gap-3">
                                <Button className="px-8" disabled={processing}>
                                    {mode === 'edit' ? 'Update' : 'Submit and Save'}
                                </Button>
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-muted-foreground">Saved</p>
                                </Transition>
                            </div>
                        </div>
                    )}
                </>
            )}
        </Form>
    );
}
