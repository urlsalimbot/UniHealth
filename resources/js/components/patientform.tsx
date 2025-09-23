import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea, Transition } from '@headlessui/react';
import { Form } from '@inertiajs/react';
import InputError from './input-error';

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
    nationality?: string;
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
    is_active?: boolean;
    data_privacy_consent?: boolean;
    data_privacy_consent_date?: string;
};

type PatientFormBaseProps = {
    data?: Partial<PatientFormData> | null;
    mode?: 'create' | 'edit' | 'view';
};

type PatientFormProps<Action = {}> = PatientFormBaseProps & Action;

/**
 * Smart PatientForm that correctly renders boolean fields as checkboxes,
 * dates as date inputs, textarea for long text, and defaults boolean values to false.
 */
export default function PatientForm({ data = null, mode = 'create', ...Actions }: PatientFormProps) {
    const isView = mode === 'view';

    // Explicit list of boolean fields (keeps behavior deterministic)
    const booleanFields = new Set<keyof PatientFormData>(['is_active', 'data_privacy_consent']);

    // Decide if a field is boolean
    const isBooleanField = (name: keyof PatientFormData) =>
        booleanFields.has(name) ||
        typeof data?.[name] === 'boolean' || // null-safe
        String(name).startsWith('is_') ||
        String(name).toLowerCase().includes('consent');

    // Input type heuristic
    const getInputType = (name: keyof PatientFormData, explicitType?: string) => {
        if (explicitType) return explicitType;
        const n = String(name).toLowerCase();
        if (n.includes('date') && !n.includes('of_birth')) return 'date';
        if (n === 'date_of_birth' || n.endsWith('_date')) return 'date';
        if (n.includes('email')) return 'email';
        if (n.includes('postal') || n.includes('zipcode')) return 'text';
        if (n.includes('number') || n.includes('phone') || n.includes('mobile')) return 'tel';
        return 'text';
    };

    const renderInput = (
        name: keyof PatientFormData,
        label: string,
        errors: any,
        explicitType?: string,
        opts?: { textarea?: boolean; cols?: number; rows?: number },
    ) => {
        // ✅ Boolean checkbox
        if (isBooleanField(name)) {
            const checked = !!data?.[name]; // null-safe default false
            return (
                <div className="flex items-start gap-3 rounded-md border p-3">
                    <Input
                        type="checkbox"
                        defaultChecked={checked}
                        // onChange={(e) => Actions.setData?.(name, e.target.checked)}
                        readOnly={isView}
                        className="h-5 w-5 rounded"
                        aria-label={label}
                    />
                    <div className="flex-1">
                        <label className="block text-sm font-medium">{label}</label>
                        <InputError className="mt-2" message={errors[name]} />
                        {name === 'data_privacy_consent' && typeof data?.['data_privacy_consent_date'] !== 'undefined' && (
                            <p className="mt-1 text-xs text-muted-foreground">Consent date: {String(data?.['data_privacy_consent_date'] ?? '—')}</p>
                        )}
                    </div>
                </div>
            );
        }

        // ✅ Textarea for long text
        if (opts?.textarea || name === 'emergency_contact_address') {
            return (
                <div className="space-y-1">
                    <label className="block text-sm font-medium">{label}</label>
                    <Textarea
                        defaultValue={(data?.[name] as any) ?? ''} // null-safe fallback
                        // onChange={(e) => Actions.setData?.(name, e.target.value)}
                        readOnly={isView}
                        rows={opts?.rows ?? 3}
                        className="w-full rounded-md p-2 focus:ring-2"
                    />
                    <InputError className="mt-2" message={errors[name]} />
                </div>
            );
        }

        // ✅ Default text/date/email/tel inputs
        const type = getInputType(name, explicitType);
        const rawValue = data?.[name];
        const value = rawValue == null ? '' : String(rawValue);

        return (
            <div className="space-y-1">
                <label className="block text-sm font-medium">{label}</label>
                <Input id={name} type={type} defaultValue={value} name={name} placeholder={label} readOnly={isView} className="w-full rounded-md" />
                <InputError className="mt-2" message={errors[name]} />
            </div>
        );
    };
    // console.log({...Actions} )
    return (
        <Form {...Actions} className="space-y-6 rounded-lg">
            {({ processing, recentlySuccessful, errors }) => (
                <>
                    {/* Name row */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {renderInput('first_name', 'First Name', errors)}
                        {renderInput('middle_name', 'Middle Name', errors)}
                        {renderInput('last_name', 'Last Name', errors)}
                    </div>

                    {/* IDs row */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {renderInput('philhealth_id', 'PhilHealth ID', errors)}
                        {renderInput('pwd_id', 'PWD ID', errors)}
                        {renderInput('senior_citizen_id', 'Senior Citizen ID', errors)}
                    </div>

                    {/* Birth info row */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {renderInput('date_of_birth', 'Date of Birth', errors)}
                        {renderInput('place_of_birth', 'Place of Birth', errors)}
                    </div>

                    {/* Demographics row */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {renderInput('gender', 'Gender', errors)}
                        {renderInput('civil_status', 'Civil Status', errors)}
                    </div>

                    {/* Contact row */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {renderInput('email', 'Email', errors)}
                        {renderInput('mobile_number', 'Mobile Number', errors)}
                        {renderInput('landline_number', 'Landline Number', errors)}
                    </div>

                    {/* Address block */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {renderInput('barangay', 'Barangay', errors)}
                        {renderInput('municipality_city', 'Municipality / City', errors)}
                        {renderInput('province', 'Province', errors)}
                        {renderInput('region', 'Region', errors)}
                    </div>

                    {/* Emergency contact block */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {renderInput('emergency_contact_name', 'Emergency Contact Name', errors)}
                        {renderInput('emergency_contact_relationship', 'Relationship', errors)}
                        {renderInput('emergency_contact_number', 'Contact Number', errors)}
                        {renderInput('emergency_contact_address', 'Address', errors)}
                    </div>

                    {/* Boolean flags */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {renderInput('is_active', 'Is Active', errors)}
                        {renderInput('data_privacy_consent', 'Data Privacy Consent', errors)}
                    </div>

                    {!isView && (
                        <div className="flex justify-end">
                            <Button disabled={processing}> {mode === 'edit' ? 'Update' : 'Save'} </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    )}
                </>
            )}
        </Form>
    );
}
