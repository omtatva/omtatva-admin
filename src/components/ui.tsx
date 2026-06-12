import { cn } from "@/lib/utils";

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
        {label}
      </span>
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
        props.className
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
        props.className
      )}
    />
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-zinc-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-zinc-600"
      />
      {label}
    </label>
  );
}

export function ImageUrlField({
  label = "Image",
  value,
  onChange,
  className,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <Field label={label} className={className}>
      <div className="flex gap-3">
        <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md border border-zinc-700 bg-zinc-800">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center px-1 text-center text-[10px] text-zinc-600">
              Preview
            </div>
          )}
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…"
          className="min-w-0 flex-1 text-xs"
        />
      </div>
    </Field>
  );
}

export function SectionMetaFields({
  value,
  onChange,
  showLink = true,
}: {
  value: {
    enabled: boolean;
    label: string;
    title: string;
    subtitle: string;
    linkText?: string;
    linkHref?: string;
  };
  onChange: (v: typeof value) => void;
  showLink?: boolean;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Checkbox
          label="Section visible on site"
          checked={value.enabled}
          onChange={(enabled) => onChange({ ...value, enabled })}
        />
      </div>
      <Field label="Eyebrow label">
        <Input value={value.label} onChange={(e) => onChange({ ...value, label: e.target.value })} />
      </Field>
      <Field label="Title">
        <Input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} />
      </Field>
      <Field label="Subtitle" className="sm:col-span-2">
        <Textarea
          rows={2}
          value={value.subtitle}
          onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
        />
      </Field>
      {showLink && (
        <>
          <Field label="Link text">
            <Input
              value={value.linkText ?? ""}
              onChange={(e) => onChange({ ...value, linkText: e.target.value })}
            />
          </Field>
          <Field label="Link URL">
            <Input
              value={value.linkHref ?? ""}
              onChange={(e) => onChange({ ...value, linkHref: e.target.value })}
            />
          </Field>
        </>
      )}
    </div>
  );
}
