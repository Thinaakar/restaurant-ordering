import type { MenuItem } from './types';

export const mockMenuItems: MenuItem[] = [
  // Starters
  { id: 'm1', name: 'Paneer Tikka', description: 'Marinated cottage cheese grilled to perfection in tandoor with bell peppers and onions', price: 280, image: '🧀', isAvailable: true, isVeg: true, spiceLevel: 'medium', preparationTime: 15, rating: 4.5, orderCount: 85 },
  { id: 'm2', name: 'Chicken 65', description: 'Crispy deep-fried chicken tossed in aromatic spices and curry leaves', price: 320, image: '🍗', isAvailable: true, isVeg: false, spiceLevel: 'hot', preparationTime: 18, rating: 4.7, orderCount: 110 },
  { id: 'm3', name: 'Veg Spring Rolls', description: 'Crispy rolls stuffed with seasoned vegetables and glass noodles', price: 220, image: '🥟', isAvailable: true, isVeg: true, spiceLevel: 'mild', preparationTime: 12, rating: 4.2, orderCount: 60 },
  { id: 'm4', name: 'Fish Amritsari', description: 'Batter-fried fish fillets with ajwain and chaat masala', price: 380, image: '🐟', isAvailable: true, isVeg: false, spiceLevel: 'medium', preparationTime: 20, rating: 4.6, orderCount: 45 },
  { id: 'm5', name: 'Hara Bhara Kebab', description: 'Spinach and peas patties with mint chutney', price: 240, image: '🥬', isAvailable: true, isVeg: true, spiceLevel: 'mild', preparationTime: 15, rating: 4.3, orderCount: 55 },

  // Main Course
  { id: 'm6', name: 'Butter Chicken', description: 'Tender chicken in rich tomato-butter gravy with cream and fenugreek', price: 380, image: '🍗', isAvailable: true, isVeg: false, spiceLevel: 'medium', preparationTime: 25, rating: 4.8, orderCount: 150 },
  { id: 'm7', name: 'Paneer Butter Masala', description: 'Cottage cheese cubes in creamy tomato gravy with cashew paste', price: 320, image: '🧀', isAvailable: true, isVeg: true, spiceLevel: 'mild', preparationTime: 20, rating: 4.6, orderCount: 130 },
  { id: 'm8', name: 'Mutton Rogan Josh', description: 'Slow-cooked lamb in aromatic Kashmiri spices and yogurt', price: 450, image: '🥩', isAvailable: true, isVeg: false, spiceLevel: 'hot', preparationTime: 35, rating: 4.7, orderCount: 75 },
  { id: 'm9', name: 'Dal Makhani', description: 'Black lentils slow-cooked overnight with butter and cream', price: 260, image: '🥘', isAvailable: true, isVeg: true, spiceLevel: 'mild', preparationTime: 20, rating: 4.5, orderCount: 95 },
  { id: 'm10', name: 'Prawn Masala', description: 'Fresh prawns cooked in coconut-based gravy with curry leaves', price: 480, image: '🦐', isAvailable: true, isVeg: false, spiceLevel: 'medium', preparationTime: 25, rating: 4.4, orderCount: 40 },
  { id: 'm11', name: 'Palak Paneer', description: 'Cottage cheese in smooth and creamy spinach gravy', price: 290, image: '🥬', isAvailable: true, isVeg: true, spiceLevel: 'mild', preparationTime: 18, rating: 4.3, orderCount: 88 },

  // Biryani & Rice
  { id: 'm12', name: 'Chicken Biryani', description: 'Fragrant basmati rice layered with spiced chicken and saffron, slow-cooked in dum style', price: 350, image: '🍚', isAvailable: true, isVeg: false, spiceLevel: 'medium', preparationTime: 30, rating: 4.9, orderCount: 200 },
  { id: 'm13', name: 'Veg Biryani', description: 'Aromatic basmati rice with seasonal vegetables and whole spices', price: 280, image: '🍚', isAvailable: true, isVeg: true, spiceLevel: 'medium', preparationTime: 25, rating: 4.4, orderCount: 90 },
  { id: 'm14', name: 'Mutton Biryani', description: 'Hyderabadi-style biryani with tender mutton pieces and aromatic spices', price: 420, image: '🍚', isAvailable: true, isVeg: false, spiceLevel: 'hot', preparationTime: 35, rating: 4.8, orderCount: 120 },
  { id: 'm15', name: 'Jeera Rice', description: 'Basmati rice tempered with cumin seeds and ghee', price: 180, image: '🍚', isAvailable: true, isVeg: true, spiceLevel: 'mild', preparationTime: 15, rating: 4.1, orderCount: 70 },

  // Breads
  { id: 'm16', name: 'Butter Naan', description: 'Soft leavened bread brushed with melted butter from tandoor', price: 60, image: '🫓', isAvailable: true, isVeg: true, spiceLevel: 'mild', preparationTime: 8, rating: 4.5, orderCount: 300 },
  { id: 'm17', name: 'Garlic Naan', description: 'Naan topped with fresh garlic and coriander', price: 80, image: '🫓', isAvailable: true, isVeg: true, spiceLevel: 'mild', preparationTime: 8, rating: 4.6, orderCount: 250 },
  { id: 'm18', name: 'Tandoori Roti', description: 'Whole wheat bread baked in traditional clay oven', price: 40, image: '🫓', isAvailable: true, isVeg: true, spiceLevel: 'mild', preparationTime: 6, rating: 4.2, orderCount: 180 },
  { id: 'm19', name: 'Cheese Naan', description: 'Naan stuffed with melted mozzarella and cheddar cheese', price: 100, image: '🫓', isAvailable: true, isVeg: true, spiceLevel: 'mild', preparationTime: 10, rating: 4.7, orderCount: 160 },

  // Beverages
  { id: 'm20', name: 'Mango Lassi', description: 'Creamy yogurt smoothie blended with fresh Alphonso mangoes', price: 150, image: '🥭', isAvailable: true, isVeg: true, spiceLevel: 'mild', preparationTime: 5, rating: 4.6, orderCount: 140 },
  { id: 'm21', name: 'Masala Chai', description: 'Traditional Indian spiced tea with ginger and cardamom', price: 80, image: '☕', isAvailable: true, isVeg: true, spiceLevel: 'mild', preparationTime: 5, rating: 4.4, orderCount: 200 },
  { id: 'm22', name: 'Fresh Lime Soda', description: 'Refreshing lime juice with soda, salt, and a hint of mint', price: 100, image: '🍋', isAvailable: true, isVeg: true, spiceLevel: 'mild', preparationTime: 3, rating: 4.3, orderCount: 120 },
  { id: 'm23', name: 'Cold Coffee', description: 'Rich blended coffee with ice cream and chocolate shavings', price: 180, image: '☕', isAvailable: true, isVeg: true, spiceLevel: 'mild', preparationTime: 5, rating: 4.5, orderCount: 95 },

  // Desserts
  { id: 'm24', name: 'Gulab Jamun', description: 'Soft milk-solid dumplings soaked in rose-flavored sugar syrup', price: 120, image: '🍮', isAvailable: true, isVeg: true, spiceLevel: 'mild', preparationTime: 5, rating: 4.7, orderCount: 160 },
  { id: 'm25', name: 'Rasmalai', description: 'Soft cottage cheese patties in sweetened saffron milk', price: 150, image: '🍮', isAvailable: true, isVeg: true, spiceLevel: 'mild', preparationTime: 5, rating: 4.6, orderCount: 100 },
  { id: 'm26', name: 'Kulfi', description: 'Traditional Indian ice cream with pistachios and cardamom', price: 130, image: '🍦', isAvailable: true, isVeg: true, spiceLevel: 'mild', preparationTime: 3, rating: 4.5, orderCount: 110 },
  { id: 'm27', name: 'Chocolate Brownie', description: 'Warm dark chocolate brownie with vanilla ice cream and hot fudge', price: 200, image: '🍫', isAvailable: true, isVeg: true, spiceLevel: 'mild', preparationTime: 10, rating: 4.8, orderCount: 130 },
];

