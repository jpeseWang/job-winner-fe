import type { Job } from "@/types/interfaces";

export const formatNumberShort = (num: number): string => {
  if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'b';
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'm';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toString();
};

export const formatSalary = (salary?: Job["salary"]): string => {
  if (!salary || typeof salary !== "object") return "Not specified";
  if (salary.isNegotiable) return "Negotiable";

  let salaryString = "";
  if (salary.min) salaryString += `${formatNumberShort(salary.min)}`;
  if (salary.min && salary.max) salaryString += " - ";
  if (salary.max) salaryString += `${formatNumberShort(salary.max)}`;
  if (salary.currency) salaryString += ` ${salary.currency}`;
  if (salary.period) salaryString += ` per ${salary.period}`;

  return salaryString.trim() || "Not specified";
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

/**
 * Format currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Calculate days ago from date
 */
export const getDaysAgo = (dateString: string): number => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num)
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

/**
 * Extract initials from name
 */
export const getInitials = (name: string): string => {
  if (!name) return ""
  const names = name.split(" ")
  if (names.length === 1) return names[0].charAt(0).toUpperCase()
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
}
