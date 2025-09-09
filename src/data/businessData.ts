// Enhanced business data structure
export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  category?: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  location: string;
  city: string;
  distance: string;
  coordinates: { lat: number; lng: number };
  image: string;
  images: string[];
  isNew: boolean;
  isUserSubmitted?: boolean; // Mark user-submitted businesses
  offers: boolean;
  categories: string[];
  description: string;
  phone: string;
  email: string;
  website: string;
  hours: BusinessHours[];
  isOpenNow: boolean;
  products: Product[];
  reviews: Review[];
  features: string[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export const businesses: Business[] = [
  {
    id: "1",
    name: "Digital Solutions Inc.",
    category: "Technology",
    rating: 4.8,
    reviewCount: 124,
    priceRange: "₹₹₹",
    location: "Bandra West, Mumbai",
    city: "Mumbai",
    distance: "1.2 km",
    coordinates: { lat: 19.0596, lng: 72.8295 },
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
    images: [
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      "https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2006&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
    ],
    isNew: true,
    offers: true,
    categories: ["Software", "IT Services", "Web Development"],
    description: "Leading technology solutions provider specializing in enterprise software development, cloud services, and digital transformation.",
    phone: "+91 98765 43210",
    email: "info@digitalsolutionsinc.com",
    website: "www.digitalsolutionsinc.com",
    hours: [
      { day: "Monday", open: "09:00", close: "18:00", isOpen: true },
      { day: "Tuesday", open: "09:00", close: "18:00", isOpen: true },
      { day: "Wednesday", open: "09:00", close: "18:00", isOpen: true },
      { day: "Thursday", open: "09:00", close: "18:00", isOpen: true },
      { day: "Friday", open: "09:00", close: "18:00", isOpen: true },
      { day: "Saturday", open: "10:00", close: "14:00", isOpen: true },
      { day: "Sunday", open: "Closed", close: "Closed", isOpen: false }
    ],
    isOpenNow: true,
    products: [
      {
        id: "p1",
        name: "Premium Service Package",
        price: "₹15,000",
        description: "Comprehensive business solution with priority support",
        image: "https://images.unsplash.com/photo-1576866209830-589e1bfbaa4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
        category: "Service"
      },
      {
        id: "p2",
        name: "Basic Consultation",
        price: "₹5,000",
        description: "Entry-level business advisory services",
        image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
        category: "Consultation"
      },
      {
        id: "p3",
        name: "Annual Membership",
        price: "₹50,000",
        description: "Full-year access to all business resources and support",
        image: "https://images.unsplash.com/photo-1626200419199-391ae4fc95bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
        category: "Membership"
      }
    ],
    reviews: [
      {
        id: "r1",
        name: "Aditya Sharma",
        rating: 5,
        comment: "Excellent business services! The team was professional, responsive, and delivered beyond our expectations.",
        date: "2 days ago",
        verified: true
      },
      {
        id: "r2",
        name: "Priya Patel",
        rating: 4,
        comment: "Very good service and support. Response times could be improved sometimes.",
        date: "1 week ago",
        verified: true
      },
      {
        id: "r3",
        name: "Raj Malhotra",
        rating: 5,
        comment: "One of the best business consultants in the city. Their detailed analysis has been invaluable.",
        date: "2 weeks ago",
        verified: false
      }
    ],
    features: ["24/7 Support", "Expert Team", "Guaranteed Results", "Free Consultation"],
    socialMedia: {
      facebook: "digitalsolutionsinc",
      instagram: "digitalsolutionsinc",
      linkedin: "digital-solutions-inc"
    }
  },
  {
    id: "2",
    name: "Financial Advisors Group",
    category: "Finance",
    rating: 4.6,
    reviewCount: 89,
    priceRange: "₹₹",
    location: "Juhu, Mumbai",
    city: "Mumbai",
    distance: "2.5 km",
    coordinates: { lat: 19.1075, lng: 72.8263 },
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    images: [
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80"
    ],
    isNew: false,
    offers: true,
    categories: ["Financial Planning", "Investment", "Tax Advisory"],
    description: "Expert financial advisory services with over 15 years of experience in wealth management and investment planning.",
    phone: "+91 98765 43211",
    email: "contact@financialadvisors.com",
    website: "www.financialadvisors.com",
    hours: [
      { day: "Monday", open: "10:00", close: "19:00", isOpen: true },
      { day: "Tuesday", open: "10:00", close: "19:00", isOpen: true },
      { day: "Wednesday", open: "10:00", close: "19:00", isOpen: true },
      { day: "Thursday", open: "10:00", close: "19:00", isOpen: true },
      { day: "Friday", open: "10:00", close: "19:00", isOpen: true },
      { day: "Saturday", open: "10:00", close: "16:00", isOpen: true },
      { day: "Sunday", open: "Closed", close: "Closed", isOpen: false }
    ],
    isOpenNow: true,
    products: [
      {
        id: "p4",
        name: "Investment Portfolio Review",
        price: "₹8,000",
        description: "Comprehensive analysis of your investment portfolio with recommendations",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        category: "Advisory"
      },
      {
        id: "p5",
        name: "Tax Planning Service",
        price: "₹12,000",
        description: "Annual tax planning and optimization strategies",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        category: "Tax"
      }
    ],
    reviews: [
      {
        id: "r4",
        name: "Sneha Gupta",
        rating: 5,
        comment: "Excellent financial advice that helped me achieve my investment goals ahead of schedule.",
        date: "3 days ago",
        verified: true
      },
      {
        id: "r5",
        name: "Rohit Singh",
        rating: 4,
        comment: "Professional team with deep market knowledge. Highly recommended for long-term planning.",
        date: "1 week ago",
        verified: true
      }
    ],
    features: ["Certified Advisors", "Personalized Planning", "Regular Reviews", "Tax Optimization"],
    socialMedia: {
      linkedin: "financial-advisors-group"
    }
  },
  {
    id: "3",
    name: "Creative Designs Studio",
    category: "Design",
    rating: 4.9,
    reviewCount: 156,
    priceRange: "₹₹₹₹",
    location: "Worli, Mumbai",
    city: "Mumbai",
    distance: "3.8 km",
    coordinates: { lat: 18.9986, lng: 72.8174 },
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    images: ["https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"],
    isNew: true,
    offers: false,
    categories: ["Graphic Design", "UX/UI", "Branding"],
    description: "Award-winning creative studio specializing in brand identity and digital experiences.",
    phone: "+91 98765 43212",
    email: "hello@creativedesigns.com",
    website: "www.creativedesigns.com",
    hours: [
      { day: "Monday", open: "09:00", close: "18:00", isOpen: true },
      { day: "Tuesday", open: "09:00", close: "18:00", isOpen: true },
      { day: "Wednesday", open: "09:00", close: "18:00", isOpen: true },
      { day: "Thursday", open: "09:00", close: "18:00", isOpen: true },
      { day: "Friday", open: "09:00", close: "18:00", isOpen: true },
      { day: "Saturday", open: "Closed", close: "Closed", isOpen: false },
      { day: "Sunday", open: "Closed", close: "Closed", isOpen: false }
    ],
    isOpenNow: true,
    products: [
      {
        id: "p6",
        name: "Brand Identity Package",
        price: "₹25,000",
        description: "Complete brand identity design including logo, colors, and guidelines",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
        category: "Branding"
      }
    ],
    reviews: [
      {
        id: "r6",
        name: "Arjun Kapoor",
        rating: 5,
        comment: "Outstanding creative work! They transformed our brand completely.",
        date: "1 day ago",
        verified: true
      }
    ],
    features: ["Award Winning", "Creative Excellence", "Brand Strategy", "Digital Focus"],
    socialMedia: {
      instagram: "creativedesignsstudio"
    }
  }
];

// Utility function to check if business is currently open
export const isBusinessOpenNow = (hours: BusinessHours[]): boolean => {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = now.getHours() * 100 + now.getMinutes();
  
  const todayHours = hours.find(h => h.day === currentDay);
  if (!todayHours || !todayHours.isOpen) return false;
  
  const [openHour, openMin] = todayHours.open.split(':').map(Number);
  const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
  const openTime = openHour * 100 + openMin;
  const closeTime = closeHour * 100 + closeMin;
  
  return currentTime >= openTime && currentTime <= closeTime;
};

// Utility function to get current status
export const getBusinessStatus = (hours: BusinessHours[]): string => {
  const isOpen = isBusinessOpenNow(hours);
  if (isOpen) return "Open Now";
  
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const todayHours = hours.find(h => h.day === currentDay);
  
  if (!todayHours || !todayHours.isOpen) return "Closed Today";
  
  return "Closed";
};