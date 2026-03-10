import Link from 'next/link'
import { ArrowRight, MessageCircle, ShoppingBag, Zap, Shield, Clock, ChevronRight, Star } from 'lucide-react'
import ProductCard from '@/components/store/ProductCard'
import { getProducts, getCategories } from '@/lib/products'
import { DISCORD_LINK } from '@/lib/utils'

export const revalidate = 60

export default async function HomePage() {
  const [featuredProducts, allProducts, categories] = await Promise.all([
    getProducts({ featured: true, limit: 6 }),
    getProducts({ limit: 8 }),
    getCategories(),
  ])

  const popularProducts = allProducts.filter(p => !p.featured).slice(0, 3)

  return (
    <div className="overflow-hidden">
      {/* ─── Hero ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center grid-bg">
        {/* Glow orbs */}
        <div className="glow-orb w-96 h-96 bg-[rgba(0,181,232,0.08)] -top-32 -left-32" />
        <div className="glow-orb w-80 h-80 bg-[rgba(0,120,200,0.06)] top-1/3 -right-40" />
        <div className="glow-orb w-64 h-64 bg-[rgba(0,181,232,0.05)] bottom-0 left-1/4" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,181,232,0.08)] border border-[rgba(0,181,232,0.2)] mb-8 text-sm font-medium text-[#00b5e8]">
            <span className="w-2 h-2 rounded-full bg-[#00b5e8] animate-pulse" />
            Premium Digital Products
            <ChevronRight size={14} />
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-none">
            <span className="text-white">The Future of</span>
            <br />
            <span className="gradient-text">Digital Commerce</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#8892a4] max-w-2xl mx-auto mb-10 leading-relaxed">
            Premium digital products delivered personally through Discord. Browse, choose, and purchase — your way, your speed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shop" className="btn-primary flex items-center gap-2 text-base py-3.5 px-8 shadow-neon">
              <ShoppingBag size={18} />
              Explore Products
              <ArrowRight size={16} />
            </Link>
            <a
              href={DISCORD_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex items-center gap-2 text-base py-3.5 px-8"
            >
              <MessageCircle size={18} />
              Join Discord
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            {[
              { label: 'Products', value: allProducts.length + '+' },
              { label: 'Happy Customers', value: '500+' },
              { label: 'Categories', value: categories.length + '+' },
              { label: 'Discord Support', value: '24/7' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-extrabold gradient-text">{stat.value}</div>
                <div className="text-sm text-[#4a5568] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent" />
      </section>

      {/* ─── Features ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <MessageCircle size={22} className="text-[#00b5e8]" />,
              title: 'Discord Delivery',
              desc: 'All products are delivered personally via Discord for maximum security and personalization.',
            },
            {
              icon: <Shield size={22} className="text-[#00b5e8]" />,
              title: 'Verified & Safe',
              desc: 'Every product is verified and tested. Your satisfaction and security are our top priorities.',
            },
            {
              icon: <Clock size={22} className="text-[#00b5e8]" />,
              title: 'Fast Turnaround',
              desc: 'Most orders are fulfilled within hours. We're here whenever you need us.',
            },
          ].map(feature => (
            <div key={feature.title} className="card-glass p-6">
              <div className="w-12 h-12 rounded-xl bg-[rgba(0,181,232,0.1)] border border-[rgba(0,181,232,0.2)] flex items-center justify-center mb-4 shadow-[0_0_16px_rgba(0,181,232,0.1)]">
                {feature.icon}
              </div>
              <h3 className="font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-[#8892a4] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Featured Products ─── */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star size={16} className="text-[#00b5e8]" fill="#00b5e8" />
                <span className="text-sm font-semibold text-[#00b5e8] uppercase tracking-widest">Featured</span>
              </div>
              <h2 className="section-heading">Top Picks</h2>
            </div>
            <Link href="/shop?featured=true" className="btn-outline text-sm py-2 px-5 hidden sm:flex items-center gap-2">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 6).map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                floating={i % 2 === 0}
                className={i % 3 === 1 ? 'animate-float-slow' : i % 3 === 2 ? 'animate-float-fast' : ''}
              />
            ))}
          </div>

          <div className="mt-6 sm:hidden">
            <Link href="/shop?featured=true" className="btn-outline w-full text-center block py-3">
              View All Featured
            </Link>
          </div>
        </section>
      )}

      {/* ─── Categories ─── */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="mb-10">
            <span className="text-sm font-semibold text-[#00b5e8] uppercase tracking-widest block mb-2">Browse</span>
            <h2 className="section-heading">Shop by Category</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="px-5 py-3 rounded-full bg-[rgba(0,181,232,0.12)] border border-[rgba(0,181,232,0.3)] text-[#00b5e8] font-semibold text-sm hover:bg-[rgba(0,181,232,0.2)] hover:shadow-[0_0_20px_rgba(0,181,232,0.2)] transition-all"
            >
              All Products
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="px-5 py-3 rounded-full border border-[rgba(255,255,255,0.08)] text-[#8892a4] font-semibold text-sm hover:border-[rgba(0,181,232,0.3)] hover:text-[#00b5e8] hover:bg-[rgba(0,181,232,0.06)] transition-all"
              >
                {cat.icon && <span className="mr-2">{cat.icon}</span>}
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── How It Works ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="card-glass p-8 sm:p-12 relative overflow-hidden">
          <div className="glow-orb w-80 h-80 bg-[rgba(0,181,232,0.04)] -top-20 -right-20" />
          <div className="relative z-10">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-[#00b5e8] uppercase tracking-widest block mb-2">Process</span>
              <h2 className="section-heading">How It Works</h2>
              <p className="text-[#8892a4] mt-3 text-sm max-w-lg mx-auto">
                Buying from LazoStore is simple, safe, and personal. Here's how:
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Browse', desc: 'Find the perfect product in our curated store.' },
                { step: '02', title: 'Request', desc: 'Click Buy and fill in your contact details.' },
                { step: '03', title: 'Discord', desc: 'Join our Discord and complete payment with a staff member.' },
                { step: '04', title: 'Delivered', desc: 'Receive your product instantly via Discord.' },
              ].map(item => (
                <div key={item.step} className="relative">
                  <div className="text-5xl font-extrabold text-[rgba(0,181,232,0.08)] mb-3 font-mono">{item.step}</div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-[#8892a4] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <a
                href={DISCORD_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <MessageCircle size={16} />
                Join Our Discord
                <ExternalIcon />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Popular Products ─── */}
      {popularProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-sm font-semibold text-[#00b5e8] uppercase tracking-widest block mb-2">Trending</span>
              <h2 className="section-heading">Popular Now</h2>
            </div>
            <Link href="/shop" className="btn-outline text-sm py-2 px-5 hidden sm:flex items-center gap-2">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Ready to get started?
          </h2>
          <p className="text-[#8892a4] mb-8 text-lg">Browse our collection and make your first purchase today.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shop" className="btn-primary flex items-center gap-2 py-3.5 px-8 text-base shadow-neon">
              <ShoppingBag size={18} />
              Shop Now
            </Link>
            <Link href="/faq" className="btn-ghost flex items-center gap-2 py-3.5 px-8 text-base">
              View FAQ <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  )
}
