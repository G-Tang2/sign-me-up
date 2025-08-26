import { useState } from "react";
import FormInputField from "./FormInputField";
import clsx from "clsx";

type TimeProps = {
  leftValue: string;
  rightValue: string;
  leftOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

export default function Time({
  leftValue,
  rightValue,
  leftOnChange,
  rightOnChange,
  required = false,
}: TimeProps) {
  const [error, setError] = useState(false);

  const validateTime = (leftTime: string, rightTime: string): boolean => {
    const leftDate = new Date(`1970-01-01T${leftTime}`);
    const rightDate = new Date(`1970-01-01T${rightTime}`);
    return leftDate <= rightDate;
  };

  const handleLeftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    leftOnChange(e);
    if (rightValue) {
      const isValid = validateTime(e.target.value, rightValue);
      isValid ? setError(false) : setError(true);
      console.log(isValid)
    }
  };
  const handleRightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    rightOnChange(e);
    if (leftValue) {
      const isValid = validateTime(leftValue, e.target.value);
      isValid ? setError(false) : setError(true);
            console.log(isValid)
            console.log(error)
    }
  };

  return (
    <div className="flex gap-4">
      <div className="w-1/2">
        <FormInputField
          label="Start Time"
          type="time"
          value={leftValue}
          onChange={(e) => handleLeftChange(e as React.ChangeEvent<HTMLInputElement>)}
          required={required}
        />
      </div>
      <div className="w-1/2">
        <FormInputField
          label="End Time"
          type="time"
          className={clsx(
            "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1",
            {
              "border-red-500 focus:ring-red-500": error,
              "border-gray-300 focus:ring-blue-500": !error,
            }
          )}
          value={rightValue}
          onChange={(e) => handleRightChange(e as React.ChangeEvent<HTMLInputElement>)}
          required={required}
        />
        {error && <p className="text-xs text-red-500 mt-1">End time must be after start time</p>}
      </div>
    </div>
  );
}
