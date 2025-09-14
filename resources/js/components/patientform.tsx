import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type PatientFormData = {
  patient_id?: string
  philhealth_id?: string
  pwd_id?: string
  senior_citizen_id?: string
  last_name: string
  first_name: string
  middle_name?: string
  suffix?: string
  maiden_name?: string
  nickname?: string
  date_of_birth: string
  place_of_birth?: string
  gender?: string
  civil_status?: string
  nationality?: string
  religion?: string
  mobile_number?: string
  landline_number?: string
  email?: string
  house_number?: string
  street?: string
  barangay: string
  municipality_city: string
  province: string
  region: string
  postal_code?: string
  emergency_contact_name?: string
  emergency_contact_relationship?: string
  emergency_contact_number?: string
  emergency_contact_address?: string
  is_active?: boolean
  data_privacy_consent?: boolean
  data_privacy_consent_date?: string
}

type PatientFormProps = {
  data: Partial<PatientFormData>
  setData?: (field: keyof PatientFormData, value: any) => void
  onSubmit?: (e: React.FormEvent) => void
  processing?: boolean
  errors?: Partial<Record<keyof PatientFormData, string>>
  mode?: "create" | "edit" | "view"
}

/**
 * Smart PatientForm that correctly renders boolean fields as checkboxes,
 * dates as date inputs, textarea for long text, and defaults boolean values to false.
 */
export default function PatientForm({
  data,
  setData,
  onSubmit,
  processing = false,
  errors = {},
  mode = "create",
}: PatientFormProps) {
  const isView = mode === "view"

  // Explicit list of boolean fields (keeps behavior deterministic)
  const booleanFields = new Set<keyof PatientFormData>([
    "is_active",
    "data_privacy_consent",
  ])

  // Helper to decide if a field should be boolean
  const isBooleanField = (name: keyof PatientFormData) =>
    booleanFields.has(name) ||
    typeof data[name] === "boolean" ||
    String(name).startsWith("is_") ||
    String(name).toLowerCase().includes("consent")

  // Helper to pick input type heuristically
  const getInputType = (name: keyof PatientFormData, explicitType?: string) => {
    if (explicitType) return explicitType
    const n = String(name).toLowerCase()
    if (n.includes("date") && !n.includes("of_birth")) return "date"
    if (n === "date_of_birth" || n.endsWith("_date")) return "date"
    if (n.includes("email")) return "email"
    if (n.includes("postal") || n.includes("zipcode")) return "text"
    if (n.includes("number") || n.includes("phone") || n.includes("mobile")) return "tel"
    return "text"
  }

  const renderInput = (
    name: keyof PatientFormData,
    label: string,
    explicitType?: string,
    opts?: { textarea?: boolean; cols?: number; rows?: number }
  ) => {
    // boolean checkbox
    if (isBooleanField(name)) {
      const checked = !!data[name] // default false if undefined
      return (
        <div className="flex items-start gap-3 rounded-md border p-3">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setData?.(name, e.target.checked)}
            disabled={isView}
            className="h-5 w-5 rounded"
            aria-label={label}
          />
          <div className="flex-1">
            <label className="block text-sm font-medium">{label}</label>
            {errors[name] && !isView && (
              <p className="text-sm text-red-500 mt-1">{errors[name]}</p>
            )}
            {name === "data_privacy_consent" && typeof data["data_privacy_consent_date"] !== "undefined" && (
              <p className="text-xs text-muted-foreground mt-1">
                Consent date: {String(data["data_privacy_consent_date"] ?? "—")}
              </p>
            )}
          </div>
        </div>
      )
    }

    // textarea for long text (e.g. emergency_contact_address)
    if (opts?.textarea || name === "emergency_contact_address") {
      return (
        <div className="space-y-1">
          <label className="block text-sm font-medium">{label}</label>
          <textarea
            value={(data[name] as any) ?? ""}
            onChange={(e) => setData?.(name, e.target.value)}
            disabled={isView}
            rows={opts?.rows ?? 3}
            className="w-full rounded-md p-2 focus:ring-2 "
          />
          {errors[name] && !isView && <p className="text-sm text-red-500">{errors[name]}</p>}
        </div>
      )
    }

    // default text/date/email/tel inputs
    const type = getInputType(name, explicitType)
    const rawValue = data[name]
    const value = rawValue === undefined || rawValue === null ? "" : String(rawValue)

    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium">{label}</label>
        <Input
          type={type}
          value={value}
          onChange={(e) => {
            const v = e.target.value
            // try to keep date values as-is; other casts can be done in controller
            setData?.(name, v)
          }}
          disabled={isView}
          className="w-full rounded-md"
        />
        {errors[name] && !isView && <p className="text-sm text-red-500">{errors[name]}</p>}
      </div>
    )
  }

    return (
        <form onSubmit={onSubmit} className=" space-y-6 rounded-lg">

            {/* Name row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {renderInput('first_name', 'First Name')}
                {renderInput('middle_name', 'Middle Name')}
                {renderInput('last_name', 'Last Name')}
            </div>

            {/* IDs row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {renderInput('philhealth_id', 'PhilHealth ID')}
                {renderInput('pwd_id', 'PWD ID')}
                {renderInput('senior_citizen_id', 'Senior Citizen ID')}
            </div>

            {/* Birth info row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {renderInput('date_of_birth', 'Date of Birth', 'date')}
                {renderInput('place_of_birth', 'Place of Birth')}
            </div>

            {/* Demographics row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {renderInput('gender', 'Gender')}
                {renderInput('civil_status', 'Civil Status')}
            </div>

            {/* Contact row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {renderInput('email', 'Email', 'email')}
                {renderInput('mobile_number', 'Mobile Number')}
                {renderInput('landline_number', 'Landline Number')}
            </div>

            {/* Address block */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {renderInput('barangay', 'Barangay')}
                {renderInput('municipality_city', 'Municipality / City')}
                {renderInput('province', 'Province')}
                {renderInput('region', 'Region')}
            </div>

            {/* Emergency contact block */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {renderInput('emergency_contact_name', 'Emergency Contact Name')}
                {renderInput('emergency_contact_relationship', 'Relationship')}
                {renderInput('emergency_contact_number', 'Contact Number')}
                {renderInput('emergency_contact_address', 'Address')}
            </div>

            {/* Boolean flags */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {renderInput('is_active', 'Is Active')}
                {renderInput('data_privacy_consent', 'Data Privacy Consent')}
            </div>

            {!isView && (
                <div className="flex justify-end">
                    <Button type="submit" disabled={processing} className="rounded-md ">
                        {mode === 'edit' ? 'Update' : 'Save'}
                    </Button>
                </div>
            )}
        </form>
    );
}
