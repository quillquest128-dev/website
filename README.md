# ⚡ LazoStore – Premium Digital Products Store

A production-ready digital storefront with a **black + neon blue** aesthetic, built with Next.js 14, Supabase, and a Discord-based manual payment flow. Deploy instantly to Netlify.

---

## 🌟 Features

- **Modern UI**: Black + neon blue, rounded cards, floating animations, smooth hover effects
- **Product Management**: Full catalog with categories, tags, stock tracking, featured flags
- **Discord Payment Flow**: No automatic payment processors — all payments via Discord
- **Admin Dashboard**: Secure Supabase auth-protected admin panel
- **Responsive**: Mobile, tablet, and desktop optimized
- **Performance**: Static regeneration, image optimization, skeleton loading states
- **Netlify-ready**: One-click deploy with environment variables

---

## 🏗 Project Structure

```
lazo-store/
├── app/
│   ├── page.tsx               # Homepage
│   ├── layout.tsx             # Root layout (Navbar, Footer, Toaster)
│   ├── globals.css            # Global styles + Tailwind
│   ├── shop/
│   │   └── page.tsx           # Shop listing with filters
│   ├── product/
│   │   └── [slug]/
│   │       └── page.tsx       # Product detail page
│   ├── faq/page.tsx
│   ├── contact/page.tsx
│   ├── terms/page.tsx
│   ├── privacy/page.tsx
│   ├── admin/
│   │   ├── login/page.tsx     # Admin login
│   │   └── dashboard/page.tsx # Full admin dashboard
│   └── api/
│       ├── products/route.ts
│       ├── categories/route.ts
│       └── orders/route.ts
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── store/
│       ├── ProductCard.tsx    # Floating animated product cards
│       ├── DiscordModal.tsx   # Purchase flow modal
│       ├── StockBadge.tsx     # In/Low/Out of stock indicator
│       └── ProductSkeleton.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser client
│   │   └── server.ts          # Server client
│   ├── products.ts            # Data fetching helpers
│   └── utils.ts               # Utility functions
├── types/
│   └── index.ts               # TypeScript types
├── middleware.ts               # Admin route protection
├── supabase/
│   └── schema.sql             # Full DB schema + seed data
├── netlify.toml               # Netlify config
└── .env.example               # Environment variables template
```

---

## 🚀 Setup Guide

### 1. Clone & Install

```bash
git clone <your-repo>
cd lazo-store
npm install
```

### 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Open the **SQL Editor** and run the contents of `supabase/schema.sql`
3. This will create all tables, RLS policies, and seed sample data
4. Go to **Project Settings → API** and copy your:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **Anon/Public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 3. Create Admin User

**Option A (Dashboard):**
1. Go to Supabase Dashboard → Authentication → Users
2. Click **"Invite user"** with your admin email
3. Set a password via the invite email

**Option B (SQL):**
```sql
-- In Supabase SQL Editor:
SELECT supabase_auth.create_user(
  email := 'admin@yourstore.com',
  password := 'your-secure-password'
);
```

**Option C (Supabase CLI):**
```bash
supabase auth admin create-user \
  --email admin@yourstore.com \
  --password your-secure-password
```

### 4. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_DISCORD_LINK=https://discord.gg/your-server
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Locally

```bash
npm run dev
# Open http://localhost:3000
# Admin: http://localhost:3000/admin/login
```

---

## ☁️ Deploy to Netlify

### Option A: Netlify UI

1. Push your project to GitHub
2. Go to [netlify.com](https://netlify.com) → **New site from Git**
3. Connect your GitHub repository
4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Add environment variables in **Site Settings → Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   NEXT_PUBLIC_DISCORD_LINK
   NEXT_PUBLIC_APP_URL
   ```
6. Install the **Netlify Next.js plugin**: `@netlify/plugin-nextjs` (auto-detected via netlify.toml)
7. Click **Deploy site**

### Option B: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify env:set NEXT_PUBLIC_SUPABASE_URL "your-url"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your-key"
netlify env:set NEXT_PUBLIC_DISCORD_LINK "https://discord.gg/your-server"
netlify deploy --prod
```

---

## 🛠 Admin Dashboard Guide

Access the admin dashboard at `/admin/login` with your Supabase credentials.

### Features:
- **Overview**: Stats for products, orders, pending requests, categories
- **Orders**: View all purchase requests, update status (Pending → Contacted → Completed/Cancelled)
- **Products**: Full CRUD – add, edit, delete products; toggle featured; update stock
- **Categories**: Manage categories with icons
- **Settings**: Update Discord link, store name, and tagline

---

## 🛒 Purchase Flow

1. Customer browses store, finds a product, clicks **"Buy Now"**
2. A modal opens asking for:
   - Name (required)
   - Email (required)
   - Discord username (optional)
   - Notes (optional)
3. An order request is saved to Supabase with status `pending`
4. Customer is shown **step-by-step Discord instructions**
5. A **"Join Discord Server"** button links them to your Discord
6. Your team fulfills the order manually on Discord and updates the status

---

## 🗄 Database Schema

| Table | Description |
|-------|-------------|
| `products` | Product catalog with all fields |
| `categories` | Product categories |
| `order_requests` | Customer purchase intents |
| `site_settings` | Key-value store for settings |

Row Level Security (RLS) is enabled on all tables:
- **Public**: Can read active products, all categories, and settings; can create order requests
- **Authenticated (Admin)**: Full CRUD access to everything

---

## 🎨 Design System

- **Font**: Syne (Display + Body) + JetBrains Mono (Code)
- **Primary**: `#00b5e8` (Neon Blue)
- **Background**: `#050505` (Near Black)
- **Cards**: `#0d0d14` with 1px neon border
- **Border**: `rgba(0, 181, 232, 0.15)` → `rgba(0, 181, 232, 0.4)` on hover
- **Glow**: `box-shadow: 0 0 20px rgba(0, 181, 232, 0.4)`

---

## 📝 Adding Products

In the Admin Dashboard → Products → Add Product, fill in:
- **Title & Slug**: Product name and URL-friendly slug
- **Descriptions**: Short (card preview) and Full (detail page)
- **Price & Discount Price**: Set both for sale pricing
- **Thumbnail**: URL of the product image
- **Category & Tags**: For filtering
- **Stock Quantity**: Set to 0 to mark as Out of Stock
- **Status**: Active / Inactive / Out of Stock
- **Delivery Info**: Shown on product page
- **Discord Payment Note**: Shown in checkout modal
- **Featured**: Pin to homepage featured section

---

## 📋 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase public anon key |
| `NEXT_PUBLIC_DISCORD_LINK` | ✅ | Discord server invite link |
| `NEXT_PUBLIC_APP_URL` | Optional | Your app's base URL |

---

## 🤝 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database & Auth**: Supabase (PostgreSQL + RLS)
- **Styling**: Tailwind CSS 3 + Custom CSS
- **Icons**: Lucide React
- **Toasts**: React Hot Toast
- **Deployment**: Netlify

---

## 📄 License

MIT License. Use freely for personal or commercial projects.
