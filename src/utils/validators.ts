/**
 * Common validation utilities for forms
 */

export const validators = {
  /**
   * Validate required field
   */
  required: (value: string | null | undefined, fieldName: string): string | null => {
    if (!value || !value.trim()) {
      return `${fieldName} is required`;
    }
    return null;
  },

  /**
   * Validate minimum length
   */
  minLength: (value: string, min: number, fieldName: string): string | null => {
    if (value.trim().length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return null;
  },

  /**
   * Validate maximum length
   */
  maxLength: (value: string, max: number, fieldName: string): string | null => {
    if (value.trim().length > max) {
      return `${fieldName} must not exceed ${max} characters`;
    }
    return null;
  },

  /**
   * Validate email format
   */
  email: (value: string): string | null => {
    if (!value.trim()) return null; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  /**
   * Validate Indian phone number (10 digits, starting with 6-9)
   */
  phone: (value: string): string | null => {
    if (!value.trim()) return null; // Optional field
    const phoneDigits = value.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      return 'Phone number must be exactly 10 digits';
    }
    if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
      return 'Please enter a valid Indian mobile number';
    }
    return null;
  },

  /**
   * Validate positive number
   */
  positiveNumber: (value: string | number, fieldName: string): string | null => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num) || num < 0) {
      return `${fieldName} must be a positive number`;
    }
    return null;
  },

  /**
   * Validate non-negative number (allows zero)
   */
  nonNegativeNumber: (value: string | number, fieldName: string): string | null => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num) || num < 0) {
      return `${fieldName} must be zero or greater`;
    }
    return null;
  },

  /**
   * Validate integer
   */
  integer: (value: string | number, fieldName: string): string | null => {
    const num = typeof value === 'string' ? parseInt(value, 10) : value;
    if (isNaN(num) || !Number.isInteger(num)) {
      return `${fieldName} must be a whole number`;
    }
    return null;
  },

  /**
   * Validate date is not in the future
   */
  notFuture: (dateString: string, fieldName: string): string | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    if (date > today) {
      return `${fieldName} cannot be in the future`;
    }
    return null;
  },

  /**
   * Validate date is not in the past
   */
  notPast: (dateString: string, fieldName: string): string | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    if (date < today) {
      return `${fieldName} cannot be in the past`;
    }
    return null;
  },

  /**
   * Validate due date is after issue date
   */
  dueDateAfterIssue: (dueDate: string, issueDate: string): string | null => {
    if (!dueDate || !issueDate) return null;
    const due = new Date(dueDate);
    const issue = new Date(issueDate);
    if (due < issue) {
      return 'Due date must be on or after issue date';
    }
    return null;
  },

  /**
   * Validate payment amount doesn't exceed invoice total
   */
  paymentAmount: (amount: number, maxAmount: number): string | null => {
    if (amount <= 0) {
      return 'Payment amount must be greater than zero';
    }
    if (amount > maxAmount) {
      return `Payment amount cannot exceed ${maxAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`;
    }
    return null;
  },

  /**
   * Validate stock quantity (non-negative integer)
   */
  stock: (value: string | number, fieldName: string = 'Stock'): string | null => {
    const num = typeof value === 'string' ? parseInt(value, 10) : value;
    if (isNaN(num) || !Number.isInteger(num)) {
      return `${fieldName} must be a whole number`;
    }
    if (num < 0) {
      return `${fieldName} cannot be negative`;
    }
    return null;
  },

  /**
   * Validate SKU format (alphanumeric, dashes, underscores)
   */
  sku: (value: string): string | null => {
    if (!value.trim()) return null; // Optional
    const skuRegex = /^[A-Za-z0-9_-]+$/;
    if (!skuRegex.test(value)) {
      return 'SKU can only contain letters, numbers, dashes, and underscores';
    }
    return null;
  },

  /**
   * Validate barcode format (alphanumeric, typically 8-13 digits for EAN/UPC)
   */
  barcode: (value: string): string | null => {
    if (!value.trim()) return null; // Optional
    const barcodeRegex = /^[0-9]{8,13}$/;
    if (!barcodeRegex.test(value)) {
      return 'Barcode must be 8-13 digits';
    }
    return null;
  },
};

/**
 * Helper to run multiple validators and collect errors
 */
export const validate = (
  value: any,
  validators: Array<(value: any) => string | null>
): string | null => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};

