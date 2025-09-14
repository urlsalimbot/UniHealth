import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type PatientFormProps = {
  data: {
    first_name: string
    last_name: string
    philhealth_id: string
  }
  setData?: (field: string, value: any) => void
  onSubmit?: (e: React.FormEvent) => void
  processing?: boolean
  errors?: Record<string, string>
  mode?: "create" | "edit" | "view"
}

export default function PatientForm({
  data,
  setData,
  onSubmit,
  processing = false,
  errors = {},
  mode = "create",
}: PatientFormProps) {
  const isView = mode === "view"

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-lg">
      <div>
        <label>First Name</label>
        <Input
          value={data.first_name}
          onChange={(e) => setData?.("first_name", e.target.value)}
          disabled={isView}
        />
        {errors.first_name && !isView && (
          <div className="text-red-500 text-sm">{errors.first_name}</div>
        )}
      </div>

      <div>
        <label>Last Name</label>
        <Input
          value={data.last_name}
          onChange={(e) => setData?.("last_name", e.target.value)}
          disabled={isView}
        />
        {errors.last_name && !isView && (
          <div className="text-red-500 text-sm">{errors.last_name}</div>
        )}
      </div>

      <div>
        <label>PhilHealth ID</label>
        <Input
          value={data.philhealth_id}
          onChange={(e) => setData?.("philhealth_id", e.target.value)}
          disabled={isView}
        />
        {errors.philhealth_id && !isView && (
          <div className="text-red-500 text-sm">{errors.philhealth_id}</div>
        )}
      </div>

      {!isView && (
        <Button type="submit" disabled={processing}>
          {mode === "edit" ? "Update" : "Save"}
        </Button>
      )}
    </form>
  )
}