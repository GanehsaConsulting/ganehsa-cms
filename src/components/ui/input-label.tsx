"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SelectComponent } from "@/components/ui/select"

interface InputWLabelProps {
  id: string
  label: string
  type: "text" | "textarea" | "select"
  placeholder?: string
  options?: { label: string; value: string }[]
}

export function InputWithLabel({
  id,
  label,
  type,
  placeholder,
  options,
}: InputWLabelProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label className="text-white" htmlFor={id}>{label}</Label>
      {type === "text" && (
        <Input id={id} name={id} type="text" placeholder={placeholder} />
      )}
      {type === "textarea" && (
        <Textarea id={id} name={id} placeholder={placeholder} />
      )}
      {type === "select" && options && (
        <SelectComponent
          placeholder={placeholder ?? "Pilih opsi"}
          options={options}
        />
      )}
    </div>
  )
}
