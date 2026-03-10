'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingBag, Menu, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/shop?featured=true', label: 'Featured' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[#050505]/95 backdrop-blur-xl border-b border-[rgba(0,181,232,0.1)] shadow-[0_4px_32px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00b5e8] to-[#0077aa] flex items-center justify-center shadow-[0_0_16px_rgba(0,181,232,0.4)] group-hover:shadow-[0_0_24px_rgba(0,181,232,0.6)] transition-shadow">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Lazo<span className="text-[#00b5e8]">Store</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full text-sm font-medium text-[#8892a4] hover:text-[#00b5e8] hover:bg-[rgba(0,181,232,0.08)] transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="input-dark text-sm w-48 py-2 px-3"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="text-[#8892a4] hover:text-white transition-colors p-2">
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-[#8892a4] hover:text-[#00b5e8] hover:bg-[rgba(0,181,232,0.08)] rounded-full transition-all"
              >
                <Search size={18} />
              </button>
            )}
            <Link
              href="/shop"
              className="hidden md:flex items-center gap-2 btn-primary text-sm py-2 px-5"
            >
              <ShoppingBag size={15} />
              Shop Now
            </Link>
            <button
              className="md:hidden p-2 text-[#8892a4] hover:text-white rounded-full transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-[#0a0a0f] border-b border-[rgba(0,181,232,0.1)] p-6 space-y-2 animate-slide-up">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-[#8892a4] hover:text-[#00b5e8] hover:bg-[rgba(0,181,232,0.08)] transition-all font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link href="/shop" onClick={() => setMenuOpen(false)} className="btn-primary block text-center text-sm">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
