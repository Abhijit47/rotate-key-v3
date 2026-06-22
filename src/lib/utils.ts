import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatMarkdownText(text?: string): string {
  if (!text) return '';

  // Escaped Special Character
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&`#39`;');

  // Replace ***text*** with bold + italic
  let formatted = escaped.replace(
    /\*\*\*(.*?)\*\*\*/g,
    '<strong><em>$1</em></strong>',
  );

  // Replace **text** with bold
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Replace *text* with italic (if any single asterisks remain)
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

  return formatted;
}

export function generateBirthYears() {
  const startYear = 1970;
  const currentYear = new Date().getFullYear();
  const length = currentYear - startYear + 1;

  const years = Array.from({ length }, (_, i) => startYear + i);

  const formatter = new Intl.DateTimeFormat('en-US', { year: 'numeric' });
  const formattedYears = years.map((year) =>
    formatter.format(new Date(year, 0, 1)),
  );

  return formattedYears;
}
