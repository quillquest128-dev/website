'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Package, ShoppingBag, Tag, Settings, LogOut, LayoutDashboard,
  TrendingUp, Clock, CheckCircle2, XCircle, MessageCircle,
  Plus, Eye, Zap, Users
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Product, OrderRequest } from '@/types'
import { formatPrice } from '@/types'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ products: 0, orders: 0, pending: 0, categories: 0 })
  const [recentOrders, setRecentOrders] = useState<OrderRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => { loadDashboard() }, [])

  async function loadDashboard() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.replace('/admin/login')
      return
    }
    setUser(user)

    const [productsRes, ordersRes, catsRes] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact' }),
      supabase.from('order_requests').select('*, product:products(title, price)').order('created_at', { ascending: false }).limit(20),
      supabase.from('categories').select('id', { count: 'exact' }),
    ])

    const pendingCount = ordersRes.data?.filter((o: any) => o.order_status === 'pending').length ?? 0

    setStats({
      products: productsRes.count ?? 0,
      orders: ordersRes.count ?? 0,
      pending: pendingCount,
      categories: catsRes.count ?? 0,
    })
    setRecentOrders((ordersRes.data as any) ?? [])
    setLoading(false)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/admin/login')
  }

  async function updateOrderStatus(id: string, status: string) {
    const supabase = createClient()
    await supabase.from('order_requests').update({ order_status: status }).eq('id', id)
    setRecentOrders(prev => prev.map(o => o.id === id ? { ...o, order_status: status as any } : o))
    toast.success('Order status updated')
  }

  const statusColors: Record<string, string> = {
    pending: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    contacted: 'text-[#00b5e8] bg-[rgba(0,181,232,0.1)] border-[rgba(0,181,232,0.2)]',
    completed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    cancelled: 'text-red-400 bg-red-500/10 border-red-500/20',
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: stats.pending },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#8892a4]">
          <div className="w-6 h-6 border-2 border-[#00b5e8] border-t-transparent rounded-full animate-spin" />
          Loading dashboard...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[rgba(0,181,232,0.08)] bg-[#050505] flex flex-col fixed h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-[rgba(0,181,232,0.08)]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00b5e8] to-[#0077aa] flex items-center justify-center shadow-neon">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">LazoStore</div>
              <div className="text-xs text-[#4a5568]">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-[rgba(0,181,232,0.1)] text-[#00b5e8] border border-[rgba(0,181,232,0.2)]'
                  : 'text-[#8892a4] hover:text-white hover:bg-[rgba(255,255,255,0.04)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={16} />
                {item.label}
              </div>
              {item.badge ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[rgba(0,181,232,0.08)]">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.02)] mb-2">
            <div className="w-8 h-8 rounded-full bg-[rgba(0,181,232,0.2)] flex items-center justify-center text-[#00b5e8] text-xs font-bold">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">{user?.email}</div>
              <div className="text-xs text-emerald-400">Admin</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 p-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
              <p className="text-sm text-[#8892a4]">Welcome back, Admin</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Products', value: stats.products, icon: Package, color: '#00b5e8' },
                { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: '#00b5e8' },
                { label: 'Pending', value: stats.pending, icon: Clock, color: '#f59e0b' },
                { label: 'Categories', value: stats.categories, icon: Tag, color: '#00b5e8' },
              ].map(stat => (
                <div key={stat.label} className="card-glass p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}
                    >
                      <stat.icon size={18} style={{ color: stat.color }} />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-[#4a5568]">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div>
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setActiveTab('products')} className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5">
                  <Plus size={15} /> Add Product
                </button>
                <button onClick={() => setActiveTab('orders')} className="btn-outline flex items-center gap-2 text-sm py-2.5 px-5">
                  <Eye size={15} /> View Orders
                </button>
                <Link href="/shop" target="_blank" className="btn-ghost flex items-center gap-2 text-sm py-2.5 px-5">
                  <Eye size={15} /> View Store
                </Link>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <h2 className="text-lg font-bold text-white mb-4">Recent Orders</h2>
              <RecentOrdersTable orders={recentOrders.slice(0, 5)} onStatusChange={updateOrderStatus} statusColors={statusColors} />
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Order Requests</h1>
            <RecentOrdersTable orders={recentOrders} onStatusChange={updateOrderStatus} statusColors={statusColors} showAll />
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && <AdminProducts />}

        {/* Categories Tab */}
        {activeTab === 'categories' && <AdminCategories />}

        {/* Settings Tab */}
        {activeTab === 'settings' && <AdminSettings />}
      </main>
    </div>
  )
}

function RecentOrdersTable({
  orders, onStatusChange, statusColors, showAll = false
}: {
  orders: OrderRequest[]
  onStatusChange: (id: string, status: string) => void
  statusColors: Record<string, string>
  showAll?: boolean
}) {
  if (orders.length === 0) {
    return (
      <div className="card-glass p-10 text-center">
        <ShoppingBag size={32} className="text-[rgba(0,181,232,0.2)] mx-auto mb-3" />
        <p className="text-[#8892a4]">No order requests yet</p>
      </div>
    )
  }

  return (
    <div className="card-glass overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.04)]">
              {['Customer', 'Product', 'Discord', 'Status', 'Date', 'Action'].map(h => (
                <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-[#4a5568] uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.03)]">
            {orders.map((order: any) => (
              <tr key={order.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                <td className="px-5 py-4">
                  <div className="text-sm font-medium text-white">{order.customer_name}</div>
                  <div className="text-xs text-[#4a5568]">{order.customer_email}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-sm text-[#8892a4] max-w-32 truncate">
  {order.product?.title || 'N/A'}
</div>
<div className="text-xs text-[#4a5568]">
  Qty: {order.quantity || 1}
</div>
                  {order.product?.price && (
                    <div className="text-xs text-[#00b5e8]">{formatPrice(order.product.price)}</div>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="text-sm text-[#8892a4]">{order.discord_username || '—'}</div>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[order.order_status] || ''}`}>
                    {order.order_status}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs text-[#4a5568]">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-4">
                  <select
                    value={order.order_status}
                    onChange={e => onStatusChange(order.id, e.target.value)}
                    className="text-xs bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] rounded-lg px-2 py-1.5 text-[#8892a4] cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const supabase = createClient()
    const [prodRes, catRes] = await Promise.all([
      supabase.from('products').select('*, category:categories(name)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*'),
    ])
    setProducts((prodRes.data as any) ?? [])
    setCategories(catRes.data ?? [])
    setLoading(false)
  }

  async function saveProduct() {
  if (!editingProduct) return

  setSaving(true)
  const supabase = createClient()

  const payload = {
    title: editingProduct.title?.trim() || '',
    slug: (editingProduct.slug || editingProduct.title || '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-'),
    short_description: editingProduct.short_description?.trim() || '',
    full_description: editingProduct.full_description?.trim() || '',
    price: Number(editingProduct.price) || 0,
    discount_price:
  editingProduct.discount_price == null
    ? null
    : Number(editingProduct.discount_price),
    thumbnail: editingProduct.thumbnail?.trim() || null,
    gallery_images: editingProduct.gallery_images || [],
    category_id: editingProduct.category_id || null,
    tags: editingProduct.tags || [],
    stock_quantity: Number(editingProduct.stock_quantity) || 0,
    minimum_quantity: Number((editingProduct as any).minimum_quantity) || 1,
    status: editingProduct.status || 'active',
    featured: editingProduct.featured || false,
    delivery_info: editingProduct.delivery_info?.trim() || '',
    discord_payment_note: editingProduct.discord_payment_note?.trim() || '',
  }

  if (!payload.title) {
    toast.error('Title is required')
    setSaving(false)
    return
  }

  if (!payload.slug) {
    toast.error('Slug is required')
    setSaving(false)
    return
  }

  try {
    let result

    if (editingProduct.id) {
      result = await supabase
        .from('products')
        .update(payload)
        .eq('id', editingProduct.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('products')
        .insert([payload])
        .select()
        .single()
    }

    if (result.error) {
      console.error('Product save failed:', result.error)
      toast.error(result.error.message || 'Failed to save product')
      setSaving(false)
      return
    }

    console.log('Saved product:', result.data)
    toast.success(editingProduct.id ? 'Product updated!' : 'Product created!')
    setEditingProduct(null)
    await loadData()
  } catch (err: any) {
    console.error('Unexpected save error:', err)
    toast.error(err?.message || 'Something went wrong while saving')
  } finally {
    setSaving(false)
  }
}

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    toast.success('Product deleted')
    loadData()
  }

  async function toggleFeatured(id: string, featured: boolean) {
    const supabase = createClient()
    await supabase.from('products').update({ featured: !featured }).eq('id', id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, featured: !featured } : p))
  }

  if (editingProduct !== null) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setEditingProduct(null)} className="btn-ghost text-sm">← Back</button>
          <h1 className="text-xl font-bold text-white">{editingProduct.id ? 'Edit Product' : 'New Product'}</h1>
        </div>

        <div className="card-glass p-8 space-y-6 max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: 'Title', key: 'title', type: 'text', placeholder: 'Product name' },
              { label: 'Slug', key: 'slug', type: 'text', placeholder: 'product-slug' },
              { label: 'Price', key: 'price', type: 'number', placeholder: '0.00' },
              { label: 'Discount Price', key: 'discount_price', type: 'number', placeholder: 'Optional' },
              { label: 'Stock Quantity', key: 'stock_quantity', type: 'number', placeholder: '0' },
              { label: 'Minimum Quantity', key: 'minimum_quantity', type: 'number', placeholder: '1' },
              { label: 'Thumbnail URL', key: 'thumbnail', type: 'text', placeholder: 'https://...' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wide">{field.label}</label>
                <input
                  type={field.type}
                  className="input-dark"
                  placeholder={field.placeholder}
                  value={(editingProduct as any)[field.key] || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, [field.key]: field.type === 'number' ? parseFloat(e.target.value) : e.target.value })}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wide">Category</label>
            <select
              className="input-dark bg-[rgba(255,255,255,0.03)] cursor-pointer"
              value={editingProduct.category_id || ''}
              onChange={e => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
            >
              <option value="">No category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wide">Status</label>
            <select
              className="input-dark bg-[rgba(255,255,255,0.03)] cursor-pointer"
              value={editingProduct.status || 'active'}
              onChange={e => setEditingProduct({ ...editingProduct, status: e.target.value as any })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wide">Short Description</label>
            <textarea rows={2} className="input-dark resize-none"
              placeholder="Brief product description..."
              value={editingProduct.short_description || ''}
              onChange={e => setEditingProduct({ ...editingProduct, short_description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wide">Full Description</label>
            <textarea rows={5} className="input-dark resize-none"
              placeholder="Detailed description..."
              value={editingProduct.full_description || ''}
              onChange={e => setEditingProduct({ ...editingProduct, full_description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wide">Tags (comma-separated)</label>
            <input type="text" className="input-dark"
              placeholder="tag1, tag2, tag3"
              value={Array.isArray(editingProduct.tags) ? editingProduct.tags.join(', ') : ''}
              onChange={e => setEditingProduct({ ...editingProduct, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wide">Delivery Info</label>
            <input type="text" className="input-dark" placeholder="e.g. Instant delivery via Discord"
              value={editingProduct.delivery_info || ''}
              onChange={e => setEditingProduct({ ...editingProduct, delivery_info: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wide">Discord Payment Note</label>
            <textarea rows={2} className="input-dark resize-none"
              placeholder="Instructions shown at checkout..."
              value={editingProduct.discord_payment_note || ''}
              onChange={e => setEditingProduct({ ...editingProduct, discord_payment_note: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={editingProduct.featured || false}
                onChange={e => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-[#8892a4]">Featured product</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={saveProduct} disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? 'Saving...' : (editingProduct.id ? 'Update Product' : 'Create Product')}
            </button>
            <button onClick={() => setEditingProduct(null)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <button onClick={() => setEditingProduct({})} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={15} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 shimmer rounded-xl" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <Package size={40} className="text-[rgba(0,181,232,0.2)] mx-auto mb-3" />
          <p className="text-[#8892a4] mb-4">No products yet</p>
          <button onClick={() => setEditingProduct({})} className="btn-primary text-sm">Create First Product</button>
        </div>
      ) : (
        <div className="card-glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.04)]">
                  {['Product', 'Price', 'Stock', 'Status', 'Featured', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-[#4a5568] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.03)]">
                {products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-white text-sm">{product.title}</div>
                      <div className="text-xs text-[#4a5568]">{product.category?.name}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#8892a4]">{formatPrice(product.discount_price || product.price)}</td>
                    <td className="px-5 py-4 text-sm text-[#8892a4]">{product.stock_quantity}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${
                        product.status === 'active' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                        product.status === 'out_of_stock' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                        'text-[#4a5568] bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.06)]'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleFeatured(product.id, product.featured)} className={`text-lg transition-all ${product.featured ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`}>
                        ⭐
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditingProduct(product)} className="text-xs text-[#00b5e8] hover:underline">Edit</button>
                        <span className="text-[#4a5568]">·</span>
                        <button onClick={() => deleteProduct(product.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [newCat, setNewCat] = useState({ name: '', slug: '', description: '', icon: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadCategories() }, [])

  async function loadCategories() {
    const supabase = createClient()
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data ?? [])
  }

  async function createCategory(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    await supabase.from('categories').insert([{
      ...newCat,
      slug: newCat.slug || newCat.name.toLowerCase().replace(/\s+/g, '-'),
    }])
    toast.success('Category created!')
    setNewCat({ name: '', slug: '', description: '', icon: '' })
    setSaving(false)
    loadCategories()
  }

  async function deleteCategory(id: string) {
    if (!confirm('Delete this category?')) return
    const supabase = createClient()
    await supabase.from('categories').delete().eq('id', id)
    toast.success('Category deleted')
    loadCategories()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Categories</h1>

      <div className="card-glass p-6 max-w-lg">
        <h2 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">Add Category</h2>
        <form onSubmit={createCategory} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#4a5568] mb-1.5 uppercase tracking-wide">Name *</label>
              <input type="text" required className="input-dark text-sm" placeholder="Category name"
                value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-[#4a5568] mb-1.5 uppercase tracking-wide">Icon</label>
              <input type="text" className="input-dark text-sm" placeholder="🎮 or emoji"
                value={newCat.icon} onChange={e => setNewCat({ ...newCat, icon: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#4a5568] mb-1.5 uppercase tracking-wide">Description</label>
            <input type="text" className="input-dark text-sm" placeholder="Optional description"
              value={newCat.description} onChange={e => setNewCat({ ...newCat, description: e.target.value })} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary text-sm py-2.5 flex items-center gap-2">
            <Plus size={14} /> {saving ? 'Creating...' : 'Create Category'}
          </button>
        </form>
      </div>

      <div className="card-glass overflow-hidden max-w-2xl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.04)]">
              {['Icon', 'Name', 'Slug', 'Action'].map(h => (
                <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-[#4a5568] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.03)]">
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-[rgba(255,255,255,0.02)]">
                <td className="px-5 py-3 text-lg">{cat.icon || '📦'}</td>
                <td className="px-5 py-3 text-sm text-white font-medium">{cat.name}</td>
                <td className="px-5 py-3 text-xs text-[#4a5568] font-mono">{cat.slug}</td>
                <td className="px-5 py-3">
                  <button onClick={() => deleteCategory(cat.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminSettings() {
  const [settings, setSettings] = useState({ discord_link: '', store_name: '', store_tagline: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadSettings() }, [])

  async function loadSettings() {
    const supabase = createClient()
    const { data } = await supabase.from('site_settings').select('key, value')
    if (data) {
      const map = Object.fromEntries(data.map((s: any) => [s.key, s.value]))
      setSettings(prev => ({ ...prev, ...map }))
    }
    setLoading(false)
  }

  async function saveSetting(key: string, value: string) {
    const supabase = createClient()
    await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' })
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await Promise.all(Object.entries(settings).map(([k, v]) => saveSetting(k, v)))
    toast.success('Settings saved!')
    setSaving(false)
  }

  if (loading) return <div className="text-[#8892a4] text-sm">Loading settings...</div>

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-white">Settings</h1>
      <div className="card-glass p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wide">Discord Server Link</label>
            <input type="url" className="input-dark" placeholder="https://discord.gg/your-server"
              value={settings.discord_link}
              onChange={e => setSettings({ ...settings, discord_link: e.target.value })}
            />
            <p className="text-xs text-[#4a5568] mt-1.5">This is shown to customers when they buy a product.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wide">Store Name</label>
            <input type="text" className="input-dark" placeholder="LazoStore"
              value={settings.store_name}
              onChange={e => setSettings({ ...settings, store_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#8892a4] mb-2 uppercase tracking-wide">Store Tagline</label>
            <input type="text" className="input-dark" placeholder="Premium digital products via Discord"
              value={settings.store_tagline}
              onChange={e => setSettings({ ...settings, store_tagline: e.target.value })}
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? 'Saving...' : '💾 Save Settings'}
          </button>
        </form>
      </div>
    </div>
  )
}
