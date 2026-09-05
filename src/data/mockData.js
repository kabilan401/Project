import { 
  BookOpen, 
  Laptop, 
  Calculator, 
  Home, 
  Bike, 
  Shirt, 
  PenTool, 
  FlaskConical,
  Trophy
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
    id: 'calculators',
    name: 'Scientific Calculators',
    iconName: 'Calculator',
    count: 0,
    color: '#d97706',
    bg: '#fef3c7',
    description: 'Scientific, graphing, and programmable calculators for engineering & maths.'
  },
  {
    id: 'lab-equipment',
    name: 'Lab Equipment & Aprons',
    iconName: 'FlaskConical',
    count: 0,
    color: '#059669',
    bg: '#d1fae5',
    description: 'Lab coats, aprons, safety goggles, dissection sets & experimental kits.'
  },
  {
    id: 'electronics',
    name: 'Laptops & Electronics',
    iconName: 'Laptop',
    count: 0,
    color: '#0284c7',
    bg: '#e0f2fe',
    description: 'Laptops, headphones, keyboards, mice, adapters & project gadgets.'
  },
  {
    id: 'hostel-items',
    name: 'Hostel & Dorm Essentials',
    iconName: 'Home',
    count: 0,
    color: '#7c3aed',
    bg: '#ede9fe',
    description: 'Study lamps, bedsheets, kettles, organizers, tables & mirrors.'
  },
  {
    id: 'cycles',
    name: 'Campus Bicycles',
    iconName: 'Bike',
    count: 0,
    color: '#dc2626',
    bg: '#fee2e2',
    description: 'Geared and non-geared campus bicycles, helmets & locks.'
  },
  {
    id: 'stationery',
    name: 'Study Tools & Stationery',
    iconName: 'PenTool',
    count: 0,
    color: '#65a30d',
    bg: '#ecfccb',
    description: 'Engineering drawing kits, drafters, notebooks, desk supplies & files.'
  },
  {
    id: 'college-wear',
    name: 'Uniforms & College Wear',
    iconName: 'Shirt',
    count: 0,
    color: '#db2777',
    bg: '#fce7f3',
    description: 'Department hoodies, college uniforms, lab jackets & blazer badges.'
  },
  {
    id: 'sports',
    name: 'Campus Sports & Fitness',
    iconName: 'Trophy',
    count: 0,
    color: '#2563eb',
    bg: '#dbeafe',
    description: 'Badminton rackets, footballs, cricket gear & fitness equipment.'
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
    { name: 'Scientific Calculators', count: 0, percent: 0 },
    { name: 'Lab Equipment & Aprons', count: 0, percent: 0 },
    { name: 'Laptops & Electronics', count: 0, percent: 0 },
    { name: 'Hostel & Dorm Essentials', count: 0, percent: 0 },
    { name: 'Campus Bicycles', count: 0, percent: 0 },
    { name: 'Study Tools & Stationery', count: 0, percent: 0 },
    { name: 'Uniforms & College Wear', count: 0, percent: 0 },
    { name: 'Campus Sports & Fitness', count: 0, percent: 0 }
  ],
  studentsList: [],
  reportedItems: []
};
