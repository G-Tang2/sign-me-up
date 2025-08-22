import { LucideIcon } from "lucide-react";
import React from "react";

interface LabelValueProps {
  icon: LucideIcon;
  value: string | number;
  align?: "left" | "right";
}

export const LabelValue: React.FC<LabelValueProps> = ({
  icon: Icon,
  value,
  align = "left",
}) => {
  return (
    <div
      className={`flex items-center space-x-2 ${
        align === "right" ? "justify-end" : "justify-start"
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="leading-5">{value}</span>
    </div>
  );
};