import { z } from 'zod';

export const accountTypeSchema = z.object({
  accountType: z.enum(['MERCHANT', 'ORGANIZER', 'EMPLOYEE'], 'Please select an account type'),
});

export const businessDetailsSchema = z.object({
  businessName: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-&'.]+$/, 'Business name contains invalid characters'),

  registrationNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^[a-zA-Z0-9\-\/]+$/.test(val), 'Invalid registration number format'),

  taxId: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{6,15}$/.test(val), 'Invalid Tax ID format'),

  businessType: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return [
        'sole_proprietorship',
        'partnership',
        'limited_liability',
        'corporation',
        'non_profit',
        'government',
        'other',
      ].includes(val);
    }, 'Please select a valid business type'),

  website: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^https?:\/\/[\S]+$/.test(val),
      'Please enter a valid URL starting with http:// or https://'
    ),

  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters'),

  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters'),

  country: z.string().min(2, 'Country is required').default('Malawi'),

  postalCode: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{4,10}$/.test(val), 'Invalid postal code format'),
});

export const contactInfoSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .regex(/^[a-zA-Z\s\-']+$/, 'First name contains invalid characters'),

    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .regex(/^[a-zA-Z\s\-']+$/, 'Last name contains invalid characters'),

    email: z.string().email('Please enter a valid email address'),

    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must be less than 15 digits')
      .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const verificationCodeSchema = z.object({
  verificationCode: z
    .string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d+$/, 'Verification code must contain only numbers'),
});

export const registrationDataSchema = z.object({
  accountType: accountTypeSchema.shape.accountType,
  businessDetails: businessDetailsSchema,
  contactInfo: contactInfoSchema,
  verificationCode: verificationCodeSchema.shape.verificationCode,
});

export type AccountTypeValidation = z.infer<typeof accountTypeSchema>;
export type BusinessDetailsValidation = z.infer<typeof businessDetailsSchema>;
export type ContactInfoValidation = z.infer<typeof contactInfoSchema>;
export type VerificationCodeValidation = z.infer<typeof verificationCodeSchema>;
export type RegistrationDataValidation = z.infer<typeof registrationDataSchema>;
