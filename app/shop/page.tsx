'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, X, Package } from 'lucide-react'
import ProductCard from '@/components/store/ProductCard'
import { ProductSkeletonGrid } from '@/components/store/ProductSkeleton'
import type { Product, Category } from '@/types'
import { cn } from '@/lib/utils'

export default function ShopPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [featured, setFeatured] = useState(searchParams.get('featured') === 'true')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [selectedCategory, featured, sortBy])

  async function loadCategories() {
    const res = await fetch('/api/categories')
    if (res.ok) {
      const data = await res.json()
      setCategories(data)
    }
  }

  async function loadProducts() {
    setLoading(true)
    const params = new URLSearchParams()
    if (selectedCategory) params.set('category', selectedCategory)
    if (featured) params.set('featured', 'true')
    if (search) params.set('search', search)
    params.set('sort', sortBy)

    const res = await fetch(`/api/products?${params}`)
    if (res.ok) {
      const data = await res.json()
      setProducts(data)
    }
    setLoading(false)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    loadProducts()
  }

  function clearFilters() {
    setSearch('')
    setSelectedCategory('')
    setFeatured(false)
    setSortBy('newest')
  }

  const hasFilters = search || selectedCategory || featured

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return (a.discount_price || a.price) - (b.discount_price || b.price)
    if (sortBy === 'price-desc') return (b.discount_price || b.price) - (a.discount_price || a.price)
    return 0
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <span className="text-sm font-semibold text-[#00b5e8] uppercase tracking-widest block mb-2">Catalog</span>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
          {featured ? 'Featured Products' : 'All Products'}
        </h1>
        <p className="text-[#8892a4]">
          {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} available`}
        </p>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5568]" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-dark pl-10 pr-4"
          />
        </form>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="input-dark sm:w-44 bg-[rgba(255,255,255,0.03)] cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory('')}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-semibold border transition-all',
            !selectedCategory
              ? 'bg-[rgba(0,181,232,0.15)] text-[#00b5e8] border-[rgba(0,181,232,0.4)]'
              : 'text-[#8892a4] border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,181,232,0.3)] hover:text-[#00b5e8]'
          )}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-semibold border transition-all',
              selectedCategory === cat.slug
                ? 'bg-[rgba(0,181,232,0.15)] text-[#00b5e8] border-[rgba(0,181,232,0.4)]'
                : 'text-[#8892a4] border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,181,232,0.3)] hover:text-[#00b5e8]'
            )}
          >
            {cat.icon && <span className="mr-1.5">{cat.icon}</span>}
            {cat.name}
          </button>
        ))}
        <button
          onClick={() => setFeatured(!featured)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-semibold border transition-all',
            featured
              ? 'bg-[rgba(0,181,232,0.15)] text-[#00b5e8] border-[rgba(0,181,232,0.4)]'
              : 'text-[#8892a4] border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,181,232,0.3)] hover:text-[#00b5e8]'
          )}
        >
          ⭐ Featured
        </button>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-full text-sm font-semibold border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-1.5"
          >
            <X size={13} /> Clear Filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <ProductSkeletonGrid count={6} />
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-full bg-[rgba(0,181,232,0.06)] border border-[rgba(0,181,232,0.1)] flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-[rgba(0,181,232,0.3)]" />
          </div>
          <h3 className="font-bold text-white text-xl mb-2">No Products Found</h3>
          <p className="text-[#8892a4] mb-6 text-sm">Try adjusting your search or clearing filters</p>
          <button onClick={clearFilters} className="btn-outline text-sm">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
