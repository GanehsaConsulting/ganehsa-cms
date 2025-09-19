"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { SelectComponent } from "@/components/ui/select";

// Import Jodit secara dinamis biar aman dari SSR
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const statusStyles: Record<string, string> = {
  draft: "text-white border border-yellow-900 bg-yellow-400/20",
  archive: "text-white border border-blue-900 bg-blue-400/20",
  publish: "text-white border border-green-900 bg-green-400/20 ",
};

interface InputWLabelProps {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: { label: string; value: string }[];
  value?: string; // ⬅️ controlled value
  onChange?: (val: string) => void; // ⬅️ handler
}

export function InputWithLabel({
  id,
  label,
  type,
  placeholder,
  options,
  value = "",
  onChange,
}: InputWLabelProps) {
  return (
    <div className="grid w-full items-center gap-3">
      <Label className="text-white" htmlFor={id}>
        {label}
      </Label>

      {/* text biasa */}
      {type === "text" && (
        <Input
          className="w-full"
          id={id}
          name={id}
          type="text"
          placeholder={placeholder}
          value={value} // ⬅️ pakai value
          onChange={(e) => onChange?.(e.target.value)} // ⬅️ update formData
        />
      )}

      {/* textarea pake Jodit */}
      {type === "textarea" && (
        <div className="rounded-secondary border bg-lightColor/50 dark:bg-darkColor/50 overflow-hidden">
          <JoditEditor
            value={value}
            onBlur={(newContent) => onChange?.(newContent)}
            onChange={() => {}}
            config={{
              readonly: false,
              placeholder: placeholder ?? "Tulis konten di sini...",
              height: 300,
            }}
          />
          <input type="hidden" name={id} value={value} />
        </div>
      )}

      {/* select handling */}
      {type === "select" &&
        options &&
        (id === "status" ? (
          <>
            <RadioGroup
              value={value}
              onValueChange={(val) => onChange?.(val)}
              className="flex gap-1 p-1 bg-darkColor/30 rounded-full w-fit"
            >
              {options.map((opt) => {
                const isActive = value === opt.value;
                return (
                  <Label
                    key={opt.value}
                    htmlFor={`${id}-${opt.value}`}
                    className="cursor-pointer text-sm font-semibold transition-all -ml-px first:ml-0"
                  >
                    <div
                      className={clsx(
                        "px-3 py-1 rounded-full border",
                        isActive
                          ? statusStyles[opt.value]
                          : "bg-gray-800/40 border-gray-700 text-gray-400 hover:bg-gray-700/40"
                      )}
                    >
                      <RadioGroupItem
                        value={opt.value}
                        id={`${id}-${opt.value}`}
                        className="hidden"
                      />
                      {opt.label}
                    </div>
                  </Label>
                );
              })}
            </RadioGroup>
            <input type="hidden" name={id} value={value} />
          </>
        ) : (
          <div className="w-full">
            <SelectComponent
              placeholder={placeholder ?? `Pilih ${label}`}
              options={options}
              value={value}
              onChange={(val) => onChange?.(val)}
              className="w-full"
            />
            <input type="hidden" name={id} value={value} />
          </div>
        ))}
    </div>
  );
}
