// File: src/components/OptionCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

type OptionProps = {
  option: { id?: number; text: string; correct: boolean };
  submitted?: boolean;
  className?: string;
  onToggle?: () => void;
  editMode?: boolean;
};

export const OptionCard: React.FC<OptionProps> = ({
                                                    option,
                                                    className = "",
                                                    submitted = false,
                                                    onToggle,
  editMode = false,
                                                  }: OptionProps) => {
  const baseClasses = "p-4 m-2 rounded-lg shadow-md bg-white";
  let conditionalClasses = "";

  if (submitted || editMode) {
    conditionalClasses = option.correct
      ? "bg-green-500 ring-green-700"
      : "bg-red-500 ring-red-800";
  }

  return (
    <Card
      className={`${baseClasses} ${conditionalClasses} ${className}`}
      onClick={onToggle}
    >
      <CardContent>{option.text}</CardContent>
    </Card>
  );
};
