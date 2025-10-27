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
                                    <Label>First Name</Label>
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
                                    <Label>Last Name</Label>
                                    <Input name="last_name" defaultValue={data?.last_name ?? ''} readOnly={isView} />
                                    <InputError message={errors.last_name} />
                                </div>

                                {/* Date of Birth */}
                                <div className="space-y-1">
                                    <Label>Date of Birth</Label>
                                    <Input type="date" name="date_of_birth" defaultValue={data?.date_of_birth ?? ''} readOnly={isView} />
                                    <InputError message={errors.date_of_birth} />
                                </div>

                                {/* Place of Birth */}
                                <div className="space-y-1">
                                    <Label>Place of Birth</Label>
                                    <Input name="place_of_birth" defaultValue={data?.place_of_birth ?? ''} readOnly={isView} />
                                    <InputError message={errors.place_of_birth} />
                                </div>

                                {/* Gender */}
                                <div className="space-y-1">
                                    <Label>Gender</Label>
                                    <Select name="gender" value={gender} onValueChange={setGender} disabled={isView}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.gender} />
                                </div>

                                {/* Civil Status */}
                                <div className="space-y-1">
                                    <Label>Civil Status</Label>
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
                                    <Label>Nationality</Label>
                                    <Input name="nationality" defaultValue={data?.nationality ?? ''} readOnly={isView} />
                                    <InputError message={errors.nationality} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Address</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <Label>Region</Label>
                                    <Input readOnly value={psgc?.region.name ?? ''} />
                                    <input type="hidden" name="region" value={psgc?.region.name ?? ''} />
                                </div>

                                <div className="space-y-1">
                                    <Label>Province</Label>
                                    <Input readOnly value={psgc?.province.name ?? ''} />
                                    <input type="hidden" name="province" value={psgc?.province.name ?? ''} />
                                </div>

                                <div className="space-y-1">
                                    <Label>Municipality / City</Label>
                                    <Input readOnly value={psgc?.city_municipality.name ?? ''} />
                                    <input type="hidden" name="municipality_city" value={psgc?.city_municipality.name ?? ''} />
                                </div>

                                <div className="space-y-1">
                                    <Label>Barangay</Label>
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
                                    <Label>Street</Label>
                                    <Input name="street" defaultValue={data?.street ?? ''} readOnly={isView} />
                                    <InputError message={errors.street} />
                                </div>

                                <div className="space-y-1">
                                    <Label>Postal Code</Label>
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
                                    <Label>Email</Label>
                                    <Input type="email" name="email" placeholder="example@gmail.com"defaultValue={data?.email ?? ''} readOnly={isView} />
                                    <InputError message={errors.email} />
                                </div>

                                <div>
                                    <Label>Mobile Number</Label>
                                    <Input type="tel" name="mobile_number" placeholder='09XXXXXXXXX' defaultValue={data?.mobile_number ?? ''} readOnly={isView} />
                                    <InputError message={errors.mobile_number} />
                                </div>

                                <div>
                                    <Label>Landline Number</Label>
                                    <Input type="tel" name="landline_number" placeholder='(XXX)XXX-XXXX' defaultValue={data?.landline_number ?? ''} readOnly={isView} />
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
                                    <Label>Name</Label>
                                    <Input name="emergency_contact_name" defaultValue={data?.emergency_contact_name ?? ''} readOnly={isView} />
                                    <InputError message={errors.emergency_contact_name} />
                                </div>

                                <div>
                                    <Label>Relationship</Label>
                                    <Input
                                        name="emergency_contact_relationship"
                                        defaultValue={data?.emergency_contact_relationship ?? ''}
                                        readOnly={isView}
                                    />
                                    <InputError message={errors.emergency_contact_relationship} />
                                </div>

                                <div>
                                    <Label>Contact Number</Label>
                                    <Input name="emergency_contact_number" defaultValue={data?.emergency_contact_number ?? ''} readOnly={isView} />
                                    <InputError message={errors.emergency_contact_number} />
                                </div>

                                <div className="md:col-span-2">
                                    <Label>Address</Label>
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
                            <Label className="flex items-center gap-2 text-sm font-medium">
                                <Input
                                    type="checkbox"
                                    name="data_privacy_consent"
                                    value="1"
                                    defaultChecked={!!data?.data_privacy_consent}
                                    className="h-4 w-4 rounded"
                                />
                                <span>Data Privacy Consent</span>
                                {data?.data_privacy_consent_date && (
                                    <span className="ml-2 text-xs text-muted-foreground">({data.data_privacy_consent_date})</span>
                                )}
                                <InputError className="ml-2" message={errors['data_privacy_consent']} />
                            </Label>

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
