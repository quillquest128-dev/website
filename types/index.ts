// types/index.ts

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string | null
  created_at?: string
  updated_at?: string
}

export interface Product {
  id: string
  title: string
  slug: string
  short_description: string
  full_description: string
  price: number
  discount_price: number | null
  thumbnail: string | null
  gallery_images: string[]
  category_id: string | null
  category?: Category
  tags: string[]
  stock_quantity: number
  minimum_quantity: number
  status: 'active' | 'inactive' | 'out_of_stock'
  featured: boolean
  delivery_info: string
  discord_payment_note: string
  created_at: string
  updated_at: string
}

export interface OrderRequest {
  id: string
  product_id: string
  product?: Product
  customer_name: string
  customer_email: string
  discord_username: string | null
  quantity: number
  order_status: 'pending' | 'contacted' | 'completed' | 'cancelled'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface SiteSettings {
  id: string
  key: string
  value: string
  updated_at: string
}

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

export function getStockStatus(product: Product): StockStatus {
  if (product.status === 'out_of_stock' || product.stock_quantity === 0) return 'out_of_stock'
  if (product.stock_quantity <= 5) return 'low_stock'
  return 'in_stock'
}

export function getEffectivePrice(product: Product): number {
  return product.discount_price ?? product.price
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price)
}
