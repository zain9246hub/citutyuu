import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import NotLoggedIn from "@/components/profile/NotLoggedIn";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { Tabs } from "@/components/ui/tabs";
import { useAdExpiry } from "@/hooks/useAdExpiry";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  
  // Track expiring ads and show notifications
  useAdExpiry();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col min-h-screen">
        <NotLoggedIn />
        <Navbar />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 max-w-md mx-auto w-full pb-20 safe-area-inset">
        <ProfileHeader
          currentUser={currentUser}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onLogout={handleLogout}
        />

        <div className="px-4">
          <Tabs defaultValue="profile" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            {isEditing ? (
              <ProfileEditForm onCancel={() => setIsEditing(false)} />
            ) : (
              <ProfileTabs
                currentUser={currentUser}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isEditing={isEditing}
              />
            )}
          </Tabs>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Profile;
