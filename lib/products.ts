// lib/products.ts
import { createClient } from './supabase/client'
import type { Product, Category } from '@/types'

export async function getProducts(filters?: {
  category?: string
  search?: string
  featured?: boolean
  limit?: number
  status?: string
}): Promise<Product[]> {
  const supabase = createClient()
  let query = supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('status', filters?.status ?? 'active')
    .order('created_at', { ascending: false })

  if (filters?.category) {
    query = query.eq('categories.slug', filters.category)
  }
  if (filters?.featured) {
    query = query.eq('featured', true)
  }
  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`)
  }
  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query
  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  return data as Product[]
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error) return null
  return data as Product
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) return []
  return data as Category[]
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  const supabase = createClient()
  const { data } = await supabase.from('site_settings').select('key, value')
  if (!data) return {}
  return Object.fromEntries(data.map((s: { key: string; value: string }) => [s.key, s.value]))
}

export async function createOrderRequest(order: {
  product_id: string
  customer_name: string
  customer_email: string
  discord_username?: string
  quantity: number
  notes?: string
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('order_requests')
    .insert([{ ...order, order_status: 'pending' }])
    .select()
    .single()

  if (error) throw error
  return data
}
