import { z } from 'zod'

export const loginFormSchema = z.object({
  login: z.string().trim().min(1, 'Введите логин'),
  password: z.string().min(1, 'Введите пароль'),
  remember: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>
export type LoginFormInput = z.input<typeof loginFormSchema>
