// ============================================
// CURRENCY FORMATTING
// ============================================

/**
 * Format currency in Malawian Kwacha (MWK)
 * @example formatCurrency(1250000) // "MWK 1,250,000"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-MW', {
    style: 'currency',
    currency: 'MWK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format currency for charts (MWK with K shorthand)
 * @example formatShortCurrency(1250000) // "K1.3M"
 * @example formatShortCurrency(125000) // "K125k"
 * @example formatShortCurrency(12500) // "K12,500"
 */
export function formatShortCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    return `K${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `K${(amount / 1_000).toFixed(0)}k`;
  }
  return `K${amount.toLocaleString()}`;
}

/**
 * Format currency without currency symbol (for tables)
 * @example formatCurrencyValue(1250000) // "1,250,000"
 */
export function formatCurrencyValue(amount: number): string {
  return amount.toLocaleString();
}

// ============================================
// DATE & TIME FORMATTING
// ============================================

/**
 * Format date as "DD MMM YYYY"
 * @example formatDate('2024-12-25') // "25 Dec 2024"
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid date';
  
  return d.toLocaleDateString('en-MW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date as "DD MMM YYYY, HH:MM"
 * @example formatDateTime('2024-12-25T14:30:00') // "25 Dec 2024, 14:30"
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid date';
  
  return d.toLocaleString('en-MW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format date as "December 25, 2024" (long format)
 */
export function formatDateLong(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid date';
  
  return d.toLocaleDateString('en-MW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format time as "14:30"
 */
export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid time';
  
  return d.toLocaleTimeString('en-MW', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format relative time (e.g., "2 hours ago", "just now")
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid date';
  
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  return formatDate(d);
}

// ============================================
// DURATION FORMATTING
// ============================================

/**
 * Format uptime in seconds to human readable string
 * @example formatUptime(90061) // "1d 1h"
 * @example formatUptime(3665) // "1h 1m"
 * @example formatUptime(125) // "2m 5s"
 * @example formatUptime(45) // "45s"
 */
export function formatUptime(seconds: number): string {
  if (seconds < 0) return '0s';
  if (seconds < 60) return `${seconds}s`;
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (days > 0) {
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  }
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  if (minutes > 0) {
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
  }
  return `${secs}s`;
}

/**
 * Format duration in milliseconds (for charts/timelines)
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return formatUptime(Math.floor(ms / 1000));
}

// ============================================
// BYTES FORMATTING
// ============================================

/**
 * Format bytes to human readable string
 * @example formatBytes(1024) // "1 KB"
 * @example formatBytes(1048576) // "1 MB"
 * @example formatBytes(1073741824) // "1 GB"
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// ============================================
// PHONE NUMBER FORMATTING
// ============================================

/**
 * Format Malawian phone numbers
 * @example formatPhoneNumber("0999123456") // "0999 123 456"
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
}

// ============================================
// NUMBER FORMATTING
// ============================================

/**
 * Format number with thousand separators
 * @example formatNumber(1250000) // "1,250,000"
 */
export function formatNumber(value: number): string {
  return value.toLocaleString();
}

/**
 * Format percentage
 * @example formatPercentage(45, 200) // "22.5%"
 */
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}

/**
 * Format decimal with specified precision
 */
export function formatDecimal(value: number, precision: number = 2): string {
  return value.toFixed(precision);
}

/**
 * Format as ordinal number (1st, 2nd, 3rd, 4th)
 */
export function formatOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ============================================
// TEXT FORMATTING
// ============================================

/**
 * Truncate text to max length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Capitalize first letter of a string
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to title case
 * @example toTitleCase("hello world") // "Hello World"
 */
export function toTitleCase(str: string): string {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Convert string to sentence case
 * @example toSentenceCase("HELLO WORLD") // "Hello world"
 */
export function toSentenceCase(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to kebab case (for URLs)
 * @example toKebabCase("Hello World") // "hello-world"
 */
export function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Convert string to snake case
 * @example toSnakeCase("Hello World") // "hello_world"
 */
export function toSnakeCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

// ============================================
// CARD/PAYMENT FORMATTING
// ============================================

/**
 * Mask credit card number (show only last 4 digits)
 * @example maskCardNumber("1234567812345678") // "**** **** **** 5678"
 */
export function maskCardNumber(cardNumber: string): string {
  if (!cardNumber) return '';
  const last4 = cardNumber.slice(-4);
  return `**** **** **** ${last4}`;
}

/**
 * Format card expiry (MM/YY)
 */
export function formatExpiry(month: string, year: string): string {
  return `${month.padStart(2, '0')}/${year.slice(-2)}`;
}

/**
 * Mask email address (show only first character and domain)
 * @example maskEmail("john.doe@example.com") // "j*****@example.com"
 */
export function maskEmail(email: string): string {
  if (!email) return '';
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) return email;
  const maskedLocal = localPart[0] + '*'.repeat(localPart.length - 2) + localPart.slice(-1);
  return `${maskedLocal}@${domain}`;
}

// ============================================
// ADDRESS FORMATTING
// ============================================

/**
 * Format address as "City, Country"
 */
export function formatLocation(city?: string, country?: string): string {
  if (!city && !country) return '';
  if (city && country) return `${city}, ${country}`;
  return city || country || '';
}

// ============================================
// RANGE FORMATTING
// ============================================

/**
 * Format price range
 * @example formatPriceRange(5000, 50000) // "K5,000 - K50,000"
 */
export function formatPriceRange(min: number, max: number): string {
  if (min === max) return formatCurrency(min);
  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
}

/**
 * Format date range
 */
export function formatDateRange(start: string | Date, end: string | Date): string {
  return `${formatDate(start)} - ${formatDate(end)}`;
}

// ============================================
// FLAG/COUNTRY FORMATTING
// ============================================

/**
 * Get currency symbol for a country code
 */
export function getCurrencySymbol(currencyCode: string = 'MWK'): string {
  const symbols: Record<string, string> = {
    MWK: 'K',
    USD: '$',
    EUR: '€',
    GBP: '£',
    ZAR: 'R',
  };
  return symbols[currencyCode] || currencyCode;
}

// ============================================
// FILE FORMATTING
// ============================================

/**
 * Format file size
 * @example formatFileSize(1048576) // "1.00 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}