import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | LazoStore',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505]">
      {children}
    </div>
  )
}
