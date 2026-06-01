# Restaurant Ordering & Kitchen Management System

A modern, production-grade restaurant operations platform built with React, TypeScript, and Tailwind CSS.

## System Overview

### Architecture
- **Frontend Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom dark luxury theme
- **UI Components**: shadcn/ui + custom components
- **State Management**: React Context API
- **Data Persistence**: localStorage with mock data

### User Roles
1. **Admin** - Full system access with login authentication
2. **Waiter** - Table ordering and delivery management (no login required)
3. **Kitchen Staff** - Order preparation queue (no login required)
4. **Customer** - External ordering interface (separate customer portal)

## Core Features

### 1. Authentication System
- Admin login with mock credentials
- Session persistence via localStorage
- Protected routes for admin-only features
- Auto-redirect to login for unauthenticated access

### 2. Table Management
- Real-time table status tracking
- Status: Available, Occupied, Cleaning
- Table assignment to orders
- Capacity management (2-8 seats)
- Multi-floor support

### 3. Menu Management
- Category-based organization
- Food items with pricing
- Vegetarian/Non-vegetarian indicators
- Spice level tracking (Mild, Medium, Hot, Extra-Hot)
- Preparation time estimation
- Availability toggle

### 4. Order Workflow
1. **Waiter Places Order**
   - Select table
   - Browse menu
   - Add items to cart
   - Place order (status: Pending)

2. **Kitchen Processing**
   - Pending → Preparing → Ready → Completed
   - Real-time queue updates
   - Priority handling for long-wait orders

3. **Delivery & Payment**
   - Ready orders for delivery
   - Bill details display
   - Payment status tracking (Pending/Paid)

### 5. Analytics & Reports
- **Dashboard Metrics**
  - Total orders
  - Active orders
  - Completed orders
  - Total revenue
  - Table occupancy
  - Top-selling items

- **Analytics Charts**
  - Revenue trends (Daily/Weekly/Monthly)
  - Item-wise quantity sold
  - Revenue per item
  - Peak business hours
  - Table utilization
  - Order status distribution

- **Export Functionality**
  - CSV report export
  - Real-time data updates

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Auth routes (login)
│   ├── admin/               # Admin dashboard & management
│   │   ├── dashboard/       # Analytics overview
│   │   ├── kitchen/         # Kitchen queue
│   │   ├── menu/            # Menu management
│   │   ├── orders/          # Order tracking
│   │   ├── tables/          # Table management
│   │   ├── waiter/          # Waiter delivery
│   │   ├── reports/         # Analytics & reports
│   │   └── settings/        # System settings
│   ├── waiter/              # Waiter portal
│   │   ├── orders/          # Active orders
│   │   └── delivery/        # Ready orders delivery
│   └── customer/            # Customer-facing interface
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── shell/               # Layout components
│   └── app/                 # App-specific components
├── hooks/                   # Custom React hooks
│   ├── use-auth.tsx
│   ├── use-tables.tsx
│   ├── use-orders.tsx
│   ├── use-cart.tsx
│   └── use-toast.tsx
├── data/
│   ├── mock-menu.ts
│   ├── mock-orders.ts
│   ├── mock-tables.ts
│   ├── mock-analytics.ts
│   └── types.ts
└── lib/
    ├── auth/
    ├── formatters.ts
    ├── formatters-advanced.ts
    └── constants.ts
```

## Key Components

### Reusable UI Components
- **StatCard** - Premium analytics cards with trend indicators
- **DataTable** - Searchable, sortable, filterable data tables
- **ProtectedRoute** - Route protection for admin features
- **Toast** - Notification system for user feedback

### Premium Features
- Dark luxury theme with gold accents
- Smooth animations and transitions
- Responsive layouts (desktop, tablet, mobile)
- Interactive charts with Recharts
- Sticky table headers
- Status badges with color coding
- Real-time updates via localStorage

## Data Models

### Order Status Flow
```
Pending → Preparing → Ready → Completed
```

### Payment Status
- Pending (unpaid)
- Paid (collected)

### Table Status
- Available (ready for booking)
- Occupied (has active order)
- Cleaning (being prepared)

## API Endpoints

### Mock Data Endpoints
- `/api/health` - System health check
- `/api/auth/*` - Authentication endpoints
- `/api/dashboard/*` - Dashboard analytics
- `/api/orders/*` - Order management
- `/api/tables/*` - Table management
- `/api/menu/*` - Menu management

## Setup & Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Type Checking
```bash
npm run type-check
```

## Default Credentials

**Admin Login:**
- Email: `admin@restaurant.com`
- Password: `admin123`

## Customization

### Adding New Menu Items
Edit `src/data/mock-menu.ts`:
```typescript
{
  id: 'm-new',
  name: 'Item Name',
  description: 'Item description',
  price: 250,
  categoryId: 'cat-1',
  image: '🍽️',
  isAvailable: true,
  isVeg: true,
  spiceLevel: 'medium',
  preparationTime: 20,
  rating: 4.5,
  orderCount: 0,
}
```

### Adding New Tables
Edit `src/data/mock-tables.ts`:
```typescript
{
  id: 't-new',
  number: 13,
  seats: 4,
  status: 'available',
  floor: 1,
}
```

## Production Deployment

### Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Build for Production
```bash
npm run build
npm start
```

## Support & Maintenance

### Troubleshooting
- Clear localStorage if data becomes inconsistent
- Check browser console for errors
- Verify TypeScript compilation: `npm run type-check`

### Data Persistence
All data is persisted in localStorage:
- Tables: `aura_tables`
- Orders: `aura_orders`
- Cart: `aura_cart` (sessionStorage)
- Admin user: `aura_admin_user`

### Reset Sandbox
Use the "Factory Reset Sandbox" button in Settings to clear all data.

## License

MIT License - See LICENSE file for details.

## Acknowledgments

- Built with Next.js, React, and TypeScript
- UI components powered by shadcn/ui
- Charts powered by Recharts
- Icons from Lucide React

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready
