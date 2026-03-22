import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Input, Modal, message } from 'antd'
import { useEffect } from 'react'
import {
  Controller,
  useForm,
  type Resolver,
} from 'react-hook-form'
import { addProductFormSchema } from '../models/addProductSchema'
import type {
  AddProductFormValues,
  AddProductModalProps,
  AddProductSubmitValues,
} from '../models/types'
import { normalizeArtSkuInput, normalizePriceInput } from '../utils'
import './AddProductModal.css'

export function AddProductModal({ open, onClose }: AddProductModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddProductFormValues, unknown, AddProductSubmitValues>({
    resolver: zodResolver(
      addProductFormSchema,
    ) as Resolver<AddProductFormValues, unknown, AddProductSubmitValues>,
    defaultValues: {
      title: '',
      brand: '',
      sku: '',
      price: '',
    },
  })

  useEffect(() => {
    if (!open) return
    reset({
      title: '',
      brand: '',
      sku: '',
      price: '',
    })
  }, [open, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = (_data: AddProductSubmitValues) => {
    message.success('Товар успешно добавлен')
    reset()
    onClose()
  }

  return (
    <Modal
      title="Добавить товар"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={480}
      destroyOnHidden
    >
      <Form
        layout="vertical"
        className="add-product-modal__form"
        onFinish={handleSubmit(onSubmit)}
      >
        <Form.Item
          label="Наименование"
          validateStatus={errors.title ? 'error' : undefined}
          help={errors.title?.message}
          required
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Введите наименование" />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Цена"
          validateStatus={errors.price ? 'error' : undefined}
          help={errors.price?.message}
          required
        >
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className="add-product-modal__price"
                value={field.value}
                onChange={(e) =>
                  field.onChange(normalizePriceInput(e.target.value))
                }
                onBlur={() => {
                  field.onBlur()
                  const v = field.value
                  if (typeof v === 'string' && /^\d+,$/.test(v)) {
                    field.onChange(v.slice(0, -1))
                  }
                }}
                placeholder="0,00"
                inputMode="decimal"
                autoComplete="off"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Вендор"
          validateStatus={errors.brand ? 'error' : undefined}
          help={errors.brand?.message}
          required
        >
          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Название бренда" />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Артикул"
          validateStatus={errors.sku ? 'error' : undefined}
          help={errors.sku?.message ?? 'Формат как в подсказке поля'}
          required
        >
          <Controller
            name="sku"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value}
                onChange={(e) =>
                  field.onChange(normalizeArtSkuInput(e.target.value))
                }
                placeholder="ART-00000000"
                inputMode="text"
                autoComplete="off"
                maxLength={12}
              />
            )}
          />
        </Form.Item>

        <Form.Item className="add-product-modal__actions">
          <Button onClick={handleClose}>Отмена</Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Добавить
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
