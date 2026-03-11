'use client'
import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, MessageCircle, Package, Tag, Check, Minus, Plus } from 'lucide-react'
import StockBadge from '@/components/store/StockBadge'
import DiscordModal from '@/components/store/DiscordModal'
import { getProductBySlug } from '@/lib/products'
import { formatPrice, getEffectivePrice, getStockStatus } from '@/types'
import type { Product } from '@/types'

export default function ProductPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [quantityInput, setQuantityInput] = useState('1')

  useEffect(() => {
    async function load() {
      const data = await getProductBySlug(slug)
      setProduct(data)
      if (data) {
  setQuantityInput(String(data.minimum_quantity || 1))
      }
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-video shimmer rounded-2xl" />
          <div className="space-y-6">
            <div className="h-4 shimmer rounded-full w-24" />
            <div className="h-10 shimmer rounded-full w-3/4" />
            <div className="h-4 shimmer rounded-full w-full" />
            <div className="h-4 shimmer rounded-full w-2/3" />
            <div className="h-12 shimmer rounded-full w-40" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <Package size={48} className="text-[rgba(0,181,232,0.2)] mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Product Not Found</h1>
        <p className="text-[#8892a4] mb-6">This product may have been removed or is unavailable.</p>
        <Link href="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    )
  }

  const effectivePrice = getEffectivePrice(product)
  const hasDiscount = product.discount_price && product.discount_price < product.price
  const stockStatus = getStockStatus(product)
  const allImages = [product.thumbnail, ...(product.gallery_images || [])].filter(Boolean)
  const minQuantity = product.minimum_quantity || 1
const parsedQuantity = Number(quantityInput)
const quantity = Number.isFinite(parsedQuantity) ? parsedQuantity : 0
const totalPrice = effectivePrice * Math.max(quantity, 0)

let quantityError = ''

if (!quantityInput.trim()) {
  quantityError = 'Please enter a quantity.'
} else if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
  quantityError = 'Quantity must be a whole number greater than 0.'
} else if (quantity < minQuantity) {
  quantityError = `Minimum quantity is ${minQuantity}.`
} else if (quantity > product.stock_quantity) {
  quantityError = `Choose between ${minQuantity} and ${product.stock_quantity}.`
}

const isQuantityValid =
  quantityInput.trim() !== '' &&
  Number.isInteger(parsedQuantity) &&
  parsedQuantity >= minQuantity &&
  parsedQuantity <= product.stock_quantity

function updateQuantity(next: number) {
  if (!product) return
  setQuantityInput(String(next))
}

function increaseQuantity() {
  updateQuantity((Number(quantityInput) || 0) + 1)
}

function decreaseQuantity() {
  updateQuantity((Number(quantityInput) || 0) - 1)
}

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 min-h-screen">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#8892a4] mb-8">
          <Link href="/shop" className="hover:text-[#00b5e8] transition-colors flex items-center gap-1">
            <ArrowLeft size={14} /> Shop
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[#00b5e8] transition-colors">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[#4a5568] line-clamp-1">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#0d0d14] border border-[rgba(0,181,232,0.1)]">
              {allImages[activeImage] ? (
                <Image
                  src={allImages[activeImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package size={64} className="text-[rgba(0,181,232,0.2)]" />
                </div>
              )}
              {product.featured && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-[rgba(0,181,232,0.9)] backdrop-blur-sm rounded-full text-white text-xs font-bold">
                    ⭐ Featured
                  </span>
                </div>
              )}
            </div>

            {/* Gallery thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImage === i ? 'border-[#00b5e8] shadow-neon' : 'border-[rgba(255,255,255,0.06)] hover:border-[rgba(0,181,232,0.3)]'
                    }`}
                  >
                    <Image src={img} alt={`Image ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.category && (
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="text-[#00b5e8] text-xs font-bold uppercase tracking-widest mb-3 block hover:underline"
              >
                {product.category.name}
              </Link>
            )}

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              {product.title}
            </h1>

            <p className="text-[#8892a4] leading-relaxed mb-6">
              {product.short_description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-extrabold gradient-text">{formatPrice(effectivePrice)}</span>
              {hasDiscount && (
                <span className="text-lg text-[#4a5568] line-through">{formatPrice(product.price)}</span>
              )}
              {hasDiscount && (
                <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-bold text-emerald-400">
                  {Math.round((1 - effectivePrice / product.price) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-4 mb-8">
              <StockBadge product={product} showCount />
              <span className="text-xs text-[#4a5568]">
                {product.stock_quantity > 0 ? `${product.stock_quantity} units available` : 'Currently unavailable'}
              </span>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.map(tag => (
                  <span key={tag} className="tag-badge">
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Delivery Info */}
            {product.delivery_info && (
              <div className="p-4 rounded-xl bg-[rgba(0,181,232,0.04)] border border-[rgba(0,181,232,0.12)] mb-6">
                <div className="flex items-start gap-3">
                  <Check size={16} className="text-[#00b5e8] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[#00b5e8] uppercase tracking-wide mb-1">Delivery</p>
                    <p className="text-sm text-[#8892a4]">{product.delivery_info}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Discord note */}
            <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] mb-8">
              <div className="flex items-start gap-3">
                <MessageCircle size={16} className="text-[#00b5e8] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white mb-1">Payment & Delivery via Discord</p>
                  <p className="text-xs text-[#8892a4]">
                    {product.discord_payment_note || 'All payments and product delivery are handled manually through our Discord server. Join to complete your purchase.'}
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-8">
  <div className="flex items-center justify-between mb-2">
    <label className="text-xs font-semibold text-white uppercase tracking-wide">
      Quantity
    </label>
    <span className="text-xs text-[#4a5568]">
      Min: {minQuantity} · Stock: {product.stock_quantity}
    </span>
  </div>

  <div className="flex items-stretch gap-2 max-w-xs">
    <button
      type="button"
      onClick={decreaseQuantity}
      className="w-12 h-12 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-white hover:border-[rgba(0,181,232,0.3)] transition-all flex items-center justify-center"
    >
      <Minus size={16} />
    </button>

    <input
      type="number"
      min={1}
      step={1}
      value={quantityInput}
      onChange={e => setQuantityInput(e.target.value)}
      className="input-dark text-center h-12"
      placeholder={String(minQuantity)}
    />

    <button
      type="button"
      onClick={increaseQuantity}
      className="w-12 h-12 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-white hover:border-[rgba(0,181,232,0.3)] transition-all flex items-center justify-center"
    >
      <Plus size={16} />
    </button>
  </div>

  {quantityError ? (
    <p className="text-xs text-red-400 mt-2">{quantityError}</p>
  ) : (
    <p className="text-xs text-emerald-400 mt-2">
      Total: {formatPrice(totalPrice)}
    </p>
  )}
</div>

            {/* Buy Button */}
            <div className="flex flex-col sm:flex-row gap-3">
  <button
    onClick={() => stockStatus !== 'out_of_stock' && isQuantityValid && setModalOpen(true)}
    disabled={stockStatus === 'out_of_stock' || !isQuantityValid}
    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-bold text-base transition-all ${
      stockStatus === 'out_of_stock' || !isQuantityValid
        ? 'bg-[rgba(255,255,255,0.04)] text-[#4a5568] cursor-not-allowed'
        : 'btn-primary shadow-neon-lg'
    }`}
  >
    <ShoppingBag size={18} />
    {stockStatus === 'out_of_stock' ? 'Out of Stock' : `Buy ${quantity > 0 ? quantity : ''} via Discord`}
  </button>
</div>
          </div>
        </div>

        {/* Full Description */}
        {product.full_description && (
          <div className="mt-16 max-w-3xl">
            <h2 className="text-2xl font-bold text-white mb-6">Product Details</h2>
            <div className="card-glass p-8">
              <div
                className="prose prose-invert prose-sm max-w-none text-[#8892a4] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.full_description.replace(/\n/g, '<br/>') }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
  <DiscordModal
    product={product}
    quantity={quantity}
    onClose={() => setModalOpen(false)}
  />
)}
    </>
  )
}
