import Link from 'next/link'
import { Zap, MessageCircle, Twitter, Github } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[rgba(0,181,232,0.08)] bg-[#050505] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00b5e8] to-[#0077aa] flex items-center justify-center shadow-[0_0_16px_rgba(0,181,232,0.4)]">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                Lazo<span className="text-[#00b5e8]">Store</span>
              </span>
            </Link>
            <p className="text-sm text-[#8892a4] leading-relaxed mb-6">
              Premium digital products delivered securely through Discord. Fast, reliable, and personal.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={process.env.NEXT_PUBLIC_DISCORD_LINK || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[rgba(0,181,232,0.1)] border border-[rgba(0,181,232,0.2)] flex items-center justify-center text-[#00b5e8] hover:bg-[rgba(0,181,232,0.2)] hover:shadow-[0_0_16px_rgba(0,181,232,0.3)] transition-all"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Store</h4>
            <ul className="space-y-3">
              {[
                { href: '/shop', label: 'All Products' },
                { href: '/shop?featured=true', label: 'Featured' },
                { href: '/shop?new=true', label: 'New Arrivals' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#8892a4] hover:text-[#00b5e8] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Support</h4>
            <ul className="space-y-3">
              {[
                { href: '/faq', label: 'FAQ' },
                { href: '/contact', label: 'Contact Us' },
                { href: process.env.NEXT_PUBLIC_DISCORD_LINK || '#', label: 'Discord Server', external: true },
              ].map(link => (
                <li key={link.href}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-[#8892a4] hover:text-[#00b5e8] transition-colors">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-sm text-[#8892a4] hover:text-[#00b5e8] transition-colors">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Legal</h4>
            <ul className="space-y-3">
              {[
                { href: '/terms', label: 'Terms of Service' },
                { href: '/privacy', label: 'Privacy Policy' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#8892a4] hover:text-[#00b5e8] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.04)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#4a5568]">
            © {currentYear} LazoStore. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#4a5568]">
            <span>Payments & delivery via</span>
            <span className="text-[#00b5e8] font-semibold">Discord</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
