
import { UserPen, LogOut, Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  currentUser: User;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  onLogout: () => void;
}

const ProfileHeader = ({ currentUser, isEditing, setIsEditing, onLogout }: ProfileHeaderProps) => {
  const [avatarSeed, setAvatarSeed] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for custom avatar in localStorage first
    const customAvatar = localStorage.getItem(`custom-avatar-${currentUser.email}`);
    
    if (customAvatar) {
      setAvatarUrl(customAvatar);
    } else {
      // Fall back to DiceBear avatar
      const savedSeed = localStorage.getItem(`avatar-seed-${currentUser.email}`);
      if (savedSeed) {
        setAvatarSeed(savedSeed);
      } else {
        setAvatarSeed(currentUser.email);
      }
      
      updateAvatarUrl();
    }
  }, [currentUser.email]);

  // Update avatar URL whenever seed changes
  useEffect(() => {
    if (avatarSeed) {
      updateAvatarUrl();
    }
  }, [avatarSeed]);

  const updateAvatarUrl = () => {
    setAvatarUrl(`https://api.dicebear.com/7.x/avatars/svg?seed=${avatarSeed}&randomizeIds=true&t=${Date.now()}`);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      
      // Create a URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
      
      // Save to localStorage
      localStorage.setItem(`custom-avatar-${currentUser.email}`, imageUrl);
      
      toast({
        title: "Avatar Updated",
        description: "Your profile photo has been updated successfully",
      });
    }
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const changeAvatar = () => {
    // Simply open the file selector
    openFileSelector();
  };

  return (
    <div className="bg-background p-6 flex flex-col items-center">
      <div className="relative mb-4">
        <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
          <AvatarImage src={avatarUrl} alt={currentUser.name} />
          <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            {currentUser.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <button 
          onClick={changeAvatar}
          className="absolute -bottom-1 -right-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 shadow-lg border-2 border-white transition-all duration-200 hover:scale-105"
          aria-label="Change profile photo"
        >
          <Camera className="h-4 w-4" />
        </button>
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      
      <h1 className="text-2xl font-bold text-foreground mb-1">{currentUser.name}</h1>
      <p className="text-sm text-muted-foreground mb-3">{currentUser.email}</p>
      
      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
        {currentUser.role === "business" ? "Business" : "Explorer"}
      </span>
      
      <div className="flex gap-3 w-full max-w-xs">
        <Button 
          variant="outline" 
          className="flex-1 h-11 font-medium" 
          onClick={() => setIsEditing(!isEditing)}
        >
          <UserPen className="h-4 w-4 mr-2" />
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 h-11 font-medium" 
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
