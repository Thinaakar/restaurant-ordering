# Waiter Ordering Module - Quick Start Guide

## 🚀 Getting Started

### Access the Waiter Portal

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open in browser**
   ```
   http://localhost:3000
   ```

3. **Navigate to Waiter Portal**
   - Click "Operations Portal" on homepage
   - Or go directly to: `http://localhost:3000/waiter/dashboard`

---

## 📍 Navigation Map

```
Waiter Portal
├── Dashboard (/waiter/dashboard)
│   ├─ Quick Stats
│   ├─ Quick Actions
│   ├─ Recent Orders
│   └─ Table Overview
│
├── Select Table (/waiter/tables)
│   ├─ Floor Plan
│   ├─ Table Selection
│   └─ Table Details
│
├── Take Order (/waiter)
│   ├─ Menu Categories
│   ├─ Search Items
│   ├─ Add to Cart
│   └─ Place Order
│
└── Active Orders (/waiter/orders)
    ├─ Filter by Status
    ├─ Search Orders
    └─ View Details
```

---

## 📋 Step-by-Step Workflow

### 1️⃣ Start from Dashboard
```
URL: /waiter/dashboard
- View available tables
- View active orders
- See today's revenue
- Click "New Order" to start
```

### 2️⃣ Select a Table
```
URL: /waiter/tables
- See all restaurant tables
- Green = Available
- Blue = Occupied
- Amber = Cleaning
- Click available table to select
- Confirm selection
```

### 3️⃣ Browse Menu
```
URL: /waiter
- Table number shown at top
- 6 category tabs available
- Click category to filter
- Search for specific items
- View item details
```

### 4️⃣ Add Items to Cart
```
- Click "Add" button on item
- Adjust quantity with +/- buttons
- Item appears in cart sidebar
- Add special instructions if needed
```

### 5️⃣ Review Cart
```
- See all items in cart
- View subtotal, tax, total
- Add special instructions
- Adjust quantities anytime
- Clear cart if needed
```

### 6️⃣ Place Order
```
- Click "Place Order" button
- See success confirmation
- Order sent to kitchen
- Cart clears automatically
```

### 7️⃣ Track Orders
```
URL: /waiter/orders
- View all active orders
- Filter by status
- Search by table/order ID
- Click to see full details
- Track order progress
```

---

## 🎯 Quick Tips

### Menu Navigation
- **Search**: Type item name to find quickly
- **Categories**: Use tabs to browse by type
- **Filters**: Status filter shows available items only

### Cart Management
- **Quantity**: Use +/- buttons to adjust
- **Remove**: Click X to remove item
- **Clear**: Clear all items at once
- **Special Notes**: Add allergies/preferences

### Order Tracking
- **Status Colors**:
  - 🟡 Amber = Pending (waiting to start)
  - 🔵 Blue = Preparing (being cooked)
  - 🟢 Green = Ready (ready for delivery)
- **Search**: Find orders by table number
- **Details**: Click order to see full information

---

## 💡 Pro Tips

### Efficiency Tips
1. **Batch Orders**: Take multiple orders before placing
2. **Search First**: Use search for faster item finding
3. **Special Instructions**: Add notes for kitchen upfront
4. **Check Status**: Monitor active orders regularly

### Best Practices
1. **Confirm Table**: Always confirm table selection
2. **Review Cart**: Check totals before placing
3. **Add Notes**: Include dietary restrictions
4. **Track Progress**: Monitor order status

### Mobile Tips
1. **Hamburger Menu**: Use menu icon on mobile
2. **Scroll**: Swipe to scroll through items
3. **Tap**: Use tap instead of hover
4. **Landscape**: Rotate for better view

---

## 🔍 Finding Things

### Find a Menu Item
```
1. Go to /waiter
2. Use search box at top
3. Type item name
4. Results filter automatically
```

### Find an Order
```
1. Go to /waiter/orders
2. Use search box
3. Type table number or order ID
4. Results appear instantly
```

### Find a Table
```
1. Go to /waiter/tables
2. Look at floor plan
3. Green tables are available
4. Click to select
```

---

## 📊 Dashboard Metrics

### Available Tables
- Shows count of empty tables
- Click "New Order" to select one

### Occupied Tables
- Shows count of tables with customers
- View their orders in Active Orders

### Active Orders
- Shows pending + preparing orders
- Click to view details

### Today's Revenue
- Total sales for the day
- Updates as orders complete

---

## 🎨 Understanding Status Colors

### Table Status
- 🟢 **Green (Available)**: Ready for new customers
- 🔵 **Blue (Occupied)**: Currently serving customers
- 🟡 **Amber (Cleaning)**: Being prepared

### Order Status
- 🟡 **Amber (Pending)**: Waiting to start cooking
- 🔵 **Blue (Preparing)**: Currently being cooked
- 🟢 **Green (Ready)**: Ready for delivery
- ⚪ **Gray (Completed)**: Order finished

---

## ⚙️ Settings & Options

### Cart Options
- **Clear Cart**: Remove all items
- **Special Instructions**: Add notes for kitchen
- **Quantity Adjustment**: Change item amounts

### Order Options
- **Filter by Status**: Show pending/preparing/ready
- **Search**: Find specific orders
- **View Details**: Click order for full info

### Table Options
- **Change Table**: Select different table
- **View Details**: See table information
- **Clear Selection**: Deselect current table

---

## 🆘 Troubleshooting

### Can't Select Table?
- ✅ Make sure table is green (available)
- ✅ Refresh page if needed
- ✅ Check if table is already occupied

### Items Not Showing?
- ✅ Check category filter
- ✅ Clear search box
- ✅ Verify items are available

### Order Not Placed?
- ✅ Ensure table is selected
- ✅ Check cart has items
- ✅ Verify no errors in console

### Cart Not Saving?
- ✅ Check browser storage enabled
- ✅ Clear browser cache
- ✅ Try different browser

---

## 📱 Mobile Usage

### Accessing on Mobile
```
1. Open browser
2. Go to http://localhost:3000
3. Click "Operations Portal"
4. Use hamburger menu to navigate
```

### Mobile Navigation
- **Hamburger Menu**: Click ☰ to open/close
- **Swipe**: Swipe to scroll
- **Tap**: Tap buttons to interact
- **Landscape**: Rotate for better view

### Mobile Optimization
- Single column layout
- Touch-friendly buttons
- Optimized spacing
- Fast loading

---

## 🔐 Logout

### To Logout
1. Click hamburger menu (mobile) or sidebar (desktop)
2. Scroll to bottom
3. Click "Logout" button
4. Redirected to login page

---

## 📞 Need Help?

### Common Questions

**Q: How do I change the selected table?**
A: Go to /waiter/tables and select a different table

**Q: Can I edit an order after placing?**
A: No, but you can place a new order for the same table

**Q: How do I see all orders?**
A: Go to /waiter/orders to see all active orders

**Q: What if I make a mistake?**
A: Use "Clear Cart" to start over

---

## ✅ Checklist for First Order

- [ ] Login to waiter portal
- [ ] Go to dashboard
- [ ] Click "New Order"
- [ ] Select available table
- [ ] Browse menu categories
- [ ] Add items to cart
- [ ] Review cart total
- [ ] Add special instructions (if needed)
- [ ] Click "Place Order"
- [ ] See success confirmation
- [ ] Go to "Active Orders" to track

---

## 🎓 Learning Path

### Beginner
1. Explore dashboard
2. View table selection
3. Browse menu
4. Place first order

### Intermediate
1. Use search functionality
2. Add special instructions
3. Track multiple orders
4. Filter orders by status

### Advanced
1. Batch multiple orders
2. Manage special requests
3. Monitor kitchen progress
4. Optimize workflow

---

## 📈 Performance Tips

### Faster Ordering
- Use search instead of scrolling
- Memorize popular items
- Add items quickly
- Use keyboard shortcuts

### Better Tracking
- Check active orders regularly
- Monitor order status
- Note preparation times
- Plan table turnover

---

## 🎉 You're Ready!

You now have everything you need to use the Waiter Ordering Module effectively. Start with the dashboard and follow the workflow for smooth operations.

**Happy ordering! 🍽️**

---

**Last Updated**: 2024  
**Version**: 1.0.0