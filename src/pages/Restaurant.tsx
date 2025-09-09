
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

// Refactored components
import RestaurantHeader from "@/components/restaurant/RestaurantHeader";
import RestaurantGallery from "@/components/restaurant/RestaurantGallery";
import RestaurantInfo from "@/components/restaurant/RestaurantInfo";
import MenuTab from "@/components/restaurant/MenuTab";
import ReviewsTab from "@/components/restaurant/ReviewsTab";
import ReservationTab from "@/components/restaurant/ReservationTab";

const Restaurant = () => {
  const { toast } = useToast();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("menu");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingGuests, setBookingGuests] = useState("2");

  const restaurantImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    "https://images.unsplash.com/photo-1592861956120-e524fc739696?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  ];

  const menuCategories = [
    { id: "starters", name: "Starters", items: [
      { name: "Truffle Arancini", price: "₹450", description: "Crispy risotto balls with black truffle and parmesan", image: "https://images.unsplash.com/photo-1576866209830-589e1bfbaa4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80" },
      { name: "Herb Focaccia", price: "₹350", description: "Freshly baked Italian bread with rosemary and sea salt", image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80" },
      { name: "Burrata Caprese", price: "₹550", description: "Fresh burrata cheese with heirloom tomatoes and basil", image: "https://images.unsplash.com/photo-1626200419199-391ae4fc95bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80" }
    ]},
    { id: "mains", name: "Main Courses", items: [
      { name: "Wild Mushroom Risotto", price: "₹750", description: "Arborio rice with wild mushrooms and black truffle", image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" },
      { name: "Grilled Sea Bass", price: "₹950", description: "Mediterranean sea bass with lemon and herbs", image: "https://images.unsplash.com/photo-1532333039171-140e4bf8cce7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80" },
      { name: "Lamb Chops", price: "₹1250", description: "New Zealand lamb chops with mint sauce and baby potatoes", image: "https://images.unsplash.com/photo-1611930021592-a8cfd5319ceb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80" }
    ]},
    { id: "desserts", name: "Desserts", items: [
      { name: "Tiramisu", price: "₹400", description: "Classic Italian dessert with coffee and mascarpone", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea2756c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80" },
      { name: "Chocolate Soufflé", price: "₹450", description: "Warm chocolate soufflé with vanilla ice cream", image: "https://images.unsplash.com/photo-1611329695518-1763fc6976fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" },
      { name: "Panna Cotta", price: "₹350", description: "Vanilla panna cotta with berry compote", image: "https://images.unsplash.com/photo-1570476922354-81227cdbb76c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2091&q=80" }
    ]},
    { id: "drinks", name: "Drinks", items: [
      { name: "Signature Cocktails", price: "₹550", description: "House special cocktails with premium spirits", image: "https://images.unsplash.com/photo-1582106245687-cbb466a9f07f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" },
      { name: "Wine Selection", price: "₹750", description: "Curated selection of international wines", image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" },
      { name: "Barista Coffee", price: "₹250", description: "Specialty coffee prepared by our expert baristas", image: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" }
    ]}
  ];

  const reviews = [
    { id: 1, name: "Aditya Sharma", rating: 5, comment: "Absolutely exceptional dining experience! The ambiance was sophisticated yet welcoming, and every dish was a masterpiece in both presentation and flavor. The service was impeccable, with staff who were both knowledgeable and attentive without being intrusive.", date: "2 days ago" },
    { id: 2, name: "Priya Patel", rating: 4, comment: "Wonderful place for a special evening. The tasting menu was innovative and the wine pairing was perfect. Only giving 4 stars because it was quite busy and a bit noisy.", date: "1 week ago" },
    { id: 3, name: "Raj Malhotra", rating: 5, comment: "One of the best culinary experiences in the city. The attention to detail is remarkable, from the elegant decor to the perfectly executed dishes. The chef's special lamb was the highlight of our meal.", date: "2 weeks ago" }
  ];
  
  const handleSaveRestaurant = () => {
    toast({
      title: "Restaurant Saved",
      description: "Added to your favorites",
    });
  };

  const handleShareRestaurant = () => {
    toast({
      title: "Share Options",
      description: "Sharing options will be available soon",
    });
  };

  const handleAddressClick = () => {
    window.open('https://maps.google.com?q=123 Luxury Lane, Bandra West, Mumbai', '_blank');
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+919876543210';
  };

  return (
    <div className="pb-24">
      {/* Header with back button */}
      <RestaurantHeader 
        handleSaveRestaurant={handleSaveRestaurant}
        handleShareRestaurant={handleShareRestaurant}
      />

      <div className="pt-16 max-w-md mx-auto">
        {/* Restaurant Images Gallery */}
        <RestaurantGallery 
          images={restaurantImages}
          activeImageIndex={activeImageIndex}
          setActiveImageIndex={setActiveImageIndex}
        />

        {/* Restaurant Info */}
        <RestaurantInfo 
          handleAddressClick={handleAddressClick}
          handlePhoneClick={handlePhoneClick}
        />

        {/* Tabs for Menu, Reviews, Book */}
        <Tabs defaultValue="menu" className="w-full" onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="grid grid-cols-3 mx-4">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="book">Reserve</TabsTrigger>
          </TabsList>

          {/* Menu Tab Content */}
          <TabsContent value="menu" className="px-4">
            <MenuTab menuCategories={menuCategories} />
          </TabsContent>

          {/* Reviews Tab Content */}
          <TabsContent value="reviews" className="px-4">
            <ReviewsTab reviews={reviews} />
          </TabsContent>

          {/* Book Tab Content */}
          <TabsContent value="book" className="px-4">
            <ReservationTab 
              bookingDate={bookingDate}
              setBookingDate={setBookingDate}
              bookingTime={bookingTime}
              setBookingTime={setBookingTime}
              bookingGuests={bookingGuests}
              setBookingGuests={setBookingGuests}
              handlePhoneClick={handlePhoneClick}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Navbar />
    </div>
  );
};

export default Restaurant;
