import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import usePsgcData from '@/hooks/use-psgc-data';
import { Transition } from '@headlessui/react';
import { Form } from '@inertiajs/react';
import { useState } from 'react';
import InputError from './input-error';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

function RequiredLabel({ children }: { children: React.ReactNode }) {
    return (
        <Label>
            {children}
            <span className="ml-0.5 text-red-500">*</span>
        </Label>
    );
}

export default function PatientForm({ data = null, mode = 'create', ...Actions }: any) {
    const isView = mode === 'view';

    const [gender, setGender] = useState<string>(data?.gender ?? '');
    const [civil, setCivil] = useState<string>(data?.civil_status ?? '');
    const [selectedBarangay, setSelectedBarangay] = useState(data?.barangay ?? '');

    const { psgc } = usePsgcData();

    return (
        <Form {...Actions} className="space-y-4">
            {({ processing, recentlySuccessful, errors }) => (
                <>
                    {/* Personal Info + Address */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
                        {/* Personal Info */}
                        <Card className="flex flex-col">
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* First Name */}
                                <div className="space-y-1">
                                    <RequiredLabel>First Name</RequiredLabel>
                                    <Input name="first_name" defaultValue={data?.first_name ?? ''} readOnly={isView} />
                                    <InputError message={errors.first_name} />
                                </div>

                                {/* Middle Name */}
                                <div className="space-y-1">
                                    <Label>Middle Name</Label>
                                    <Input name="middle_name" defaultValue={data?.middle_name ?? ''} readOnly={isView} />
                                    <InputError message={errors.middle_name} />
                                </div>

                                {/* Last Name */}
                                <div className="space-y-1">
                                    <RequiredLabel>Last Name</RequiredLabel>
                                    <Input name="last_name" defaultValue={data?.last_name ?? ''} readOnly={isView} />
                                    <InputError message={errors.last_name} />
                                </div>

                                {/* Date of Birth */}
                                <div className="space-y-1">
                                    <RequiredLabel>Date of Birth</RequiredLabel>
                                    <Input type="date" name="date_of_birth" defaultValue={data?.date_of_birth ?? ''} readOnly={isView} />
                                    <InputError message={errors.date_of_birth} />
                                </div>

                                {/* Place of Birth */}
                                <div className="space-y-1">
                                    <RequiredLabel>Place of Birth</RequiredLabel>
                                    <Input name="place_of_birth" defaultValue={data?.place_of_birth ?? ''} readOnly={isView} />
                                    <InputError message={errors.place_of_birth} />
                                </div>

                                {/* Gender */}
                                <div className="space-y-1">
                                    <RequiredLabel>Gender</RequiredLabel>
                                    <Select name="gender" value={gender} onValueChange={setGender} disabled={isView}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.gender} />
                                </div>

                                {/* Civil Status */}
                                <div className="space-y-1">
                                    <RequiredLabel>Civil Status</RequiredLabel>
                                    <Select name="civil_status" value={civil} onValueChange={setCivil} disabled={isView}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Civil Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Single">Single</SelectItem>
                                            <SelectItem value="Married">Married</SelectItem>
                                            <SelectItem value="Widowed">Widowed</SelectItem>
                                            <SelectItem value="Annulled">Annulled</SelectItem>
                                            <SelectItem value="Legally Separated">Legally Separated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.civil_status} />
                                </div>

                                {/* Nationality */}
                                <div className="space-y-1">
                                    <RequiredLabel>Nationality</RequiredLabel>
                                    <Input name="nationality" defaultValue={data?.nationality ?? ''} readOnly={isView} />
                                    <InputError message={errors.nationality} />
                                </div>

                                {/* Maiden Name */}
                                <div className="space-y-1">
                                    <Label>Maiden Name</Label>
                                    <Input name="maiden_name" defaultValue={data?.maiden_name ?? ''} readOnly={isView} />
                                    <InputError message={errors.maiden_name} />
                                </div>

                                {/* Nickname */}
                                <div className="space-y-1">
                                    <Label>Nickname</Label>
                                    <Input name="nickname" defaultValue={data?.nickname ?? ''} readOnly={isView} />
                                    <InputError message={errors.nickname} />
                                </div>

                                {/* Religion */}
                                <div className="space-y-1">
                                    <Label>Religion</Label>
                                    <Input name="religion" defaultValue={data?.religion ?? ''} readOnly={isView} />
                                    <InputError message={errors.religion} />
                                </div>

                                {/* is_active */}
                                <div className="space-y-1 flex items-center gap-2">
                                    <Label htmlFor="is_active">Active</Label>
                                    <Input
                                        type="checkbox"
                                        id="is_active"
                                        name="is_active"
                                        disabled={isView}
                                        defaultChecked={!!data?.is_active}
                                        aria-label="Active"
                                        className="h-4 w-4 rounded"
                                    />
                                </div>
                            </CardContent>

                            {/* --- End ISO/PH additions --- */}
                        </Card>

                        {/* Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Address</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <RequiredLabel>Region</RequiredLabel>
                                    <Input readOnly value={psgc?.region.name ?? ''} />
                                    <input type="hidden" name="region" value={psgc?.region.name ?? ''} />
                                </div>

                                <div className="space-y-1">
                                    <RequiredLabel>Province</RequiredLabel>
                                    <Input readOnly value={psgc?.province.name ?? ''} />
                                    <input type="hidden" name="province" value={psgc?.province.name ?? ''} />
                                </div>

                                <div className="space-y-1">
                                    <RequiredLabel>Municipality / City</RequiredLabel>
                                    <Input readOnly value={psgc?.city_municipality.name ?? ''} />
                                    <input type="hidden" name="municipality_city" value={psgc?.city_municipality.name ?? ''} />
                                </div>

                                <div className="space-y-1">
                                    <RequiredLabel>Barangay</RequiredLabel>
                                    <Select value={selectedBarangay} onValueChange={setSelectedBarangay} disabled={isView}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Barangay" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {psgc?.barangays.map((b) => (
                                                <SelectItem key={b.code} value={b.name}>
                                                    {b.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <input type="hidden" name="barangay" value={selectedBarangay} />
                                    <InputError message={errors.barangay} />
                                </div>

                                <div className="space-y-1">
                                    <Label>House Number</Label>
                                    <Input name="house_number" defaultValue={data?.house_number ?? ''} readOnly={isView} />
                                    <InputError message={errors.house_number} />
                                </div>

                                <div className="space-y-1">
                                    <RequiredLabel>Street</RequiredLabel>
                                    <Input name="street" defaultValue={data?.street ?? ''} readOnly={isView} />
                                    <InputError message={errors.street} />
                                </div>

                                <div className="space-y-1">
                                    <RequiredLabel>Postal Code</RequiredLabel>
                                    <Input readOnly value="3013" />
                                    <input type="hidden" name="postal_code" value="3013" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact + IDs + Emergency */}
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                        {/* Contact Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4">
                                <div>
                                    <RequiredLabel>Email</RequiredLabel>
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="example@gmail.com"
                                        defaultValue={data?.email ?? ''}
                                        readOnly={isView}
                                        aria-label="Email"
                                        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
                                        title="Enter a valid email address"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div>
                                    <RequiredLabel>Mobile Number</RequiredLabel>
                                    <Input
                                        type="tel"
                                        name="mobile_number"
                                        placeholder="09XXXXXXXXX"
                                        defaultValue={data?.mobile_number ?? ''}
                                        readOnly={isView}
                                        aria-label="Mobile Number"
                                        pattern="^09[0-9]{9}$"
                                        title="Enter a valid Philippine mobile number (e.g. 09123456789)"
                                    />
                                    <InputError message={errors.mobile_number} />
                                </div>

                                <div>
                                    <RequiredLabel>Landline Number</RequiredLabel>
                                    <Input
                                        type="tel"
                                        name="landline_number"
                                        placeholder="(02)123-4567"
                                        defaultValue={data?.landline_number ?? ''}
                                        readOnly={isView}
                                        aria-label="Landline Number"
                                        pattern="^(\(\d{2,4}\))?\d{3,4}-\d{4}$"
                                        title="Enter a valid landline number (e.g. (02)123-4567)"
                                    />
                                    <InputError message={errors.landline_number} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Identification */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Identification</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4">
                                <div>
                                    <Label>PhilHealth ID</Label>
                                    <Input name="philhealth_id" defaultValue={data?.philhealth_id ?? ''} readOnly={isView} />
                                    <InputError message={errors.philhealth_id} />
                                </div>

                                <div>
                                    <Label>PWD ID</Label>
                                    <Input name="pwd_id" defaultValue={data?.pwd_id ?? ''} readOnly={isView} />
                                    <InputError message={errors.pwd_id} />
                                </div>

                                <div>
                                    <Label>Senior Citizen ID</Label>
                                    <Input name="senior_citizen_id" defaultValue={data?.senior_citizen_id ?? ''} readOnly={isView} />
                                    <InputError message={errors.senior_citizen_id} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Emergency Contact */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Emergency Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <RequiredLabel>Name</RequiredLabel>
                                    <Input name="emergency_contact_name" defaultValue={data?.emergency_contact_name ?? ''} readOnly={isView} />
                                    <InputError message={errors.emergency_contact_name} />
                                </div>

                                <div>
                                    <RequiredLabel>Relationship</RequiredLabel>
                                    <Input
                                        name="emergency_contact_relationship"
                                        defaultValue={data?.emergency_contact_relationship ?? ''}
                                        readOnly={isView}
                                    />
                                    <InputError message={errors.emergency_contact_relationship} />
                                </div>

                                <div>
                                    <RequiredLabel>Contact Number</RequiredLabel>
                                    <Input name="emergency_contact_number" defaultValue={data?.emergency_contact_number ?? ''} readOnly={isView} />
                                    <InputError message={errors.emergency_contact_number} />
                                </div>

                                <div className="md:col-span-2">
                                    <RequiredLabel>Address</RequiredLabel>
                                    <Textarea
                                        name="emergency_contact_address"
                                        defaultValue={data?.emergency_contact_address ?? ''}
                                        readOnly={isView}
                                        rows={3}
                                    />
                                    <InputError message={errors.emergency_contact_address} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Consent + Submit */}
                    {!isView && (
                        <div className="flex flex-col items-start justify-between rounded-md sm:flex-row sm:items-center">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Input
                                    type="checkbox"
                                    name="data_privacy_consent"
                                    value="1"
                                    defaultChecked={!!data?.data_privacy_consent}
                                    className="h-4 w-4 rounded"
                                    aria-label="Data Privacy Consent"
                                />
                                <RequiredLabel>
                                    <span>Data Privacy Consent</span>
                                </RequiredLabel>
                                <span className="text-xs text-muted-foreground" title="Required under RA 10173 (Data Privacy Act)">[RA 10173]</span>
                                {data?.data_privacy_consent_date && (
                                    <span className="ml-2 text-xs text-muted-foreground">({data.data_privacy_consent_date})</span>
                                )}
                                <InputError className="ml-2" message={errors['data_privacy_consent']} />
                            </div>
                            {/* Signature Consent (ISO/DOH legal compliance) */}
                            <div className="flex items-center gap-2 mt-3">
                                <Label htmlFor="signature_consent">Signature Consent</Label>
                                <Input
                                    type="text"
                                    name="signature_consent"
                                    id="signature_consent"
                                    placeholder="Type your full name as e-signature"
                                    aria-label="Signature Consent"
                                    className="w-56"
                                    required={!isView}
                                    readOnly={isView}
                                />
                                <span className="text-xs text-muted-foreground" title="This serves as your electronic signature for legal compliance.">e-signature</span>
                                <InputError message={errors.signature_consent} />
                            </div>

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
