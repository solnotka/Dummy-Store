export type {
  AddProductFormValues,
  AddProductSubmitValues,
} from './addProductSchema'

export type Product = {
  id: number
  title: string
  category: string
  price: number
  thumbnail: string
  brand?: string
  sku?: string
  rating: number
}

export type AddProductModalProps = {
  open: boolean
  onClose: () => void
}
