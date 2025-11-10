import { useState, useEffect } from "react";
import { Column } from "./table-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

interface DialogInputProps<T> {
  title: string;
  desc?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  columns: Column<T>[];
  rowData?: T | null;
  onSubmit?: (values: Partial<T>) => void;
}

export function DialogInput<T>({
  title,
  desc,
  trigger,
  open,
  onOpenChange,
  columns,
  rowData,
  onSubmit,
}: DialogInputProps<T>) {
  const isEdit = !!rowData;

  // Simpan value lokal form
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  // Saat edit, isi form dengan data awal
  useEffect(() => {
    if (rowData) {
      const initial = Object.fromEntries(
        Object.entries(rowData).map(([key, val]) => [key, String(val ?? "")])
      );
      setFormValues(initial);
    } else {
      setFormValues({});
    }
  }, [rowData]);

  // Fungsi generate slug dari name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // hapus karakter aneh
      .replace(/\s+/g, "-") // ganti spasi dengan dash
      .replace(/-+/g, "-"); // hapus dash ganda
  };

  // Replace the problematic useEffect with this:
  useEffect(() => {
    if (formValues.name && !isEdit) {
      const newSlug = generateSlug(formValues.name);
      if (formValues.slug !== newSlug) {
        setFormValues((prev) => ({
          ...prev,
          slug: newSlug,
        }));
      }
    }
  }, [formValues.name, formValues.slug, isEdit]);

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(formValues as Partial<T>);
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {desc && <DialogDescription>{desc}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {columns.map((col) => {
            const key = col.key as string;
            const value = formValues[key] ?? "";

            return (
              <div className="grid gap-3" key={key}>
                <Label htmlFor={key}>{col.label}</Label>

                {col.key === "highlight" ? (
                  <Select
                    value={value || undefined}
                    onValueChange={(val) => handleChange(key, val)}
                    name={key}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={key}
                    name={key}
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={!isEdit ? `Masukkan ${col.label}` : undefined}
                    disabled={key === "slug"} // slug auto generate
                  />
                )}
              </div>
            );
          })}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="cancel"
              type="button"
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default">
              {isEdit ? "Save Changes" : "+ Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
