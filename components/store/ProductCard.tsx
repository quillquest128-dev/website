'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Star, Package } from 'lucide-react'
import type { Product } from '@/types'
import { getStockStatus, getEffectivePrice, formatPrice } from '@/types'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  floating?: boolean
  className?: string
}

const stockConfig = {
  in_stock: { label: 'In Stock', color: 'text-emerald-400', dot: 'bg-emerald-400' },
  low_stock: { label: 'Low Stock', color: 'text-amber-400', dot: 'bg-amber-400' },
  out_of_stock: { label: 'Out of Stock', color: 'text-red-400', dot: 'bg-red-400' },
}

export default function ProductCard({ product, floating = false, className }: ProductCardProps) {
  const stock = getStockStatus(product)
  const stockInfo = stockConfig[stock]
  const effectivePrice = getEffectivePrice(product)
  const hasDiscount = product.discount_price && product.discount_price < product.price

  return (
    <Link href={`/product/${product.slug}`} className={cn('block group', floating && 'animate-float', className)}>
      <div className="card-glass overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-[#0d0d14]">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package size={48} className="text-[rgba(0,181,232,0.2)]" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {product.featured && (
              <span className="flex items-center gap-1 px-2 py-1 bg-[rgba(0,181,232,0.9)] backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                <Star size={10} fill="white" /> Featured
              </span>
            )}
            {hasDiscount && (
              <span className="px-2 py-1 bg-emerald-500/90 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                Sale
              </span>
            )}
          </div>

          {/* Stock indicator */}
          <div className="absolute top-3 right-3">
            <span className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm',
              'bg-[rgba(0,0,0,0.6)]',
              stockInfo.color
            )}>
              <span className={cn('w-1.5 h-1.5 rounded-full', stockInfo.dot, stock === 'in_stock' && 'animate-pulse')} />
              {stockInfo.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Category */}
          {product.category && (
            <span className="text-[#00b5e8] text-xs font-semibold uppercase tracking-widest mb-2">
              {product.category.name}
            </span>
          )}

          <h3 className="font-bold text-base text-white mb-2 line-clamp-2 group-hover:text-[#00b5e8] transition-colors leading-snug">
            {product.title}
          </h3>

          <p className="text-sm text-[#8892a4] line-clamp-2 mb-4 flex-1 leading-relaxed">
            {product.short_description}
          </p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {product.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-full bg-[rgba(0,181,232,0.08)] border border-[rgba(0,181,232,0.15)] text-[#00b5e8] text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price & CTA */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-[rgba(255,255,255,0.05)]">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">{formatPrice(effectivePrice)}</span>
              {hasDiscount && (
                <span className="text-sm text-[#4a5568] line-through">{formatPrice(product.price)}</span>
              )}
            </div>
            <button
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200',
                stock === 'out_of_stock'
                  ? 'bg-[rgba(255,255,255,0.04)] text-[#4a5568] cursor-not-allowed'
                  : 'bg-[rgba(0,181,232,0.15)] text-[#00b5e8] border border-[rgba(0,181,232,0.3)] group-hover:bg-[rgba(0,181,232,0.25)] group-hover:shadow-[0_0_16px_rgba(0,181,232,0.2)]'
              )}
              onClick={e => {
                if (stock === 'out_of_stock') e.preventDefault()
              }}
            >
              <ShoppingBag size={13} />
              {stock === 'out_of_stock' ? 'Sold Out' : 'Buy'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
