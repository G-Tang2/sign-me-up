export default function FormInputSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="mb-4 flex items-center justify-between cursor-pointer">
      <span className="text-gray-700">{label}</span>
      <div className="ml-3 flex items-center">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={checked}
            onChange={onChange}
          />
          <div
            className={`block w-14 h-8 rounded-full ${
              checked ? "bg-blue-600" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
              checked ? "translate-x-6" : ""
            }`}
          ></div>
        </div>
        <span className="ml-3 text-gray-900">{checked ? "Yes" : "No"}</span>
      </div>
    </label>
  );
}
