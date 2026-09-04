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
    count: 42,
    color: '#4f46e5',
    bg: '#e0e7ff',
    description: 'Textbooks, semester notes, reference guides & exam preparation material.'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    iconName: 'Laptop',
    count: 35,
    color: '#0284c7',
    bg: '#e0f2fe',
    description: 'Laptops, headphones, keyboards, mice, adapters & gadgets.'
  },
  {
    id: 'calculators',
    name: 'Calculators',
    iconName: 'Calculator',
    count: 18,
    color: '#d97706',
    bg: '#fef3c7',
    description: 'Scientific, graphing, and programmable calculators for engineering & maths.'
  },
  {
    id: 'bags-accessories',
    name: 'Bags & Accessories',
    iconName: 'ShoppingBag',
    count: 24,
    color: '#059669',
    bg: '#d1fae5',
    description: 'Backpacks, laptop sleeves, travel bags, and daily carry items.'
  },
  {
    id: 'hostel-items',
    name: 'Hostel Items',
    iconName: 'Home',
    count: 29,
    color: '#7c3aed',
    bg: '#ede9fe',
    description: 'Study lamps, bedsheets, kettles, organizers, tables & mirrors.'
  },
  {
    id: 'cycles',
    name: 'Cycles',
    iconName: 'Bike',
    count: 15,
    color: '#dc2626',
    bg: '#fee2e2',
    description: 'Geared and non-geared campus bicycles, helmets & locks.'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    iconName: 'Shirt',
    count: 22,
    color: '#db2777',
    bg: '#fce7f3',
    description: 'Hoodies, lab coats, jackets, sneakers, traditional wear & accessories.'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    iconName: 'Gamepad2',
    count: 12,
    color: '#2563eb',
    bg: '#dbeafe',
    description: 'Consoles, controllers, gaming mice, pads & game titles.'
  },
  {
    id: 'stationery',
    name: 'Stationery',
    iconName: 'PenTool',
    count: 31,
    color: '#65a30d',
    bg: '#ecfccb',
    description: 'Engineering drawing kits, notebooks, desk supplies & files.'
  },
  {
    id: 'other',
    name: 'Other',
    iconName: 'Package',
    count: 14,
    color: '#475569',
    bg: '#f1f5f9',
    description: 'Sports equipment, musical instruments & miscellaneous campus items.'
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Higher Engineering Mathematics - B.S. Grewal (44th Ed.)',
    price: 450,
    originalPrice: 899,
    category: 'Books & Notes',
    condition: 'Like New',
    description: 'Essential textbook for B.Tech students. Pages are clean without markings. Includes solved GATE previous year questions booklet free!',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 'user-101',
      name: 'Rohan Sharma',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      rating: 4.9,
      reviewsCount: 14,
      college: 'IIT Delhi',
      department: 'Computer Science & Engg',
      year: '3rd Year',
      phone: '+91 98765 43210',
      email: 'rohan.s@iitd.ac.in',
      joinedDate: 'Aug 2024'
    },
    college: 'IIT Delhi',
    location: 'Kumaon Hostel, Room 214',
    department: 'Computer Science',
    postedDate: '2 hours ago',
    createdAt: '2026-09-04T10:00:00Z',
    status: 'Active',
    views: 124,
    featured: true,
    popular: true
  },
  {
    id: 'prod-2',
    name: 'Casio FX-991EX Classwiz Scientific Calculator',
    price: 950,
    originalPrice: 1595,
    category: 'Calculators',
    condition: 'Like New',
    description: 'High-resolution display scientific calculator with solar dual power. Permitted in university and GATE exams. Flawless battery and buttons.',
    images: [
      'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 'user-102',
      name: 'Ananya Verma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      rating: 4.8,
      reviewsCount: 9,
      college: 'BITS Pilani',
      department: 'Electrical Engineering',
      year: '4th Year',
      phone: '+91 98123 45678',
      email: 'ananya@pilani.bits-pilani.ac.in',
      joinedDate: 'Jan 2024'
    },
    college: 'BITS Pilani',
    location: 'Meera Bhawan, Pilani Campus',
    department: 'Electrical Engineering',
    postedDate: '5 hours ago',
    createdAt: '2026-09-04T07:00:00Z',
    status: 'Active',
    views: 210,
    featured: true,
    popular: true
  },
  {
    id: 'prod-3',
    name: 'Logitech K380 Wireless Bluetooth Keyboard',
    price: 1600,
    originalPrice: 2995,
    category: 'Electronics',
    condition: 'Gently Used',
    description: 'Compact multi-device keyboard. Pairs with up to 3 devices (laptop, tablet, phone). Works smoothly, pristine condition with original box.',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 'user-103',
      name: 'Aditya Nair',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      reviewsCount: 22,
      college: 'NIT Trichy',
      department: 'Mechanical Engineering',
      year: '2nd Year',
      phone: '+91 97654 32109',
      email: 'aditya@nitt.edu',
      joinedDate: 'Feb 2025'
    },
    college: 'NIT Trichy',
    location: 'Opal Hostel Block B',
    department: 'Mechanical Engg',
    postedDate: '1 day ago',
    createdAt: '2026-09-03T14:00:00Z',
    status: 'Active',
    views: 89,
    featured: false,
    popular: true
  },
  {
    id: 'prod-4',
    name: 'Wildcraft 45L Waterproof College Backpack',
    price: 850,
    originalPrice: 2200,
    category: 'Bags & Accessories',
    condition: 'Gently Used',
    description: 'Heavy duty laptop backpack with rain cover, dedicated 15.6" laptop compartment and ergonomic back support. Ideal for daily college use.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 'user-104',
      name: 'Priya Sundaram',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 4.7,
      reviewsCount: 11,
      college: 'Anna University',
      department: 'Biotechnology',
      year: '3rd Year',
      phone: '+91 96543 21098',
      email: 'priya.s@annauniv.edu',
      joinedDate: 'Mar 2024'
    },
    college: 'Anna University',
    location: 'CEG Campus, Guindy',
    department: 'Biotechnology',
    postedDate: '1 day ago',
    createdAt: '2026-09-03T11:00:00Z',
    status: 'Active',
    views: 156,
    featured: true,
    popular: false
  },
  {
    id: 'prod-5',
    name: 'Hero Octane 21-Speed Mountain Gear Bicycle',
    price: 5500,
    originalPrice: 12500,
    category: 'Cycles',
    condition: 'Gently Used',
    description: 'Well-maintained alloy frame mountain bike with Shimano 21 speed shifters, dual disc brakes and front suspension. Serviced last month.',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 'user-105',
      name: 'Karan Mehta',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      rating: 4.9,
      reviewsCount: 18,
      college: 'VIT Vellore',
      department: 'Civil Engineering',
      year: '4th Year',
      phone: '+91 95432 10987',
      email: 'karan.mehta@vit.ac.in',
      joinedDate: 'Oct 2023'
    },
    college: 'VIT Vellore',
    location: 'L-Block Hostel, Vellore Campus',
    department: 'Civil Engg',
    postedDate: '2 days ago',
    createdAt: '2026-09-02T16:00:00Z',
    status: 'Active',
    views: 312,
    featured: true,
    popular: true
  },
  {
    id: 'prod-6',
    name: 'Foldable Metal Study Table & Chair Set',
    price: 1200,
    originalPrice: 2800,
    category: 'Hostel Items',
    condition: 'Like New',
    description: 'Compact space-saving folding table with cup holder and mobile stand slot. Comes with cushioned metal folding chair. Ideal for hostel room studying.',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 'user-106',
      name: 'Sneha Patel',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      rating: 4.6,
      reviewsCount: 7,
      college: 'DTU Delhi',
      department: 'Information Technology',
      year: '3rd Year',
      phone: '+91 94321 09876',
      email: 'sneha@dtu.ac.in',
      joinedDate: 'Nov 2024'
    },
    college: 'DTU Delhi',
    location: 'Type 4 Hostel, Main Campus',
    department: 'Information Technology',
    postedDate: '2 days ago',
    createdAt: '2026-09-02T09:00:00Z',
    status: 'Active',
    views: 140,
    featured: false,
    popular: false
  },
  {
    id: 'prod-7',
    name: 'Boat Rockerz 450 Bluetooth Headphones (30H Playtime)',
    price: 799,
    originalPrice: 1990,
    category: 'Electronics',
    condition: 'Like New',
    description: 'Matte black wireless headphones with deep bass 40mm drivers. Cushion earcups, built-in mic for online classes & team gaming.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 'user-101',
      name: 'Rohan Sharma',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      rating: 4.9,
      reviewsCount: 14,
      college: 'IIT Delhi',
      department: 'Computer Science & Engg',
      year: '3rd Year',
      phone: '+91 98765 43210',
      email: 'rohan.s@iitd.ac.in',
      joinedDate: 'Aug 2024'
    },
    college: 'IIT Delhi',
    location: 'Kumaon Hostel, Room 214',
    department: 'Computer Science',
    postedDate: '3 days ago',
    createdAt: '2026-09-01T15:00:00Z',
    status: 'Active',
    views: 260,
    featured: true,
    popular: true
  },
  {
    id: 'prod-8',
    name: 'Complete Engineering Drawing Instruments Kit',
    price: 350,
    originalPrice: 850,
    category: 'Stationery',
    condition: 'Brand New',
    description: 'Includes mini-drafter, set squares, compass set, mechanical pencils, protractor, T-scale and protective leatherette carrying tube.',
    images: [
      'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 'user-107',
      name: 'Vikram Singh',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      reviewsCount: 16,
      college: 'SRM Institute',
      department: 'Aerospace Engineering',
      year: '2nd Year',
      phone: '+91 93210 98765',
      email: 'vikram@srmist.edu.in',
      joinedDate: 'Jan 2025'
    },
    college: 'SRM Institute',
    location: 'MTRS Hostel, Kattankulathur',
    department: 'Aerospace Engg',
    postedDate: '3 days ago',
    createdAt: '2026-09-01T10:00:00Z',
    status: 'Active',
    views: 95,
    featured: false,
    popular: false
  },
  {
    id: 'prod-9',
    name: 'Arduino Uno Ultimate Starter Kit with Sensor Modules',
    price: 1100,
    originalPrice: 2400,
    category: 'Electronics',
    condition: 'Like New',
    description: 'Arduino Uno R3 board + 30+ sensors (ultrasonic, RFID, LCD screen, servo motor, jumper wires, breadboard). Used for 1 robotics lab project.',
    images: [
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 'user-102',
      name: 'Ananya Verma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      rating: 4.8,
      reviewsCount: 9,
      college: 'BITS Pilani',
      department: 'Electrical Engineering',
      year: '4th Year',
      phone: '+91 98123 45678',
      email: 'ananya@pilani.bits-pilani.ac.in',
      joinedDate: 'Jan 2024'
    },
    college: 'BITS Pilani',
    location: 'Meera Bhawan, Pilani Campus',
    department: 'Electrical Engineering',
    postedDate: '4 days ago',
    createdAt: '2026-08-31T18:00:00Z',
    status: 'Active',
    views: 285,
    featured: true,
    popular: true
  },
  {
    id: 'prod-10',
    name: 'Python Crash Course (2nd Edition) - Eric Matthes',
    price: 380,
    originalPrice: 799,
    category: 'Books & Notes',
    condition: 'Like New',
    description: 'Hands-on project-based introduction to programming. Covers Django, data analysis, and Pygame. High quality print.',
    images: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 'user-108',
      name: 'Deepak Joshi',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      rating: 4.8,
      reviewsCount: 5,
      college: 'IIIT Hyderabad',
      department: 'Computer Science',
      year: '2nd Year',
      phone: '+91 92109 87654',
      email: 'deepak@iiit.ac.in',
      joinedDate: 'Feb 2025'
    },
    college: 'IIIT Hyderabad',
    location: 'OBH Hostel, Gachibowli',
    department: 'Computer Science',
    postedDate: '4 days ago',
    createdAt: '2026-08-31T11:00:00Z',
    status: 'Active',
    views: 110,
    featured: false,
    popular: false
  },
  {
    id: 'prod-11',
    name: 'Pure Cotton White Lab Coat (Unisex, Size M)',
    price: 250,
    originalPrice: 650,
    category: 'Fashion',
    condition: 'Like New',
    description: 'Mandatory lab coat for Chemistry & Biology practicals. Clean, sanitized, stainless pure cotton fabric with deep pockets.',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 'user-104',
      name: 'Priya Sundaram',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 4.7,
      reviewsCount: 11,
      college: 'Anna University',
      department: 'Biotechnology',
      year: '3rd Year',
      phone: '+91 96543 21098',
      email: 'priya.s@annauniv.edu',
      joinedDate: 'Mar 2024'
    },
    college: 'Anna University',
    location: 'CEG Campus, Guindy',
    department: 'Biotechnology',
    postedDate: '5 days ago',
    createdAt: '2026-08-30T16:00:00Z',
    status: 'Active',
    views: 74,
    featured: false,
    popular: false
  },
  {
    id: 'prod-12',
    name: 'Philips LED Desk Lamp with 3 Brightness Levels',
    price: 550,
    originalPrice: 1299,
    category: 'Hostel Items',
    condition: 'Like New',
    description: 'Flexible neck touch control rechargeable desk lamp. Warm white LED eye protection light, 6 hours battery backup on full charge.',
    images: [
      'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 'user-106',
      name: 'Sneha Patel',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      rating: 4.6,
      reviewsCount: 7,
      college: 'DTU Delhi',
      department: 'Information Technology',
      year: '3rd Year',
      phone: '+91 94321 09876',
      email: 'sneha@dtu.ac.in',
      joinedDate: 'Nov 2024'
    },
    college: 'DTU Delhi',
    location: 'Type 4 Hostel, Main Campus',
    department: 'Information Technology',
    postedDate: '5 days ago',
    createdAt: '2026-08-30T12:00:00Z',
    status: 'Active',
    views: 182,
    featured: false,
    popular: true
  },
  {
    id: 'prod-13',
    name: 'Seagate Expansion 1TB Portable External Hard Drive',
    price: 2400,
    originalPrice: 4899,
    category: 'Electronics',
    condition: 'Like New',
    description: 'USB 3.0 ultra-fast transfer speeds. Clean formatted drive with 100% disk health report attached. Great for storing course lectures & movies.',
    images: [
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 'user-103',
      name: 'Aditya Nair',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      reviewsCount: 22,
      college: 'NIT Trichy',
      department: 'Mechanical Engineering',
      year: '2nd Year',
      phone: '+91 97654 32109',
      email: 'aditya@nitt.edu',
      joinedDate: 'Feb 2025'
    },
    college: 'NIT Trichy',
    location: 'Opal Hostel Block B',
    department: 'Mechanical Engg',
    postedDate: '6 days ago',
    createdAt: '2026-08-29T14:00:00Z',
    status: 'Active',
    views: 340,
    featured: true,
    popular: true
  },
  {
    id: 'prod-14',
    name: 'Cosco Light Weight Tennis Ball Cricket Bat',
    price: 499,
    originalPrice: 1100,
    category: 'Other',
    condition: 'Gently Used',
    description: 'Kashmir willow popular willow cricket bat with thick edges. Perfect for hostel corridor and campus playground evening matches.',
    images: [
      'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 'user-105',
      name: 'Karan Mehta',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      rating: 4.9,
      reviewsCount: 18,
      college: 'VIT Vellore',
      department: 'Civil Engineering',
      year: '4th Year',
      phone: '+91 95432 10987',
      email: 'karan.mehta@vit.ac.in',
      joinedDate: 'Oct 2023'
    },
    college: 'VIT Vellore',
    location: 'L-Block Hostel, Vellore Campus',
    department: 'Civil Engg',
    postedDate: '1 week ago',
    createdAt: '2026-08-28T10:00:00Z',
    status: 'Active',
    views: 128,
    featured: false,
    popular: false
  },
  {
    id: 'prod-15',
    name: 'Redragon M601 RGB Ergonomic Gaming Mouse',
    price: 650,
    originalPrice: 1499,
    category: 'Gaming',
    condition: 'Like New',
    description: '7200 DPI gaming mouse with 7 programmable buttons, dynamic RGB lighting and weight tuning set. Smooth Teflon feet slider.',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 'user-108',
      name: 'Deepak Joshi',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      rating: 4.8,
      reviewsCount: 5,
      college: 'IIIT Hyderabad',
      department: 'Computer Science',
      year: '2nd Year',
      phone: '+91 92109 87654',
      email: 'deepak@iiit.ac.in',
      joinedDate: 'Feb 2025'
    },
    college: 'IIIT Hyderabad',
    location: 'OBH Hostel, Gachibowli',
    department: 'Computer Science',
    postedDate: '1 week ago',
    createdAt: '2026-08-27T15:00:00Z',
    status: 'Active',
    views: 215,
    featured: false,
    popular: true
  },
  {
    id: 'prod-16',
    name: 'JBL GO 3 Wireless Ultra-Portable Bluetooth Speaker',
    price: 1850,
    originalPrice: 3999,
    category: 'Electronics',
    condition: 'Like New',
    description: 'Bold style and rich JBL Pro Sound. IP67 waterproof and dustproof. 5 hours of continuous battery playback on a single charge.',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 'user-107',
      name: 'Vikram Singh',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      reviewsCount: 16,
      college: 'SRM Institute',
      department: 'Aerospace Engineering',
      year: '2nd Year',
      phone: '+91 93210 98765',
      email: 'vikram@srmist.edu.in',
      joinedDate: 'Jan 2025'
    },
    college: 'SRM Institute',
    location: 'MTRS Hostel, Kattankulathur',
    department: 'Aerospace Engg',
    postedDate: '1 week ago',
    createdAt: '2026-08-26T11:00:00Z',
    status: 'Active',
    views: 402,
    featured: true,
    popular: true
  },
  {
    id: 'prod-17',
    name: 'Puma Unisex College Running Shoes (UK 9)',
    price: 1400,
    originalPrice: 3499,
    category: 'Fashion',
    condition: 'Gently Used',
    description: 'Lightweight breathable mesh upper with cushioned SoftFoam+ comfort sockliner. Worn only 3 times for sports meet.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 'user-103',
      name: 'Aditya Nair',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      reviewsCount: 22,
      college: 'NIT Trichy',
      department: 'Mechanical Engineering',
      year: '2nd Year',
      phone: '+91 97654 32109',
      email: 'aditya@nitt.edu',
      joinedDate: 'Feb 2025'
    },
    college: 'NIT Trichy',
    location: 'Opal Hostel Block B',
    department: 'Mechanical Engg',
    postedDate: '2 weeks ago',
    createdAt: '2026-08-20T09:00:00Z',
    status: 'Active',
    views: 165,
    featured: false,
    popular: false
  },
  {
    id: 'prod-18',
    name: 'HP Wireless Optical Mouse X3000',
    price: 320,
    originalPrice: 799,
    category: 'Electronics',
    condition: 'Fair',
    description: 'Reliable 2.4GHz nano receiver mouse with contoured grip. Requires 1 AA battery (included). Working smoothly.',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 'user-106',
      name: 'Sneha Patel',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      rating: 4.6,
      reviewsCount: 7,
      college: 'DTU Delhi',
      department: 'Information Technology',
      year: '3rd Year',
      phone: '+91 94321 09876',
      email: 'sneha@dtu.ac.in',
      joinedDate: 'Nov 2024'
    },
    college: 'DTU Delhi',
    location: 'Type 4 Hostel, Main Campus',
    department: 'Information Technology',
    postedDate: '2 weeks ago',
    createdAt: '2026-08-18T14:00:00Z',
    status: 'Active',
    views: 88,
    featured: false,
    popular: false
  },
  {
    id: 'prod-19',
    name: 'Java: The Complete Reference (11th Ed.) - Herbert Schildt',
    price: 520,
    originalPrice: 1150,
    category: 'Books & Notes',
    condition: 'Like New',
    description: 'Comprehensive guide covering Java SE 11. Clear explanation of OOP, multithreading, collections framework, and lambda expressions.',
    images: [
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 'user-101',
      name: 'Rohan Sharma',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      rating: 4.9,
      reviewsCount: 14,
      college: 'IIT Delhi',
      department: 'Computer Science & Engg',
      year: '3rd Year',
      phone: '+91 98765 43210',
      email: 'rohan.s@iitd.ac.in',
      joinedDate: 'Aug 2024'
    },
    college: 'IIT Delhi',
    location: 'Kumaon Hostel, Room 214',
    department: 'Computer Science',
    postedDate: '3 weeks ago',
    createdAt: '2026-08-12T10:00:00Z',
    status: 'Sold',
    views: 290,
    featured: false,
    popular: true
  },
  {
    id: 'prod-20',
    name: 'Dell Inspiron 15 (Core i5 11th Gen / 16GB RAM / 512GB SSD)',
    price: 32000,
    originalPrice: 58000,
    category: 'Electronics',
    condition: 'Like New',
    description: 'Fast coding laptop with FHD anti-glare display, backlit keyboard, Windows 11 Home & MS Office pre-activated. Battery gives 5+ hours backup. Original charger included.',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 'user-102',
      name: 'Ananya Verma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      rating: 4.8,
      reviewsCount: 9,
      college: 'BITS Pilani',
      department: 'Electrical Engineering',
      year: '4th Year',
      phone: '+91 98123 45678',
      email: 'ananya@pilani.bits-pilani.ac.in',
      joinedDate: 'Jan 2024'
    },
    college: 'BITS Pilani',
    location: 'Meera Bhawan, Pilani Campus',
    department: 'Electrical Engineering',
    postedDate: '3 weeks ago',
    createdAt: '2026-08-10T16:00:00Z',
    status: 'Active',
    views: 650,
    featured: true,
    popular: true
  }
];

export const DEMO_USER = {
  id: 'user-101',
  name: 'Rohan Sharma',
  email: 'rohan.s@iitd.ac.in',
  role: 'Student',
  isAdmin: false,
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
  college: 'IIT Delhi',
  department: 'Computer Science & Engg',
  year: '3rd Year',
  phone: '+91 98765 43210',
  rating: 4.9,
  reviewsCount: 14,
  joinedDate: 'Aug 2024',
  location: 'Kumaon Hostel, Room 214, New Delhi'
};

export const MOCK_CONVERSATIONS = [
  {
    id: 'conv-1',
    productId: 'prod-2',
    productName: 'Casio FX-991EX Classwiz Scientific Calculator',
    productPrice: 950,
    productImage: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48a?auto=format&fit=crop&w=800&q=80',
    otherUser: {
      id: 'user-102',
      name: 'Ananya Verma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      college: 'BITS Pilani',
      status: 'online'
    },
    lastMessage: 'Hey, is the calculator still available for ₹900?',
    lastTimestamp: '10:45 AM',
    unread: true,
    messages: [
      {
        id: 'msg-1',
        senderId: 'user-101',
        text: 'Hi Ananya! Is the Casio scientific calculator still available?',
        timestamp: '10:30 AM'
      },
      {
        id: 'msg-2',
        senderId: 'user-102',
        text: 'Yes Rohan, it is in perfect working condition with solar dual power.',
        timestamp: '10:35 AM'
      },
      {
        id: 'msg-3',
        senderId: 'user-101',
        text: 'Great! Can we meet near the Central Library around 4 PM today?',
        timestamp: '10:40 AM'
      },
      {
        id: 'msg-4',
        senderId: 'user-102',
        text: 'Hey, is the calculator still available for ₹900?',
        timestamp: '10:45 AM'
      }
    ]
  },
  {
    id: 'conv-2',
    productId: 'prod-5',
    productName: 'Hero Octane 21-Speed Mountain Gear Bicycle',
    productPrice: 5500,
    productImage: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    otherUser: {
      id: 'user-105',
      name: 'Karan Mehta',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      college: 'VIT Vellore',
      status: 'offline'
    },
    lastMessage: 'I checked the gears yesterday, runs super smooth!',
    lastTimestamp: 'Yesterday',
    unread: false,
    messages: [
      {
        id: 'msg-201',
        senderId: 'user-101',
        text: 'Hi Karan, when did you service the gears last?',
        timestamp: 'Yesterday 4:00 PM'
      },
      {
        id: 'msg-202',
        senderId: 'user-105',
        text: 'I checked the gears yesterday, runs super smooth!',
        timestamp: 'Yesterday 4:15 PM'
      }
    ]
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'New Message Received',
    message: 'Ananya Verma sent you a message regarding Casio FX-991EX Calculator.',
    time: '10 mins ago',
    type: 'message',
    read: false,
    link: '/messages'
  },
  {
    id: 'notif-2',
    title: 'Listing Published Successfully',
    message: 'Your item "Higher Engineering Mathematics - B.S. Grewal" is now live on CampusMart!',
    time: '2 hours ago',
    type: 'listing',
    read: false,
    link: '/product/prod-1'
  },
  {
    id: 'notif-3',
    title: 'Item Marked as Sold',
    message: 'Congratulations! "Java: The Complete Reference" was marked as sold.',
    time: '1 day ago',
    type: 'sale',
    read: true,
    link: '/my-listings'
  },
  {
    id: 'notif-4',
    title: 'Price Drop Alert',
    message: 'Dell Inspiron 15 on your wishlist dropped price by ₹3,000!',
    time: '2 days ago',
    type: 'price',
    read: true,
    link: '/product/prod-20'
  }
];

export const MOCK_ADMIN_STATS = {
  totalStudents: 4820,
  totalListings: 1240,
  productsSold: 890,
  reportedListings: 6,
  totalRevenueVolume: '₹14.8 Lakhs',
  monthlyListings: [
    { month: 'Jan', listings: 120, sales: 85 },
    { month: 'Feb', listings: 190, sales: 140 },
    { month: 'Mar', listings: 250, sales: 180 },
    { month: 'Apr', listings: 310, sales: 220 },
    { month: 'May', listings: 280, sales: 210 },
    { month: 'Jun', listings: 420, sales: 340 }
  ],
  categoryDistribution: [
    { name: 'Books & Notes', count: 420, percent: 34 },
    { name: 'Electronics', count: 350, percent: 28 },
    { name: 'Hostel Items', count: 210, percent: 17 },
    { name: 'Calculators', count: 120, percent: 10 },
    { name: 'Cycles & Others', count: 140, percent: 11 }
  ],
  studentsList: [
    { id: 'u1', name: 'Rohan Sharma', email: 'rohan.s@iitd.ac.in', college: 'IIT Delhi', status: 'Active', listings: 4, joined: 'Aug 2024' },
    { id: 'u2', name: 'Ananya Verma', email: 'ananya@pilani.bits-pilani.ac.in', college: 'BITS Pilani', status: 'Active', listings: 3, joined: 'Jan 2024' },
    { id: 'u3', name: 'Aditya Nair', email: 'aditya@nitt.edu', college: 'NIT Trichy', status: 'Active', listings: 5, joined: 'Feb 2025' },
    { id: 'u4', name: 'Priya Sundaram', email: 'priya.s@annauniv.edu', college: 'Anna University', status: 'Active', listings: 2, joined: 'Mar 2024' },
    { id: 'u5', name: 'Karan Mehta', email: 'karan.m@vit.ac.in', college: 'VIT Vellore', status: 'Suspended', listings: 1, joined: 'Oct 2023' }
  ],
  reportedItems: [
    { id: 'rep-1', productId: 'prod-99', productName: 'Fake Exam Answer Keys', reporter: 'Aditya Nair', reason: 'Violation of Academic Integrity policy', date: 'Yesterday', status: 'Pending Review' },
    { id: 'rep-2', productId: 'prod-98', productName: 'Defective Power Bank', reporter: 'Priya S.', reason: 'False product description and condition', date: '3 days ago', status: 'Under Investigation' }
  ]
};
