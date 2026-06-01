# Waiter Ordering Module - Complete Documentation

## Overview

The Waiter Ordering Module is a comprehensive restaurant management system designed specifically for waiters to efficiently manage table orders, browse menus, and send orders directly to the kitchen. The system features a modern, responsive interface with real-time order tracking and management.

## Module Structure

```
src/app/waiter/
├── layout.tsx                 # Waiter section layout with navigation
├── page.tsx                   # Main ordering page (menu + cart)
├── dashboard/
│   └── page.tsx              # Waiter dashboard with stats
├── tables/
│   └── page.tsx              # Table selection page
└── orders/
    └── page.tsx              # Active orders management

src/components/ui/
├── order-confirmation-modal.tsx    # Order confirmation UI
├── menu-item-card.tsx              # Menu item display card
├── cart-summary.tsx                # Cart summary component
└── table-selection-card.tsx        # Table selection card
```

## Features

### 1. Waiter Dashboard (`/waiter/dashboard`)
- **Quick Stats**: Available tables, occupied tables, active orders, today's revenue
- **Quick Actions**: New order, active orders shortcuts
- **Recent Orders**: Display of latest orders with status
- **Table Status Overview**: Visual grid of all restaurant tables

### 2. Table Selection (`/waiter/tables`)
- **Visual Floor Plan**: Grid-based table display
- **Table Status Indicators**: Available (green), Occupied (blue), Cleaning (amber)
- **Table Details**: Seats, floor number, features
- **Selection Panel**: Sticky panel showing selected table details
- **Responsive Design**: Works on mobile, tablet, and desktop

### 3. Menu Ordering (`/waiter`)
- **Category Navigation**: Browse menu by categories (Starters, Main Course, etc.)
- **Search Functionality**: Search menu items by name or description
- **Item Details**: Name, price, description, prep time, spice level, dietary info
- **Cart Management**: Add/remove items, adjust quantities
- **Special Instructions**: Add notes for kitchen (allergies, preferences)
- **Order Summary**: Subtotal, tax, total calculation
- **Order Placement**: Send order directly to kitchen

### 4. Active Orders (`/waiter/orders`)
- **Order Filtering**: Filter by status (pending, preparing, ready)
- **Search**: Search by table number, order ID, or item name
- **Order Cards**: Display order details with status badges
- **Order Timeline**: Track order creation and update times
- **Special Instructions Display**: Show kitchen notes
- **Order Details Sidebar**: Click to view full order information

## Workflow

### Complete Order Taking Flow

```
1. Waiter Dashboard
   ↓
2. Select "New Order" or navigate to Table Selection
   ↓
3. Choose Available Table
   ↓
4. Table marked as "Occupied"
   ↓
5. Browse Menu by Categories
   ↓
6. Search for Specific Items
   ↓
7. Add Items to Cart
   ↓
8. Adjust Quantities
   ↓
9. Add Special Instructions (if needed)
   ↓
10. Review Cart Summary
    ↓
11. Place Order
    ↓
12. Order Sent to Kitchen Queue
    ↓
13. Success Notification
    ↓
14. Cart Cleared
    ↓
15. Ready for Next Order
```

## Data Models

### Table Status
```typescript
type TableStatus = 'available' | 'occupied' | 'cleaning';

interface Table {
  id: string;
  number: number;
  seats: number;
  floor: number;
  status: TableStatus;
  currentOrderId?: string;
}
```

### Order Status
```typescript
type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed';

interface Order {
  id: string;
  tableId: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid';
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Menu Item
```typescript
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  isAvailable: boolean;
  isVeg: boolean;
  spiceLevel: 'mild' | 'medium' | 'hot';
  preparationTime: number;
  rating: number;
  orderCount: number;
}
```

## Navigation Structure

### Sidebar Navigation
- **Dashboard** - Overview and quick actions
- **Select Table** - Choose table for ordering
- **Take Order** - Browse menu and place orders
- **Active Orders** - View all active orders

### Quick Links
- Waiter Portal Header with date/time
- Logout button in sidebar footer
- Mobile hamburger menu for responsive design

## Components

### OrderConfirmationModal
Displays order confirmation with customizable type (success, pending, error).

```typescript
<OrderConfirmationModal
  isOpen={true}
  type="success"
  title="Order Placed!"
  message="Order sent to kitchen queue"
  orderNumber="ORD-001"
  tableNumber={5}
  itemCount={3}
  totalAmount="₹850"
  onClose={() => {}}
/>
```

### MenuItemCard
Displays individual menu items with add/quantity controls.

```typescript
<MenuItemCard
  item={menuItem}
  quantity={cartItem?.quantity}
  onAdd={(item, qty) => {}}
  onUpdateQuantity={(id, qty) => {}}
  onRemove={(id) => {}}
/>
```

### CartSummary
Sticky cart panel showing items, totals, and checkout.

```typescript
<CartSummary
  itemCount={3}
  items={cartItems}
  subtotal={750}
  tax={37.5}
  total={787.5}
  specialInstructions=""
  onSpecialInstructionsChange={(val) => {}}
  onPlaceOrder={() => {}}
  onClearCart={() => {}}
/>
```

### TableSelectionCard
Displays individual table with status and selection.

```typescript
<TableSelectionCard
  table={table}
  isSelected={false}
  isDisabled={false}
  onSelect={(id, num) => {}}
  showDetails={false}
/>
```

## Hooks Used

### useCart
Manages shopping cart state and operations.
```typescript
const {
  items,
  tableId,
  tableNumber,
  selectTable,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  subtotal,
  tax,
  total,
  itemCount
} = useCart();
```

### useOrders
Manages order creation and status updates.
```typescript
const {
  orders,
  placeOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder
} = useOrders();
```

### useTables
Manages table status and operations.
```typescript
const {
  tables,
  selectTable,
  occupyTable,
  setCleaningStatus,
  addTable,
  deleteTable
} = useTables();
```

### useToast
Displays toast notifications.
```typescript
const { addToast } = useToast();
addToast({
  title: 'Success',
  description: 'Order placed successfully',
  type: 'success'
});
```

## Menu Data

### Categories (6 total)
1. **Starters** (5 items) - 🥗
2. **Main Course** (6 items) - 🍛
3. **Biryani & Rice** (4 items) - 🍚
4. **Breads** (4 items) - 🫓
5. **Beverages** (4 items) - 🥤
6. **Desserts** (4 items) - 🍮

### Total Menu Items: 27

Each item includes:
- Name and description
- Price in rupees
- Preparation time
- Spice level (mild/medium/hot)
- Vegetarian indicator
- Customer rating
- Order count

## Styling & Theme

### Color Scheme
- **Primary**: Gold (#FFD700)
- **Success**: Emerald (#10B981)
- **Warning**: Amber (#F59E0B)
- **Info**: Blue (#3B82F6)
- **Destructive**: Red (#EF4444)
- **Background**: Dark surface colors

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Key Classes
- `.glass` - Glassmorphism effect
- `.gold-text` - Gold color text
- `.animate-scale-in` - Scale animation
- `.animate-fade-in` - Fade animation

## State Management

### Context Providers (in layout.tsx)
1. **ToastProvider** - Toast notifications
2. **AuthProvider** - Authentication
3. **TablesProvider** - Table management
4. **OrdersProvider** - Order management
5. **CartProvider** - Shopping cart

### LocalStorage Keys
- `aura_tables` - Table data
- `aura_orders` - Order data
- `aura_cart` - Cart data
- `aura_admin_user` - Admin authentication

## API Integration Points

### Order Placement
```typescript
placeOrder(tableId, tableNumber, items, notes)
// Returns: orderId
// Updates: Table status to 'occupied'
// Sends: Order to kitchen queue
```

### Order Status Updates
```typescript
updateOrderStatus(orderId, status)
// Updates: Order status in real-time
// Syncs: With table status
```

### Table Operations
```typescript
selectTable(tableId, tableNumber)
occupyTable(tableId, orderId)
setCleaningStatus(tableId)
```

## Error Handling

### Validation
- Table must be selected before ordering
- Cart must have items before placing order
- Special instructions are optional

### User Feedback
- Toast notifications for all actions
- Success/error modals for order placement
- Loading states during operations
- Disabled states for invalid actions

## Performance Optimizations

1. **Memoization**: useMemo for filtered orders and items
2. **Lazy Loading**: Components load on demand
3. **Sticky Positioning**: Cart sidebar stays visible
4. **Responsive Images**: Emoji-based icons (no image loading)
5. **Efficient Filtering**: Real-time search with debouncing

## Accessibility Features

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliance
- Focus indicators on buttons
- Screen reader friendly

## Mobile Responsiveness

- Hamburger menu on mobile
- Stacked layout on small screens
- Touch-friendly button sizes
- Optimized card layouts
- Scrollable sections

## Future Enhancements

1. **Real-time Sync**: WebSocket integration for live updates
2. **Order History**: Archive and analytics
3. **Customer Preferences**: Save favorite orders
4. **Multi-language**: Internationalization support
5. **Payment Integration**: Online payment processing
6. **Delivery Tracking**: Real-time order tracking
7. **Inventory Management**: Stock level updates
8. **Staff Management**: Waiter performance metrics

## Troubleshooting

### Table Not Showing as Selected
- Ensure table status is 'available'
- Check if cart context is properly initialized
- Verify table ID is being passed correctly

### Orders Not Appearing in Kitchen
- Check if order was successfully placed
- Verify orders context is initialized
- Check localStorage for order data

### Cart Items Not Persisting
- Verify CartProvider is in layout
- Check localStorage permissions
- Clear browser cache if needed

### Menu Items Not Displaying
- Ensure mockMenuItems are imported
- Check category filter is set correctly
- Verify search term is not filtering all items

## Support & Maintenance

For issues or feature requests:
1. Check the troubleshooting section
2. Review component props and usage
3. Verify data models match types
4. Check browser console for errors
5. Ensure all providers are initialized

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready