
import { Deal } from "@/types/deal";
import restaurantBurger from "@/assets/deals/restaurant-burger.jpg";
import electronicsTech from "@/assets/deals/electronics-tech.jpg";
import coffeeCafe from "@/assets/deals/coffee-cafe.jpg";
import homeAppliances from "@/assets/deals/home-appliances.jpg";
import dessertBakery from "@/assets/deals/dessert-bakery.jpg";
import spaWellness from "@/assets/deals/spa-wellness.jpg";
import fitnessGym from "@/assets/deals/fitness-gym.jpg";
import fashionClothing from "@/assets/deals/fashion-clothing.jpg";

// Demo images for different deal categories
const dealImages = {
  restaurant: restaurantBurger,
  electronics: electronicsTech,
  coffee: coffeeCafe,
  appliances: homeAppliances,
  dessert: dessertBakery,
  spa: spaWellness,
  fitness: fitnessGym,
  fashion: fashionClothing,
};

// Enhanced deals array with realistic examples and proper demo images
export const deals: Deal[] = [
  {
    id: 1,
    title: "Gourmet Burger Combo - 40% Off",
    description: "Enjoy our signature gourmet burger with crispy fries and a drink. Perfect for a satisfying meal with friends and family.",
    image: dealImages.restaurant,
    originalPrice: 1200,
    discountedPrice: 720,
    discount: 40,
    category: "Food & Dining",
    tags: ["burger", "restaurant", "combo", "gourmet"],
    location: "12 MG Road, Andheri West",
    city: "Mumbai",
    phone: "+91 9876543210",
    expiryDate: "2025-05-31",
    rating: 4.5,
    featured: true,
    duration: 7,
  },
  {
    id: 2,
    title: "Latest Smartphones & Laptops - 50% Off",
    description: "Huge electronics sale on premium smartphones, laptops, and accessories. Limited time offer on select models.",
    image: dealImages.electronics,
    originalPrice: 25000,
    discountedPrice: 12500,
    discount: 50,
    category: "Shopping",
    tags: ["electronics", "smartphone", "laptop", "technology"],
    location: "42 Tech Plaza, Koramangala",
    city: "Bangalore",
    phone: "+91 9988776655",
    expiryDate: "2025-06-07",
    rating: 4.2,
    featured: true,
    duration: 15,
  },
  {
    id: 3,
    title: "Artisan Coffee & Pastries - Buy 1 Get 1 Free",
    description: "Freshly brewed artisan coffee with handmade pastries. Perfect spot for your morning coffee or evening hangout.",
    image: dealImages.coffee,
    originalPrice: 400,
    discountedPrice: 200,
    discount: 50,
    category: "Food & Dining",
    tags: ["coffee", "cafe", "pastries", "artisan", "bogo"],
    location: "101 Connaught Place, Central Delhi",
    city: "Delhi",
    phone: "+91 9876543100",
    expiryDate: "2025-05-28",
    rating: 4.8,
    featured: true,
    duration: 3,
  },
  {
    id: 4,
    title: "Premium Home Appliances - 30% Off",
    description: "Upgrade your home with energy-efficient appliances. Latest models with warranty and free installation.",
    image: dealImages.appliances,
    originalPrice: 8000,
    discountedPrice: 5600,
    discount: 30,
    category: "Shopping",
    tags: ["appliances", "home", "kitchen", "energy-efficient"],
    location: "99 Express Avenue, Anna Nagar",
    city: "Chennai",
    phone: "+91 9900112233",
    expiryDate: "2025-06-10",
    rating: 4.1,
    featured: false,
    duration: 10,
  },
  {
    id: 5,
    title: "Luxury Dessert Platter - Free with Main Course",
    description: "Indulge in our exquisite dessert collection. Get a complimentary luxury dessert platter with any main course.",
    image: dealImages.dessert,
    originalPrice: 1200,
    discountedPrice: 1200,
    discount: 0,
    category: "Food & Dining",
    tags: ["dessert", "luxury", "free", "main course"],
    location: "50 Park Street, Park Circus",
    city: "Kolkata",
    phone: "+91 9123456789",
    expiryDate: "2025-05-30",
    rating: 4.6,
    featured: false,
    duration: 5,
  },
  {
    id: 6,
    title: "Relaxing Spa Package - 60% Off",
    description: "Unwind with our premium spa treatments including full body massage, facial, and aromatherapy session.",
    image: dealImages.spa,
    originalPrice: 3500,
    discountedPrice: 1400,
    discount: 60,
    category: "Health & Beauty",
    tags: ["spa", "massage", "wellness", "relaxation", "beauty"],
    location: "15 Spa Gardens, Banjara Hills",
    city: "Hyderabad",
    phone: "+91 9876541234",
    expiryDate: "2025-06-15",
    rating: 4.7,
    featured: true,
    duration: 12,
  },
  {
    id: 7,
    title: "Fitness Gym Membership - 3 Months Free",
    description: "Join our state-of-the-art fitness center with modern equipment, personal training, and group classes.",
    image: dealImages.fitness,
    originalPrice: 4500,
    discountedPrice: 1500,
    discount: 67,
    category: "Health & Beauty",
    tags: ["gym", "fitness", "membership", "training", "health"],
    location: "88 Fitness Complex, Sector 17",
    city: "Pune",
    phone: "+91 9988445566",
    expiryDate: "2025-06-20",
    rating: 4.3,
    featured: false,
    duration: 20,
  },
  {
    id: 8,
    title: "Trendy Fashion Collection - 45% Off",
    description: "Latest fashion trends for men and women. Designer clothing, accessories, and footwear at unbeatable prices.",
    image: dealImages.fashion,
    originalPrice: 2500,
    discountedPrice: 1375,
    discount: 45,
    category: "Shopping",
    tags: ["fashion", "clothing", "designer", "trendy", "accessories"],
    location: "22 Fashion Street, Commercial Street",
    city: "Bangalore",
    phone: "+91 9876567890",
    expiryDate: "2025-06-05",
    rating: 4.4,
    featured: true,
    duration: 8,
  },
  {
    id: 9,
    title: "Weekend Brunch Special - 35% Off",
    description: "All-you-can-eat brunch buffet with continental and Indian delicacies. Perfect for family weekend outings.",
    image: dealImages.restaurant,
    originalPrice: 1500,
    discountedPrice: 975,
    discount: 35,
    category: "Food & Dining",
    tags: ["brunch", "buffet", "weekend", "family", "continental"],
    location: "77 Marine Drive, Nariman Point",
    city: "Mumbai",
    phone: "+91 9876098765",
    expiryDate: "2025-06-12",
    rating: 4.5,
    featured: false,
    duration: 14,
  },
  {
    id: 10,
    title: "Premium Coffee Beans - 40% Off",
    description: "Freshly roasted premium coffee beans from around the world. Perfect for home brewing enthusiasts.",
    image: dealImages.coffee,
    originalPrice: 800,
    discountedPrice: 480,
    discount: 40,
    category: "Food & Dining",
    tags: ["coffee", "beans", "premium", "fresh", "home brewing"],
    location: "33 Coffee Lane, Hauz Khas",
    city: "Delhi",
    phone: "+91 9876543987",
    expiryDate: "2025-05-25",
    rating: 4.6,
    featured: false,
    duration: 6,
  },
];

// Util to add a new deal (used in DealUploadForm)
export function addDeal(deal: Deal) {
  const existing = localStorage.getItem("userDeals");
  let userDeals: Deal[] = [];
  if (existing) {
    try {
      userDeals = JSON.parse(existing);
    } catch (e) {
      userDeals = [];
    }
  }
  userDeals.push(deal);
  localStorage.setItem("userDeals", JSON.stringify(userDeals));
  
  // Trigger real-time notification for new deal
  const event = new CustomEvent('newDealAdded', { 
    detail: { deal } 
  });
  window.dispatchEvent(event);
}

