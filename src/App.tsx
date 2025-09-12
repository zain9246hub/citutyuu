import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { LocationProvider } from "./contexts/LocationContext";
import { AdvertisementProvider } from "./contexts/AdvertisementContext";
import { CityProvider } from "./contexts/CityContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Reels from "./pages/Reels";
import Chat from "./pages/Chat";
import Explore from "./pages/Explore";
import AllBanners from "./pages/AllBanners";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BusinessListing from "./pages/BusinessListing";
import Business from "./pages/Business"; 
import BusinessUpload from "./pages/BusinessUpload";
import DealUpload from "./pages/DealUpload";
import NotFound from "./pages/NotFound";
import DealDetail from "./pages/DealDetail";
import AdminLocations from "./pages/AdminLocations";
import { useState, useEffect } from "react";
import { PushNotificationService } from "./services/pushNotificationService";

const App = () => {
  // Create a client inside the component
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    // Initialize push notifications when app starts
    PushNotificationService.initialize();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <SubscriptionProvider>
              <NotificationProvider>
                <AdvertisementProvider>
                  <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <LocationProvider>
                      <CityProvider>
                   <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    {/* Remove ProtectedRoute from Reels to allow public access */}
                    <Route path="/reels" element={<Reels />} />
                    <Route path="/chat" element={
                      <ProtectedRoute>
                        <Chat />
                      </ProtectedRoute>
                    } />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/all-banners" element={<AllBanners />} />
                    <Route path="/business/:id" element={<Business />} />
                    <Route path="/business" element={<Business />} />
                    <Route path="/businesses" element={<BusinessListing />} />
                    <Route path="/business-upload" element={
                      <ProtectedRoute>
                        <BusinessUpload />
                      </ProtectedRoute>
                    } />
                    <Route path="/deal-upload" element={
                      <ProtectedRoute>
                        <DealUpload />
                      </ProtectedRoute>
                    } />
                    <Route path="/deal/:id" element={<DealDetail />} />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/admin/locations" element={
                      <ProtectedRoute requiredRole="super-admin">
                        <AdminLocations />
                      </ProtectedRoute>
                    } />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                   </Routes>
                      </CityProvider>
                    </LocationProvider>
                  </BrowserRouter>
                  </TooltipProvider>
                </AdvertisementProvider>
              </NotificationProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
