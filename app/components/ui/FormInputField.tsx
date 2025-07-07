export default function InputField({
  label,
  type = "text",
  className = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500",
  placeholder,
  value,
  onChange,
  multiLine = false,
  required = false,
}: {
  label: string;
  type?: string;
  className?: string;
  placeholder?: string;
  value: string | number | undefined;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  multiLine?: boolean;
  step?: number;
  required?: boolean;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {multiLine ? (
        <textarea
          rows={4}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={className}
          required={required}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={className}
          required={required}
        />
      )}
    </div>
  );
}
