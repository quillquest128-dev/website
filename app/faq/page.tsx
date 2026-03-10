'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DISCORD_LINK } from '@/lib/utils'

const faqs = [
  {
    q: `How does purchasing work?`,
    a: `Browse our store, click "Buy Now" on a product, fill in your details, and then join our Discord server. A staff member will reach out to complete the transaction and deliver your product.`,
  },
  {
    q: `What payment methods do you accept?`,
    a: `We accept various payment methods through Discord. Please join our server and ask a staff member for current payment options — we aim to be as flexible as possible.`,
  },
  {
    q: `How quickly will I receive my product?`,
    a: `Most orders are fulfilled within a few hours. We have staff available regularly, so you typically won't wait long after completing payment.`,
  },
  {
    q: `What does "Low Stock" mean?`,
    a: `"Low Stock" means there are 5 or fewer units remaining. We recommend purchasing quickly to avoid missing out. Once stock hits zero, the product will be marked as "Out of Stock".`,
  },
  {
    q: `What if I have an issue with my product?`,
    a: `We stand behind everything we sell. If you encounter any issues, reach out to a staff member on Discord and we will work to resolve it promptly.`,
  },
  {
    q: `Is my information safe?`,
    a: `Yes. We only collect your name, email, and optional Discord username to process your order. Your data is stored securely and never shared with third parties.`,
  },
  {
    q: `Can I request a refund?`,
    a: `Refund eligibility depends on the product type. Since these are digital goods, we generally handle issues on a case-by-case basis. Contact us on Discord for support.`,
  },
  {
    q: `Do you offer bulk discounts?`,
    a: `Yes! For bulk orders or custom deals, please contact us directly on Discord. We're happy to work out custom pricing for larger orders.`,
  },
  {
    q: `Why Discord for payment?`,
    a: `Discord allows us to provide a personal, secure, and hands-on purchase experience. It also means you can ask questions in real-time and get instant support.`,
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={cn(
        'border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden transition-all duration-200',
        open ? 'border-[rgba(0,181,232,0.2)] bg-[rgba(0,181,232,0.03)]' : 'bg-[rgba(255,255,255,0.01)] hover:bg-[rgba(255,255,255,0.02)]'
      )}
    >
      <button
        className="w-full flex items-center justify-between p-6 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className={cn('font-semibold text-base transition-colors', open ? 'text-[#00b5e8]' : 'text-white')}>
          {q}
        </span>
        <ChevronDown
          size={18}
          className={cn('flex-shrink-0 text-[#4a5568] transition-transform duration-200', open && 'rotate-180 text-[#00b5e8]')}
        />
      </button>
      {open && (
        <div className="px-6 pb-6">
          <p className="text-[#8892a4] leading-relaxed text-sm">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 min-h-screen">
      <div className="text-center mb-14">
        <span className="text-sm font-semibold text-[#00b5e8] uppercase tracking-widest block mb-3">Help Center</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h1>
        <p className="text-[#8892a4] text-lg">
          Everything you need to know about purchasing from LazoStore.
        </p>
      </div>

      <div className="space-y-3 mb-14">
        {faqs.map(faq => (
          <FaqItem key={faq.q} q={faq.q} a={faq.a} />
        ))}
      </div>

      {/* CTA */}
      <div className="card-glass p-8 text-center">
        <MessageCircle size={28} className="text-[#00b5e8] mx-auto mb-4" />
        <h3 className="font-bold text-white text-xl mb-2">Still have questions?</h3>
        <p className="text-[#8892a4] text-sm mb-6">
          Join our Discord server and ask a staff member directly. We're friendly and respond fast.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2">
            <MessageCircle size={16} /> Join Discord
          </a>
          <Link href="/contact" className="btn-outline">Contact Form</Link>
        </div>
      </div>
    </div>
  )
}
