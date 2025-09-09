
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
    <div className="bg-white p-6 flex flex-col items-center border-b">
      <div className="relative">
        <Avatar className="h-20 w-20 mb-2">
          <AvatarImage src={avatarUrl} alt={currentUser.name} />
          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <button 
          onClick={changeAvatar}
          className="absolute bottom-1 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 shadow-md"
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
      <h1 className="text-xl font-bold">{currentUser.name}</h1>
      <p className="text-sm text-gray-500 mb-2">{currentUser.email}</p>
      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mb-4">
        {currentUser.role === "business" ? "Business" : "Explorer"}
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2">
          <UserPen className="h-4 w-4" /> {isEditing ? "Cancel Edit" : "Edit Profile"}
        </Button>
        <Button variant="outline" size="sm" onClick={onLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
