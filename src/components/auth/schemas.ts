import * as z from 'zod';

const email = z
  .string()
  .min(1, 'auth.validation.email_required')
  .email('auth.validation.email_invalid');

const password = z
  .string()
  .min(1, 'auth.validation.password_required')
  .min(6, 'auth.validation.password_min');

export const loginSchema = z.object({ email, password });

export const signUpSchema = z
  .object({
    fullName: z.string().trim().min(1, 'auth.validation.name_required'),
    email,
    password,
    confirmPassword: z.string().min(1, 'auth.validation.password_required'),
    acceptTerms: z
      .boolean()
      .refine((value) => value, 'auth.validation.terms_required'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'auth.validation.password_mismatch',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
