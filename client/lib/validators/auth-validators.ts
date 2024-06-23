import { z } from 'zod';

export const SignUpSchema = z
  .object({
    username: z.string({ required_error: 'Username is required.' }),
    email: z
      .string({ required_error: 'Email is required.' })
      .email({ message: 'Not a valid email address.' }),
    password: z
      .string({ required_error: 'Password is required.' })
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .max(100, {
        message: 'Password must be less than 100 characters long.',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter.',
      })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter.',
      })
      .regex(/[0-9]/, {
        message: 'Password must contain at least one number.',
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Password must contain at least one special character.',
      }),
    passwordConfirm: z.string({
      required_error: 'Password confirmation is required.',
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match.',
    path: ['passwordConfirm'],
  });

export type TSignUpSchema = z.infer<typeof SignUpSchema>;

export const LoginSchema = z.object({
  email: z.string({ required_error: 'Email is required.' }),
  password: z.string({
    required_error: 'Password is required.',
  }),
});

export type TLoginSchema = z.infer<typeof LoginSchema>;
