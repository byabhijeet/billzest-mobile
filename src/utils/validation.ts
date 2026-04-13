/**
 * Validation utilities for form inputs and data
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

/**
 * Validate phone number (flexible format)
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Allow various formats: +91 1234567890, 1234567890, (123) 456-7890, etc.
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  if (!phoneRegex.test(phone.trim())) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }

  return { isValid: true };
};

/**
 * Validate required field
 */
export const validateRequired = (value: string | number | null | undefined, fieldName: string): ValidationResult => {
  if (value === null || value === undefined || (typeof value === 'string' && !value.trim())) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true };
};

/**
 * Validate number (positive)
 */
export const validatePositiveNumber = (value: string | number, fieldName: string): ValidationResult => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }

  if (num < 0) {
    return { isValid: false, error: `${fieldName} must be positive` };
  }

  return { isValid: true };
};

/**
 * Validate GSTIN format (Indian GST)
 */
export const validateGSTIN = (gstin: string): ValidationResult => {
  if (!gstin.trim()) {
    return { isValid: true }; // GSTIN is optional
  }

  // GSTIN format: 15 characters, alphanumeric
  // Format: 2 digits (state code) + 10 characters (PAN) + 1 character (entity number) + 1 character (Z) + 1 character (check digit)
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
  if (!gstinRegex.test(gstin.trim())) {
    return { isValid: false, error: 'Invalid GSTIN format. Expected format: 27ABCDE1234F1Z5' };
  }

  return { isValid: true };
};

/**
 * Validate date range (end date after start date)
 */
export const validateDateRange = (
  startDate: Date | string,
  endDate: Date | string,
  fieldNames: { start: string; end: string } = { start: 'Start date', end: 'End date' }
): ValidationResult => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  if (isNaN(start.getTime())) {
    return { isValid: false, error: `${fieldNames.start} is invalid` };
  }

  if (isNaN(end.getTime())) {
    return { isValid: false, error: `${fieldNames.end} is invalid` };
  }

  if (end < start) {
    return { isValid: false, error: `${fieldNames.end} must be after ${fieldNames.start}` };
  }

  return { isValid: true };
};

/**
 * Validate date is not in the future (for invoices, purchases, etc.)
 */
export const validateDateNotFuture = (date: Date | string, fieldName: string = 'Date'): ValidationResult => {
  const dateValue = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateValue.getTime())) {
    return { isValid: false, error: `${fieldName} is invalid` };
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today

  if (dateValue > today) {
    return { isValid: false, error: `${fieldName} cannot be in the future` };
  }

  return { isValid: true };
};

/**
 * Validate stock quantity (non-negative integer)
 */
export const validateStock = (stock: string | number, fieldName: string = 'Stock'): ValidationResult => {
  const num = typeof stock === 'string' ? parseFloat(stock) : stock;

  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }

  if (num < 0) {
    return { isValid: false, error: `${fieldName} cannot be negative` };
  }

  if (!Number.isInteger(num)) {
    return { isValid: false, error: `${fieldName} must be a whole number` };
  }

  return { isValid: true };
};

/**
 * Validate price (positive number with max 2 decimals)
 */
export const validatePrice = (price: string | number, fieldName: string = 'Price'): ValidationResult => {
  const num = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }

  if (num < 0) {
    return { isValid: false, error: `${fieldName} must be positive` };
  }

  // Check decimal places
  if (typeof price === 'string') {
    const decimalParts = price.split('.');
    if (decimalParts.length > 1 && decimalParts[1].length > 2) {
      return { isValid: false, error: `${fieldName} can have maximum 2 decimal places` };
    }
  }

  return { isValid: true };
};

/**
 * Validate invoice due date is after issue date
 */
export const validateInvoiceDates = (
  issueDate: Date | string,
  dueDate: Date | string
): ValidationResult => {
  return validateDateRange(issueDate, dueDate, {
    start: 'Issue date',
    end: 'Due date',
  });
};

/**
 * Validate multiple fields at once
 */
export const validateFields = (
  validations: Array<ValidationResult>
): ValidationResult => {
  const firstError = validations.find(v => !v.isValid);
  return firstError || { isValid: true };
};

