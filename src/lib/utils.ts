import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (number: string) => {
  const numStr = number.toString();

  if (!/^-?\d*\.?\d+$/.test(numStr)) {
    throw new Error("Invalid number format");
  }

  const [integerPart, decimalPart] = numStr.split(".");

  const isNegative = integerPart.startsWith("-");
  const absoluteInteger = isNegative ? integerPart.slice(1) : integerPart;

  const formattedInteger = absoluteInteger.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );

  let result = isNegative ? "-" : "";
  result += formattedInteger;
  if (decimalPart) {
    result += "." + decimalPart;
  }

  return result;
};

const formatToUnit = (number: number, unit: "B" | "T") => {
  const num = typeof number === "string" ? parseFloat(number) : number;

  if (isNaN(num)) {
    throw new Error("Invalid number format");
  }

  if (!["B", "T"].includes(unit)) {
    throw new Error('Unit must be either "B" (billions) or "T" (trillions)');
  }

  let result;
  switch (unit) {
    case "B":
      result = (num / 1000000000).toFixed(2);
      break;
    case "T":
      result = (num / 1000000000000).toFixed(2);
      break;
  }

  result = result.replace(/\.?0+$/, "");

  return `${result} ${unit === "B" ? "Billion" : "Trillion"}`;
};

export const toBillions = (number: number) => formatToUnit(number, "B");

export const toTrillions = (number: number) => formatToUnit(number, "T");
