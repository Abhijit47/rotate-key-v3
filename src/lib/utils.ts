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
