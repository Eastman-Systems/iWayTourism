interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  options?: string[];
}

export default function FormField({
  label,
  type = 'text',
  value,
  onChange,
  required,
  placeholder,
  options,
}: FormFieldProps) {
  const id = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const base =
    'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    onChange(target.value);
  };

  return (
    <div>
      <label htmlFor={id} class="block text-sm font-medium text-slate-700">
        {label}
        {required && <span class="text-red-500"> *</span>}
      </label>
      {type === 'select' ? (
        <select id={id} value={value} onChange={handleInput} class={base}>
          <option value="">Select…</option>
          {options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onInput={handleInput}
          class={base}
          rows={3}
          placeholder={placeholder}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onInput={handleInput}
          class={base}
          required={required}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
