import { Column } from "./table-list";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
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
  rowData?: T | null; // ✅ bisa null kalau tambah baru
  onSubmit?: (values: Partial<T>) => void;
}


export function DialogInput<T extends { id: number | string }>({
  title,
  desc,
  trigger,
  open,
  onOpenChange,
  columns,
  rowData,
  onSubmit,
}: DialogInputProps<T>) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const values: Partial<T> = {} as Partial<T>;

    columns.forEach((col) => {
      const value = formData.get(col.key as string);

      if (col.key === "highlight") {
        (values as any)[col.key] = value === "true";
      } else {
        (values as any)[col.key] = value || "";
      }
    });

    onSubmit?.(values);
    onOpenChange?.(false);
  };

  const isEdit = !!rowData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {desc && <DialogDescription>{desc}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {columns.map((col) => (
            <div className="grid gap-3" key={col.key as string}>
              <Label htmlFor={col.key as string}>{col.label}</Label>

              {col.key === "highlight" ? (
                <Select
                  defaultValue={
                    isEdit ? (rowData?.[col.key] ? "true" : "false") : undefined
                  }
                  name={col.key as string}
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
                  id={col.key as string}
                  name={col.key as string}
                  defaultValue={
                    isEdit ? String(rowData?.[col.key] ?? "") : undefined
                  }
                  placeholder={!isEdit ? `Masukkan ${col.label}` : undefined}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="cancel"
              type="button"
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default">
              {isEdit ? "Save Changes" : "Add z"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
