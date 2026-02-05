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
  },
  {
    id: "4",
    name: "Spice Garden Restaurant",
    category: "Restaurant",
    rating: 4.7,
    reviewCount: 312,
    priceRange: "₹₹",
    location: "Koramangala, Bangalore",
    city: "Bangalore",
    distance: "1.5 km",
    coordinates: { lat: 12.9352, lng: 77.6245 },
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1774&q=80"
    ],
    isNew: false,
    offers: true,
    categories: ["Indian Cuisine", "Fine Dining", "Catering"],
    description: "Authentic Indian cuisine with a modern twist. Experience the flavors of India in an elegant setting.",
    phone: "+91 98765 43213",
    email: "reservations@spicegarden.com",
    website: "www.spicegarden.com",
    hours: [
      { day: "Monday", open: "11:00", close: "23:00", isOpen: true },
      { day: "Tuesday", open: "11:00", close: "23:00", isOpen: true },
      { day: "Wednesday", open: "11:00", close: "23:00", isOpen: true },
      { day: "Thursday", open: "11:00", close: "23:00", isOpen: true },
      { day: "Friday", open: "11:00", close: "00:00", isOpen: true },
      { day: "Saturday", open: "11:00", close: "00:00", isOpen: true },
      { day: "Sunday", open: "11:00", close: "23:00", isOpen: true }
    ],
    isOpenNow: true,
    products: [
      {
        id: "p7",
        name: "Family Feast Package",
        price: "₹2,500",
        description: "Complete meal for 4 with starters, mains, and desserts",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1936&q=80",
        category: "Food"
      }
    ],
    reviews: [
      {
        id: "r7",
        name: "Vikram Reddy",
        rating: 5,
        comment: "Best biryani in Bangalore! The ambiance is perfect for family dinners.",
        date: "2 days ago",
        verified: true
      }
    ],
    features: ["Valet Parking", "Private Dining", "Live Music", "Home Delivery"],
    socialMedia: {
      instagram: "spicegardenblr",
      facebook: "spicegardenrestaurant"
    }
  },
  {
    id: "5",
    name: "FitLife Gym & Wellness",
    category: "Fitness",
    rating: 4.6,
    reviewCount: 198,
    priceRange: "₹₹₹",
    location: "Sector 18, Noida",
    city: "Delhi",
    distance: "4.2 km",
    coordinates: { lat: 28.5706, lng: 77.3217 },
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
    ],
    isNew: true,
    offers: true,
    categories: ["Gym", "Personal Training", "Yoga", "CrossFit"],
    description: "State-of-the-art fitness center with certified trainers and modern equipment for all fitness levels.",
    phone: "+91 98765 43214",
    email: "join@fitlifegym.com",
    website: "www.fitlifegym.com",
    hours: [
      { day: "Monday", open: "05:00", close: "23:00", isOpen: true },
      { day: "Tuesday", open: "05:00", close: "23:00", isOpen: true },
      { day: "Wednesday", open: "05:00", close: "23:00", isOpen: true },
      { day: "Thursday", open: "05:00", close: "23:00", isOpen: true },
      { day: "Friday", open: "05:00", close: "23:00", isOpen: true },
      { day: "Saturday", open: "06:00", close: "22:00", isOpen: true },
      { day: "Sunday", open: "06:00", close: "20:00", isOpen: true }
    ],
    isOpenNow: true,
    products: [
      {
        id: "p8",
        name: "Annual Membership",
        price: "₹35,000",
        description: "Full access to all facilities and group classes",
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
        category: "Membership"
      },
      {
        id: "p9",
        name: "Personal Training Pack",
        price: "₹15,000",
        description: "20 sessions with certified personal trainer",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
        category: "Training"
      }
    ],
    reviews: [
      {
        id: "r8",
        name: "Neha Sharma",
        rating: 5,
        comment: "Amazing facilities and the trainers are really motivating!",
        date: "1 week ago",
        verified: true
      }
    ],
    features: ["24/7 Access", "Personal Trainers", "Steam & Sauna", "Nutrition Counseling"],
    socialMedia: {
      instagram: "fitlifegym",
      facebook: "fitlifewellness"
    }
  },
  {
    id: "6",
    name: "Serenity Spa & Beauty",
    category: "Beauty",
    rating: 4.8,
    reviewCount: 245,
    priceRange: "₹₹₹₹",
    location: "Jubilee Hills, Hyderabad",
    city: "Hyderabad",
    distance: "2.8 km",
    coordinates: { lat: 17.4326, lng: 78.4071 },
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
    ],
    isNew: false,
    offers: true,
    categories: ["Spa", "Salon", "Wellness", "Massage"],
    description: "Luxury spa offering world-class treatments and rejuvenation therapies in a tranquil environment.",
    phone: "+91 98765 43215",
    email: "book@serenityspa.com",
    website: "www.serenityspa.com",
    hours: [
      { day: "Monday", open: "10:00", close: "21:00", isOpen: true },
      { day: "Tuesday", open: "10:00", close: "21:00", isOpen: true },
      { day: "Wednesday", open: "10:00", close: "21:00", isOpen: true },
      { day: "Thursday", open: "10:00", close: "21:00", isOpen: true },
      { day: "Friday", open: "10:00", close: "21:00", isOpen: true },
      { day: "Saturday", open: "09:00", close: "22:00", isOpen: true },
      { day: "Sunday", open: "09:00", close: "20:00", isOpen: true }
    ],
    isOpenNow: true,
    products: [
      {
        id: "p10",
        name: "Signature Spa Package",
        price: "₹8,500",
        description: "3-hour complete relaxation with massage, facial, and body wrap",
        image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
        category: "Spa"
      }
    ],
    reviews: [
      {
        id: "r9",
        name: "Priyanka Das",
        rating: 5,
        comment: "Absolutely heavenly experience! The therapists are highly skilled.",
        date: "3 days ago",
        verified: true
      }
    ],
    features: ["Aromatherapy", "Couples Rooms", "Organic Products", "Expert Therapists"],
    socialMedia: {
      instagram: "serenityspahyderabad"
    }
  },
  {
    id: "7",
    name: "TechHub Electronics",
    category: "Electronics",
    rating: 4.4,
    reviewCount: 178,
    priceRange: "₹₹₹",
    location: "Nehru Place, Delhi",
    city: "Delhi",
    distance: "5.1 km",
    coordinates: { lat: 28.5494, lng: 77.2531 },
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    images: [
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
    ],
    isNew: false,
    offers: true,
    categories: ["Computers", "Smartphones", "Accessories", "Repairs"],
    description: "Your one-stop destination for latest electronics, gadgets, and expert repair services.",
    phone: "+91 98765 43216",
    email: "sales@techhub.com",
    website: "www.techhub.com",
    hours: [
      { day: "Monday", open: "10:00", close: "20:00", isOpen: true },
      { day: "Tuesday", open: "10:00", close: "20:00", isOpen: true },
      { day: "Wednesday", open: "10:00", close: "20:00", isOpen: true },
      { day: "Thursday", open: "10:00", close: "20:00", isOpen: true },
      { day: "Friday", open: "10:00", close: "20:00", isOpen: true },
      { day: "Saturday", open: "10:00", close: "21:00", isOpen: true },
      { day: "Sunday", open: "11:00", close: "19:00", isOpen: true }
    ],
    isOpenNow: true,
    products: [
      {
        id: "p11",
        name: "Gaming Laptop",
        price: "₹85,000",
        description: "High-performance gaming laptop with RTX graphics",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=1768&q=80",
        category: "Laptops"
      }
    ],
    reviews: [
      {
        id: "r10",
        name: "Rahul Kumar",
        rating: 4,
        comment: "Good range of products at competitive prices. Helpful staff.",
        date: "5 days ago",
        verified: true
      }
    ],
    features: ["Genuine Products", "EMI Available", "Expert Repairs", "Exchange Offers"],
    socialMedia: {
      instagram: "techhubindia",
      facebook: "techhubelectronics"
    }
  },
  {
    id: "8",
    name: "Green Leaf Organic Store",
    category: "Grocery",
    rating: 4.5,
    reviewCount: 134,
    priceRange: "₹₹",
    location: "Anna Nagar, Chennai",
    city: "Chennai",
    distance: "2.3 km",
    coordinates: { lat: 13.0850, lng: 80.2101 },
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1774&q=80",
    images: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1774&q=80",
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
    ],
    isNew: true,
    offers: true,
    categories: ["Organic", "Fresh Produce", "Health Foods", "Dairy"],
    description: "Premium organic groceries sourced directly from certified farms. Fresh, healthy, and sustainable.",
    phone: "+91 98765 43217",
    email: "order@greenleaforganic.com",
    website: "www.greenleaforganic.com",
    hours: [
      { day: "Monday", open: "07:00", close: "21:00", isOpen: true },
      { day: "Tuesday", open: "07:00", close: "21:00", isOpen: true },
      { day: "Wednesday", open: "07:00", close: "21:00", isOpen: true },
      { day: "Thursday", open: "07:00", close: "21:00", isOpen: true },
      { day: "Friday", open: "07:00", close: "21:00", isOpen: true },
      { day: "Saturday", open: "07:00", close: "22:00", isOpen: true },
      { day: "Sunday", open: "08:00", close: "20:00", isOpen: true }
    ],
    isOpenNow: true,
    products: [
      {
        id: "p12",
        name: "Weekly Organic Box",
        price: "₹1,500",
        description: "Curated box of fresh organic vegetables and fruits",
        image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
        category: "Subscription"
      }
    ],
    reviews: [
      {
        id: "r11",
        name: "Lakshmi Iyer",
        rating: 5,
        comment: "Fresh organic produce every time! Love the quality.",
        date: "1 day ago",
        verified: true
      }
    ],
    features: ["Farm Fresh", "Home Delivery", "Subscription Plans", "Zero Pesticides"],
    socialMedia: {
      instagram: "greenleafchennai"
    }
  },
  {
    id: "9",
    name: "AutoCare Service Center",
    category: "Automotive",
    rating: 4.6,
    reviewCount: 267,
    priceRange: "₹₹",
    location: "Viman Nagar, Pune",
    city: "Pune",
    distance: "3.4 km",
    coordinates: { lat: 18.5679, lng: 73.9143 },
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1932&q=80",
    images: [
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1932&q=80",
      "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
    ],
    isNew: false,
    offers: true,
    categories: ["Car Service", "Repairs", "Detailing", "Accessories"],
    description: "Complete automotive care with certified mechanics. From routine maintenance to complex repairs.",
    phone: "+91 98765 43218",
    email: "service@autocarepc.com",
    website: "www.autocarepc.com",
    hours: [
      { day: "Monday", open: "08:00", close: "19:00", isOpen: true },
      { day: "Tuesday", open: "08:00", close: "19:00", isOpen: true },
      { day: "Wednesday", open: "08:00", close: "19:00", isOpen: true },
      { day: "Thursday", open: "08:00", close: "19:00", isOpen: true },
      { day: "Friday", open: "08:00", close: "19:00", isOpen: true },
      { day: "Saturday", open: "08:00", close: "17:00", isOpen: true },
      { day: "Sunday", open: "Closed", close: "Closed", isOpen: false }
    ],
    isOpenNow: true,
    products: [
      {
        id: "p13",
        name: "Full Car Service",
        price: "₹4,500",
        description: "Complete service including oil change, filters, and inspection",
        image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1774&q=80",
        category: "Service"
      }
    ],
    reviews: [
      {
        id: "r12",
        name: "Suresh Patil",
        rating: 5,
        comment: "Honest service at fair prices. My go-to garage for years!",
        date: "4 days ago",
        verified: true
      }
    ],
    features: ["Certified Mechanics", "Genuine Parts", "Pickup & Drop", "90-Day Warranty"],
    socialMedia: {
      facebook: "autocarepune"
    }
  },
  {
    id: "10",
    name: "BookWorm Cafe & Library",
    category: "Cafe",
    rating: 4.9,
    reviewCount: 189,
    priceRange: "₹",
    location: "Salt Lake, Kolkata",
    city: "Kolkata",
    distance: "1.8 km",
    coordinates: { lat: 22.5807, lng: 88.4140 },
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    images: [
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1774&q=80"
    ],
    isNew: true,
    offers: false,
    categories: ["Coffee", "Books", "Snacks", "Co-working"],
    description: "Cozy cafe with an extensive book collection. Perfect for reading, working, or casual meetings.",
    phone: "+91 98765 43219",
    email: "hello@bookwormcafe.com",
    website: "www.bookwormcafe.com",
    hours: [
      { day: "Monday", open: "08:00", close: "22:00", isOpen: true },
      { day: "Tuesday", open: "08:00", close: "22:00", isOpen: true },
      { day: "Wednesday", open: "08:00", close: "22:00", isOpen: true },
      { day: "Thursday", open: "08:00", close: "22:00", isOpen: true },
      { day: "Friday", open: "08:00", close: "23:00", isOpen: true },
      { day: "Saturday", open: "09:00", close: "23:00", isOpen: true },
      { day: "Sunday", open: "09:00", close: "21:00", isOpen: true }
    ],
    isOpenNow: true,
    products: [
      {
        id: "p14",
        name: "Monthly Membership",
        price: "₹1,200",
        description: "Unlimited coffee refills and book borrowing for a month",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
        category: "Membership"
      }
    ],
    reviews: [
      {
        id: "r13",
        name: "Ananya Bose",
        rating: 5,
        comment: "My favorite place in the city! Great coffee and amazing book selection.",
        date: "2 days ago",
        verified: true
      }
    ],
    features: ["Free WiFi", "Book Exchange", "Quiet Zones", "Pet Friendly"],
    socialMedia: {
      instagram: "bookwormcafekolkata"
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