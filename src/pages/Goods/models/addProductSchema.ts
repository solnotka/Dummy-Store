import { z } from 'zod'
import { artSkuRegex } from '../utils'

export const addProductFormSchema = z.object({
  title: z.string().trim().min(1, 'Укажите наименование'),
  brand: z.string().trim().min(1, 'Укажите вендора'),
  sku: z
    .string()
    .trim()
    .regex(artSkuRegex, 'Формат ART-00000000: после дефиса ровно 8 цифр'),
  price: z
    .string()
    .trim()
    .min(1, 'Укажите цену')
    .regex(
      /^\d+(,\d{1,2})?$/,
      'Только цифры и запятая; после запятой не больше двух знаков',
    )
    .transform((s) => Number(s.replace(',', '.')))
    .refine((n) => Number.isFinite(n) && n > 0, {
      message: 'Цена должна быть больше 0',
    }),
})

export type AddProductSubmitValues = z.infer<typeof addProductFormSchema>
export type AddProductFormValues = z.input<typeof addProductFormSchema>
