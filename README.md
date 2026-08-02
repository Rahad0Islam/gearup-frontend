<div align="center">

# 🎒 GearUp — Gear Rental Marketplace

**A modern, full-stack gear rental platform built with Next.js 16, React 19, and TypeScript.**

Browse, list, and rent outdoor and adventure gear — with role-based dashboards for Customers, Providers, and Admins, secure Stripe checkout, and real-time order management.

🌐 **Live:** [https://gearup-rental.vercel.app/](https://gearup-rental.vercel.app/)

</div>

---

## ✨ Features

### 🛍️ Public Marketplace
- Browse gear catalog with search, filter, sort, and pagination
- Category-driven browsing (`/gear/category/[id]`)
- Detailed gear pages with image gallery, pricing, stock, and reviews
- Responsive, mobile-first UI with dark mode

### 🔐 Authentication & Authorization
- JWT-based session with secure `httpOnly` cookies (access + refresh tokens)
- Silent token refresh via Next.js `proxy.ts`
- Role-based routing: **CUSTOMER · PROVIDER · ADMIN**
- Three role-specific dashboards with route guards

### 👤 Customer Dashboard
- Browse & rent gear in a single checkout flow
- Track rental orders: `PLACED → CONFIRMED → PAID → PICKED_UP → RETURNED`
- Stripe checkout integration for `RENTAL` and `LATE_FEE` payments
- Payment history with filters (type, status, method)
- Leave & edit reviews on completed rentals

### 🏪 Provider Dashboard
- Manage gear listings (create, edit, delete)
- Track stock, pricing, and discount per item
- Order lifecycle actions: **Confirm · Pickup · Return · Cancel**
- Earnings & status overview

### 🛡️ Admin Dashboard
- Full user management with paginated table and search
- Suspend / activate users with one click
- Category CRUD (create, edit, delete)
- All-orders oversight and payment monitoring

### 🎨 UX & Performance
- Loading skeletons for every data-fetching route
- Mobile-responsive navbar with nested accordion menus
- Framer Motion animations on cards, sheets, and transitions
- Toast notifications via Sonner
- Optimistic revalidation with `revalidatePath`

---

## 🧰 Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Server Actions, `proxy.ts`) |
| **UI** | React 19, TypeScript 5 |
| **Styling** | Tailwind CSS 4, `tw-animate-css`, dark mode via `next-themes` |
| **Components** | [shadcn/ui](https://ui.shadcn.com), Radix UI, Lucide icons |
| **Animation** | Framer Motion, `motion` |
| **Forms & Validation** | react-hook-form, Zod |
| **Auth** | JWT (`jsonwebtoken`), secure cookies, silent refresh |
| **Payments** | Stripe Checkout (server-side session creation) |
| **State / Cache** | React Server Components, Server Actions, `revalidatePath` / `revalidateTag` |
| **Notifications** | Sonner |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
.
├── app/
│   ├── (authGroup)/         # /login, /register
│   ├── (dashboardGroup)/    # role-scoped dashboards
│   │   ├── admin-dashboard/
│   │   ├── customer-dashboard/
│   │   └── provider-dashboard/
│   ├── (publicGroup)/       # /, /gear, /gear/[id], /gear/category/[id]
│   ├── loading.tsx          # global fallback
│   └── not-found.tsx        # global 404
│
├── components/              # shared UI (navbar, footer, shadcn primitives)
│
├── fearture/                # feature-scoped modules
│   ├── admin/               # admin actions & components
│   ├── customer/            # customer sidebar
│   ├── dashboard/           # sidebar config + shared skeleton
│   ├── gear/                # public gear actions & views
│   ├── provider/            # provider gear & order views
│   ├── rental-order/        # rental, payment, history
│   └── review/              # review dialog & actions
│
├── hooks/                   # shared React hooks
├── lib/                     # utilities (cn, etc.)
├── public/                  # static assets
│
├── proxy.ts                 # Next.js 16 middleware (token refresh + guards)
├── next.config.ts
├── tailwind / postcss / prettier configs
└── API_INTEGRATION.md       # endpoint ↔ component mapping
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** (recommended) — `npm install -g pnpm`
- A running backend that exposes the `/api/v1/*` endpoints (see [`API_INTEGRATION.md`](./API_INTEGRATION.md))

### 1. Clone & install

```bash
git clone https://github.com/Rahad0Islam/gearup-frontend.git
cd gearup-frontend
pnpm install
```

### 2. Configure environment

Create a `.env.local` (or `.env`) at the project root:

```env
# Backend API
BACKEND_URL=http://localhost:5000

# JWT secrets (must match backend)
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### 3. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Production build

```bash
pnpm build
pnpm start
```

---

## 📜 Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | TypeScript check (no emit) |
| `pnpm format` | Format with Prettier |

---

## 🔌 API Integration

The frontend consumes a REST API at `${BACKEND_URL}/api/v1/*`. Endpoints are wrapped in **Server Actions** under each feature folder, then invoked from Server / Client Components.

📖 See [`API_INTEGRATION.md`](./API_INTEGRATION.md) for the complete endpoint ↔ component ↔ UI mapping, supported query params, response shape, and coverage matrix.

**Highlights**

- All authenticated calls forward the `accessToken` cookie as `Cookie: accessToken=...`.
- `proxy.ts` automatically refreshes an expired access token using the refresh token before any guarded route.
- Mutations call `revalidatePath()` to keep server-rendered views fresh.

---

## 👥 Roles at a Glance

| Role | Landing | Capabilities |
| --- | --- | --- |
| **CUSTOMER** | `/customer-dashboard` | Browse, rent, pay via Stripe, leave reviews, view history |
| **PROVIDER** | `/provider-dashboard` | Manage own gear, process orders, track returns |
| **ADMIN** | `/admin-dashboard` | Manage users, categories, monitor all orders & payments |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/awesome`
3. Commit changes: `git commit -m "feat: add awesome"`
4. Push & open a Pull Request

Run `pnpm lint` and `pnpm typecheck` before submitting.

---

## 📄 License

This project is private and unlicensed unless explicitly stated otherwise.

---

<div align="center">

Made with ❤️ by **[Rahad0Islam](https://github.com/Rahad0Islam)**

🌐 [gearup-rental.vercel.app](https://gearup-rental.vercel.app/)

</div>
