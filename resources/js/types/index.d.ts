import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface MedicalEncounter {
    encounter_id: string;

    patient_id: string;
    facility_id?: string | null;
    attending_provider_id?: string | null;

    encounter_type?: string | null;
    encounter_class?: string | null;
    chief_complaint?: string | null;

    encounter_date?: string; // ISO date string
    encounter_time?: string; // HH:mm:ss
    admission_date?: string | null;
    discharge_date?: string | null;

    case_rate_code?: string | null;
    drg_code?: string | null;
    encounter_status?: string | null;

    total_charges?: number | null;
    philhealth_claims?: number | null;
    patient_payment?: number | null;

    created_by?: string | null;
    created_at?: string; // timestamp
    updated_at?: string; // timestamp

    // Relations
    patient_prescriptions?: PatientPrescription[];
    vital_signs?: VitalSign[];
    patients?: Patient;
    healthcare_facilities?: HealthcareFacility;
}

export interface Medication {
    medication_id: string;

    generic_name: string;
    brand_names?: string | null;
    strength?: string | null;
    dosage_form?: string | null;
    drug_class?: string | null;
    controlled_substance?: boolean | null;
    fda_registration?: string | null;

    created_at?: string; // timestamp

    // Relations
    patient_prescriptions?: PatientPrescription[];
    facility_medication_inventory?: FacilityMedicationInventory[];
}

export interface Patient {
    patient_id: string;

    philhealth_id?: string | null;
    pwd_id?: string | null;
    senior_citizen_id?: string | null;

    last_name: string;
    first_name: string;
    middle_name?: string | null;
    suffix?: string | null;
    maiden_name?: string | null;
    nickname?: string | null;

    date_of_birth: string; // ISO date string
    place_of_birth?: string | null;
    gender?: string | null;
    civil_status?: string | null;
    nationality?: string | null;
    religion?: string | null;

    mobile_number?: string | null;
    landline_number?: string | null;
    email?: string | null;

    house_number?: string | null;
    street?: string | null;
    barangay?: string | null;
    municipality_city?: string | null;
    province?: string | null;
    region?: string | null;
    postal_code?: string | null;

    emergency_contact_name?: string | null;
    emergency_contact_relationship?: string | null;
    emergency_contact_number?: string | null;
    emergency_contact_address?: string | null;

    created_by?: string | null;
    updated_by?: string | null;

    is_active?: boolean;
    data_privacy_consent?: boolean;

    created_at?: string; // timestamp
    updated_at?: string; // timestamp

    // Relations
    medical_encounters?: MedicalEncounter[];
    patient_prescriptions?: PatientPrescription[];
    vital_signs?: VitalSign[];
    data_access_log?: DataAccessLog[];
    data_sharing_consent?: DataSharingConsent[];
}

export interface PatientPrescription {
    prescription_id: string;

    patient_id: string;
    encounter_id: string;
    medication_id: string;

    prescribing_provider_id?: string | null;

    dosage?: string | null;
    frequency?: string | null;
    route?: string | null;
    duration?: string | null;

    quantity_prescribed?: number | null;
    refills_allowed?: number | null;

    special_instructions?: string | null;
    indication?: string | null;

    prescription_date?: string; // ISO date (YYYY-MM-DD)
    start_date?: string | null;
    end_date?: string | null;

    prescription_status?: string | null;

    created_at?: string; // timestamp

    // Relations
    patient?: Patient;
    medical_encounter?: MedicalEncounter;
    medication?: Medication;
}

export interface VitalSign {
    vital_sign_id: string;

    patient_id: string;
    encounter_id?: string | null;
    recorded_by?: string | null;

    measurement_date: string; // YYYY-MM-DD
    measurement_time: string; // HH:mm:ss

    systolic_bp?: number | null;
    diastolic_bp?: number | null;
    heart_rate?: number | null;
    respiratory_rate?: number | null;
    temperature?: number | null;
    oxygen_saturation?: number | null;

    weight?: number | null;
    height?: number | null;
    bmi?: number | null;

    pain_score?: number | null;
    pain_location?: string | null;
    general_appearance?: string | null;
    mental_status?: string | null;

    bp_cuff_size?: string | null;
    thermometer_type?: string | null;

    created_at?: string; // timestamp

    // Relations
    patient?: Patient;
    medical_encounter?: MedicalEncounter;
}

export interface FacilityMedicationInventory {
    inventory_id: string;
    facility_id: string;
    medication_id: string;
    current_stock: number;
    minimum_stock_level: number;
    maximum_stock_level: number;
    reorder_point: number;
    lot_number: string;
    expiration_date: string; // could also be Date if parsed
    manufacturer_batch: string;
    unit_cost: number;
    total_value: number;
    storage_location: string;
    storage_conditions: string;
    storage_temperature_min: number;
    storage_temperature_max: number;
    supplier: string;
    purchase_order_number: string;
    received_date: string; // could also be Date
    received_by: string;
    stock_status: string;
    last_count_date: string; // could also be Date
    last_counted_by: string;
    expiry_alert_sent: boolean;
    low_stock_alert_sent: boolean;
    created_at: string; // could also be Date
}
