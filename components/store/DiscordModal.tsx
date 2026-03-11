'use client'
import { useState } from 'react'
import { X, MessageCircle, ExternalLink, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice, getEffectivePrice } from '@/types'
import { createOrderRequest } from '@/lib/products'
import { DISCORD_LINK } from '@/lib/utils'
import toast from 'react-hot-toast'

interface DiscordModalProps {
  product: Product
  quantity: number
  onClose: () => void
}

export default function DiscordModal({ product, quantity, onClose }: DiscordModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    discord_username: '',
    notes: '',
  })

  const price = getEffectivePrice(product)
  const totalPrice = price * quantity
  const discordMessage = encodeURIComponent(
  `Hi! I'd like to purchase: ${product.title}\nQuantity: ${quantity}\nUnit Price: $${price.toFixed(2)}\nTotal: $${totalPrice.toFixed(2)}\nDiscord: ${form.discord_username || '[your username]'}`
)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.customer_name || !form.customer_email) {
      toast.error('Please fill in your name and email')
      return
    }
    setLoading(true)
    try {
      await createOrderRequest({
  product_id: product.id,
  customer_name: form.customer_name,
  customer_email: form.customer_email,
  discord_username: form.discord_username || undefined,
  quantity,
  notes: form.notes || undefined,
})
      setStep('success')
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0a0a0f] border border-[rgba(0,181,232,0.2)] rounded-2xl shadow-[0_0_60px_rgba(0,181,232,0.15)] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(0,181,232,0.1)] border border-[rgba(0,181,232,0.2)] flex items-center justify-center">
              <MessageCircle size={18} className="text-[#00b5e8]" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">Purchase via Discord</h2>
              <p className="text-xs text-[#8892a4]">Manual payment & delivery</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#4a5568] hover:text-white rounded-full hover:bg-[rgba(255,255,255,0.05)] transition-all">
            <X size={18} />
          </button>
        </div>

        {step === 'form' ? (
          <>
            {/* Product Summary */}
            <div className="px-6 py-4 bg-[rgba(0,181,232,0.04)] border-b border-[rgba(255,255,255,0.04)]">
              <div className="flex items-center justify-between gap-4">
  <div>
    <p className="text-xs text-[#8892a4] mb-1">Purchasing</p>
    <p className="font-semibold text-white text-sm line-clamp-1">{product.title}</p>
    <p className="text-xs text-[#4a5568] mt-1">
      Quantity: {quantity} × {formatPrice(price)}
    </p>
  </div>
  <span className="text-lg font-bold text-[#00b5e8]">{formatPrice(totalPrice)}</span>
</div>
            </div>

            {/* Notice */}
            <div className="px-6 pt-5 pb-0">
              <div className="flex gap-3 p-3 bg-[rgba(0,181,232,0.06)] border border-[rgba(0,181,232,0.15)] rounded-xl mb-5">
                <AlertCircle size={16} className="text-[#00b5e8] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#8892a4] leading-relaxed">
                  Payments and delivery are handled manually through Discord. After submitting, you'll be redirected to our Discord server to complete your purchase.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wide">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="input-dark text-sm"
                    placeholder="Enter your name"
                    value={form.customer_name}
                    onChange={e => setForm({ ...form, customer_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wide">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    className="input-dark text-sm"
                    placeholder="your@email.com"
                    value={form.customer_email}
                    onChange={e => setForm({ ...form, customer_email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wide">
                    Discord Username <span className="text-[#4a5568] font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    className="input-dark text-sm"
                    placeholder="yourusername#0000"
                    value={form.discord_username}
                    onChange={e => setForm({ ...form, discord_username: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wide">
                    Notes <span className="text-[#4a5568] font-normal">(optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    className="input-dark text-sm resize-none"
                    placeholder="Any special instructions..."
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                  />
                </div>

                {/* Discord payment note */}
                {product.discord_payment_note && (
                  <div className="p-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl">
                    <p className="text-xs text-[#8892a4]">{product.discord_payment_note}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                >
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> Processing...</>
                  ) : (
                    <><MessageCircle size={16} /> Continue to Discord</>
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Success Step */
          <div className="p-6 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-2">Order Logged!</h3>
              <p className="text-sm text-[#8892a4] leading-relaxed">
                Your purchase request has been saved. Join our Discord server to complete your payment and receive your product.
              </p>
            </div>

            <div className="p-4 bg-[rgba(0,181,232,0.04)] border border-[rgba(0,181,232,0.15)] rounded-xl text-left space-y-2">
              <p className="text-xs font-semibold text-[#00b5e8] uppercase tracking-wide">What happens next?</p>
              {[
                '1. Join our Discord server via the button below',
                '2. Find a staff member or open a ticket',
                `3. Tell them you'd like to purchase: ${product.title}`,
                '4. Complete payment as instructed',
                '5. Receive your product instantly on Discord',
              ].map((step, i) => (
                <p key={i} className="text-xs text-[#8892a4]">{step}</p>
              ))}
            </div>

            <a
              href={`${DISCORD_LINK}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center justify-center gap-2 w-full py-3"
            >
              <MessageCircle size={16} />
              Join Discord Server
              <ExternalLink size={13} />
            </a>

            <button onClick={onClose} className="btn-ghost w-full text-sm">
              Maybe Later
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
