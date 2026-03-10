import type { Product } from '@/types'
import { getStockStatus } from '@/types'
import { cn } from '@/lib/utils'

const config = {
  in_stock: {
    label: 'In Stock',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dotClass: 'bg-emerald-400 animate-pulse',
  },
  low_stock: {
    label: 'Low Stock',
    className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dotClass: 'bg-amber-400',
  },
  out_of_stock: {
    label: 'Out of Stock',
    className: 'bg-red-500/10 text-red-400 border-red-500/20',
    dotClass: 'bg-red-400',
  },
}

interface StockBadgeProps {
  product: Product
  showCount?: boolean
  size?: 'sm' | 'md'
}

export default function StockBadge({ product, showCount = false, size = 'md' }: StockBadgeProps) {
  const status = getStockStatus(product)
  const { label, className, dotClass } = config[status]

  return (
    <span className={cn(
      'inline-flex items-center gap-2 rounded-full border font-semibold',
      size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5',
      className
    )}>
      <span className={cn('w-2 h-2 rounded-full', dotClass)} />
      {label}
      {showCount && status !== 'out_of_stock' && product.stock_quantity > 0 && (
        <span className="opacity-60">({product.stock_quantity} left)</span>
      )}
    </span>
  )
}
