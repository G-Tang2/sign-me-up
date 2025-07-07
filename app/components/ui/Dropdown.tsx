import React, { useState } from "react";

type Option = {
  value: number;
  label: string;
};

type DropdownProps = {
  options: Option[];
  selectedValue: number;
  onSelect: (value: number) => void;
};

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onSelect,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(Number(e.target.value));
  };

  return (
    <select
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      value={selectedValue}
      onChange={handleChange}
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
