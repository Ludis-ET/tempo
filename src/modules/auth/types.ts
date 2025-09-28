import { z } from "zod";

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;

// Login response example provided is ambiguous; support flexible shape
export const loginResponseSchema = z
  .object({
    email: z.string().optional(),
    password: z.string().optional(),
    tokens: z
      .object({
        access: z.string(),
        refresh: z.string(),
      })
      .optional(),
  })
  .passthrough();
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const registerRequestSchema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  password: z.string().min(8),
  password_confirm: z.string().min(8),
  employee_id: z.string().min(1),
  department: z.string().min(1),
  position: z.string().min(1),
  phone: z.string().min(4),
});
export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export const registerResponseSchema = z.object({
  message: z.string().optional(),
  user: z.record(z.any()).optional(),
  tokens: z
    .object({
      refresh: z.string(),
      access: z.string(),
    })
    .optional(),
});
export type RegisterResponse = z.infer<typeof registerResponseSchema>;

export const profileSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  full_name: z.string().optional(),
  phone: z.string().optional(),
  employee_id: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  manager: z.number().optional(),
  user__is_active: z.boolean().optional(),
});
export type Profile = z.infer<typeof profileSchema>;

export const changePasswordRequestSchema = z.object({
  old_password: z.string().min(8),
  new_password: z.string().min(8),
});
export type ChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>;

export const refreshRequestSchema = z.object({ refresh: z.string() });
export const refreshResponseSchema = z.object({ access: z.string(), refresh: z.string().optional() });
export type RefreshRequest = z.infer<typeof refreshRequestSchema>;
export type RefreshResponse = z.infer<typeof refreshResponseSchema>;

export const usersListQuerySchema = z.object({
  department: z.string().optional(),
  position: z.string().optional(),
  search: z.string().optional(),
  ordering: z.string().optional(),
  page: z.union([z.string(), z.number()]).optional(),
  user__is_active: z.union([z.string(), z.boolean()]).optional(),
});
export type UsersListQuery = z.infer<typeof usersListQuerySchema>;

export const usersListResponseSchema = z.object({
  count: z.number().optional(),
  next: z.string().nullable().optional(),
  previous: z.string().nullable().optional(),
  results: z.array(profileSchema).optional(),
});
export type UsersListResponse = z.infer<typeof usersListResponseSchema>;
