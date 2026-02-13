import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parse } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a time string or Date object to HH:mm format
 * Handles various input formats and returns consistent output
 */
export function formatTime(time: string | Date | null | undefined): string {
  if (!time) return '--:--';
  
  try {
    if (typeof time === 'string') {
      // If it's already in HH:mm format, return it
      if (/^\d{2}:\d{2}$/.test(time)) {
        return time;
      }
      // If it's an ISO string, parse and format
      const date = new Date(time);
      if (!isNaN(date.getTime())) {
        return format(date, 'HH:mm');
      }
    } else if (time instanceof Date && !isNaN(time.getTime())) {
      return format(time, 'HH:mm');
    }
    return '--:--';
  } catch (error) {
    console.error('Error formatting time:', error);
    return '--:--';
  }
}

/**
 * Format a time to 12-hour format with AM/PM
 */
export function formatTime12Hour(time: string | Date | null | undefined): string {
  if (!time) return '--:-- --';
  
  try {
    if (typeof time === 'string') {
      if (/^\d{2}:\d{2}$/.test(time)) {
        const date = parse(time, 'HH:mm', new Date());
        return format(date, 'hh:mm a');
      }
      const date = new Date(time);
      if (!isNaN(date.getTime())) {
        return format(date, 'hh:mm a');
      }
    } else if (time instanceof Date && !isNaN(time.getTime())) {
      return format(time, 'hh:mm a');
    }
    return '--:-- --';
  } catch (error) {
    console.error('Error formatting time:', error);
    return '--:-- --';
  }
}

/**
 * Convert time string (HH:mm) to Date object for database storage
 * Uses a fixed date (1970-01-01) as PostgreSQL Time type only stores time
 */
export function timeStringToDate(timeStr: string): Date {
  if (!timeStr || !/^\d{2}:\d{2}$/.test(timeStr)) {
    throw new Error('Invalid time format. Expected HH:mm');
  }
  return new Date(`1970-01-01T${timeStr}:00Z`);
}

/**
 * Extract time string (HH:mm) from a Date object
 */
export function dateToTimeString(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return '--:--';
    }
    return format(dateObj, 'HH:mm');
  } catch (error) {
    console.error('Error extracting time:', error);
    return '--:--';
  }
}

/**
 * Validate that end time is after start time
 */
export function validateTimeRange(startTime: string, endTime: string): boolean {
  try {
    const start = parse(startTime, 'HH:mm', new Date());
    const end = parse(endTime, 'HH:mm', new Date());
    return end > start;
  } catch {
    return false;
  }
}

/**
 * Calculate duration between two times in hours
 */
export function calculateDuration(startTime: string, endTime: string): number {
  try {
    const start = parse(startTime, 'HH:mm', new Date());
    const end = parse(endTime, 'HH:mm', new Date());
    const diffMs = end.getTime() - start.getTime();
    return diffMs / (1000 * 60 * 60); // Convert to hours
  } catch {
    return 0;
  }
}
