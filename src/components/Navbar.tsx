
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Film, MessageSquare, User, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(lastScrollY > currentScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  
  // Hide navbar on chat and reels pages
  if (location.pathname === "/chat" || location.pathname === "/reels") {
    return null;
  }

  return (
    <motion.div 
      className="fixed bottom-0 w-full z-50 safe-bottom"
      initial={{ y: "100%" }}
      animate={{ 
        y: isVisible ? 0 : "100%",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="px-4 py-2 mx-auto glass-navbar border-t">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {[
            { path: "/", icon: Home, label: "Home" },
            { path: "/explore", icon: Search, label: "Explore" },
            { path: "/businesses", icon: Building2, label: "Business" },
            { path: "/reels", icon: Film, label: "Reels" },
            { path: "/chat", icon: MessageSquare, label: "Chat" },
            { path: "/profile", icon: User, label: "Profile" },
          ].map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className="group relative flex flex-col items-center"
            >
              <motion.div
                className={`p-2 rounded-xl transition-all duration-300 group-hover:bg-primary/5 ${
                  location.pathname === path 
                    ? 'bg-gradient-to-r from-red-500/10 via-yellow-500/10 via-green-500/10 via-blue-500/10 to-purple-500/10' 
                    : ''
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Icon 
                  className={`h-5 w-5 transition-all duration-300 ${
                    location.pathname === path
                      ? 'text-primary scale-110'
                      : 'text-muted-foreground group-hover:text-primary group-hover:scale-110'
                  }`}
                />
                <motion.div
                  className={`absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-medium whitespace-nowrap ${
                    location.pathname === path
                      ? 'text-primary'
                      : 'text-muted-foreground group-hover:text-primary'
                  }`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ 
                    y: location.pathname === path ? 0 : 10,
                    opacity: location.pathname === path ? 1 : 0
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {label}
                </motion.div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
