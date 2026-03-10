import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const search = searchParams.get('search')
  const limit = searchParams.get('limit')

  const supabase = createClient()

  let query = supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (featured === 'true') query = query.eq('featured', true)
  if (search) query = query.ilike('title', `%${search}%`)
  if (limit) query = query.limit(parseInt(limit))

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let products = data

  // Filter by category slug after join
  if (category) {
    products = products.filter((p: any) => p.category?.slug === category)
  }

  return NextResponse.json(products)
}
