"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ReactNode } from "react"
import { SelectComponent } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface Field {
  key: string
  label: string
  type: "text" | "textarea" | "select"
  placeholder?: string
  options?: { label: string; value: string }[]
}

interface ActionsDialogProps<T extends Record<string, unknown>> {
  trigger: ReactNode
  title?: string
  description?: string
  fields: Field[]
  defaultValues?: Partial<T>
  onSubmit?: (values: T) => void
}

export function ActionsDialog<T extends Record<string, unknown>>({
  trigger,
  title = "Tambah / Edit Data",
  description = "Lengkapi form di bawah ini.",
  fields,
  defaultValues = {},
  onSubmit,
}: ActionsDialogProps<T>) {
  const handleSubmit = (formData: FormData) => {
    const values = {} as T
    fields.forEach((f) => {
      values[f.key as keyof T] = formData.get(f.key) as T[keyof T]
    })
    onSubmit?.(values)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form action={(formData) => handleSubmit(formData)} className="grid gap-4">
          {fields.map((field) => (
            <div key={field.key} className="grid gap-3">
              <Label htmlFor={field.key}>{field.label}</Label>
              {field.type === "text" && (
                <Input
                  id={field.key}
                  name={field.key}
                  type="text"
                  placeholder={field.placeholder}
                  defaultValue={(defaultValues?.[field.key as keyof T] as string) ?? ""}
                />
              )}
              {field.type === "textarea" && (
                <Textarea
                  id={field.key}
                  name={field.key}
                  placeholder={field.placeholder}
                  defaultValue={(defaultValues?.[field.key as keyof T] as string) ?? ""}
                />
              )}
              {field.type === "select" && field.options && (
                <SelectComponent
                  placeholder={field.placeholder ?? "Pilih opsi"}
                  options={field.options}
                />
              )}
            </div>
          ))}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DialogClose>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
