import { 
  BookOpen, 
  Laptop, 
  Calculator, 
  ShoppingBag, 
  Home, 
  Bike, 
  Shirt, 
  Gamepad2, 
  PenTool, 
  Package 
} from 'lucide-react';

export const CATEGORIES = [
  {
    id: 'books-notes',
    name: 'Books & Notes',
    iconName: 'BookOpen',
    count: 0,
    color: '#4f46e5',
    bg: '#e0e7ff',
    description: 'Textbooks, semester notes, reference guides & exam preparation material.'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    iconName: 'Laptop',
    count: 0,
    color: '#0284c7',
    bg: '#e0f2fe',
    description: 'Laptops, headphones, keyboards, mice, adapters & gadgets.'
  },
  {
    id: 'calculators',
    name: 'Calculators',
    iconName: 'Calculator',
    count: 0,
    color: '#d97706',
    bg: '#fef3c7',
    description: 'Scientific, graphing, and programmable calculators for engineering & maths.'
  },
  {
    id: 'bags-accessories',
    name: 'Bags & Accessories',
    iconName: 'ShoppingBag',
    count: 0,
    color: '#059669',
    bg: '#d1fae5',
    description: 'Backpacks, laptop sleeves, travel bags, and daily carry items.'
  },
  {
    id: 'hostel-items',
    name: 'Hostel Items',
    iconName: 'Home',
    count: 0,
    color: '#7c3aed',
    bg: '#ede9fe',
    description: 'Study lamps, bedsheets, kettles, organizers, tables & mirrors.'
  },
  {
    id: 'cycles',
    name: 'Cycles',
    iconName: 'Bike',
    count: 0,
    color: '#dc2626',
    bg: '#fee2e2',
    description: 'Geared and non-geared campus bicycles, helmets & locks.'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    iconName: 'Shirt',
    count: 0,
    color: '#db2777',
    bg: '#fce7f3',
    description: 'Hoodies, lab coats, jackets, sneakers, traditional wear & accessories.'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    iconName: 'Gamepad2',
    count: 0,
    color: '#2563eb',
    bg: '#dbeafe',
    description: 'Consoles, controllers, gaming mice, pads & game titles.'
  },
  {
    id: 'stationery',
    name: 'Stationery',
    iconName: 'PenTool',
    count: 0,
    color: '#65a30d',
    bg: '#ecfccb',
    description: 'Engineering drawing kits, notebooks, desk supplies & files.'
  },
  {
    id: 'other',
    name: 'Other',
    iconName: 'Package',
    count: 0,
    color: '#475569',
    bg: '#f1f5f9',
    description: 'Sports equipment, musical instruments & miscellaneous campus items.'
  }
];

// Clean fresh start - zero preloaded products
export const INITIAL_PRODUCTS = [];

export const DEMO_USER = {
  id: 'user-101',
  name: 'Student User',
  email: 'student@college.edu',
  role: 'Student',
  isAdmin: false,
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  college: 'University Campus',
  department: 'General Engineering',
  year: '1st Year',
  phone: '+91 98765 43210',
  rating: 5.0,
  reviewsCount: 0,
  joinedDate: 'Sep 2026',
  location: 'Campus Hostel'
};

export const MOCK_CONVERSATIONS = [];

export const MOCK_NOTIFICATIONS = [];

export const MOCK_ADMIN_STATS = {
  totalStudents: 0,
  totalListings: 0,
  productsSold: 0,
  reportedListings: 0,
  totalRevenueVolume: '₹0',
  monthlyListings: [
    { month: 'Jan', listings: 0, sales: 0 },
    { month: 'Feb', listings: 0, sales: 0 },
    { month: 'Mar', listings: 0, sales: 0 },
    { month: 'Apr', listings: 0, sales: 0 },
    { month: 'May', listings: 0, sales: 0 },
    { month: 'Jun', listings: 0, sales: 0 }
  ],
  categoryDistribution: [
    { name: 'Books & Notes', count: 0, percent: 0 },
    { name: 'Electronics', count: 0, percent: 0 },
    { name: 'Hostel Items', count: 0, percent: 0 },
    { name: 'Calculators', count: 0, percent: 0 },
    { name: 'Cycles & Others', count: 0, percent: 0 }
  ],
  studentsList: [],
  reportedItems: []
};
