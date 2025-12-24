
import React, { useMemo } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowLeft, MessageSquare, MapPin, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { STATE_TO_CITIES } from "@/utils/cityData";

// Helper to get state for a city
const getStateForCity = (city: string): string | null => {
  if (city === "All Cities") return null;
  for (const [state, cities] of Object.entries(STATE_TO_CITIES)) {
    if (cities.includes(city as any)) {
      return state;
    }
  }
  return null;
};

interface ChatHeaderProps {
  activeChat: string | null;
  setActiveChat: (chat: string) => void;
  chats: string[];
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  activeChat, 
  setActiveChat,
  chats
}) => {
  const navigate = useNavigate();
  
  const getCityIcon = (city: string) => {
    if (city === "All Cities") {
      return <Globe className="h-4 w-4 text-emerald-400" />;
    }
    return <MapPin className="h-4 w-4 text-purple-400" />;
  };
  
  return (
    <div className="border-b border-white/10 px-4 py-4 flex items-center justify-between bg-white/5 backdrop-blur-sm sticky top-0 z-10 safe-top">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-300 hover:scale-105"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center">
          <div className="relative">
            <MessageSquare className="h-5 w-5 text-white mr-2" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              City Chat
            </h1>
            {activeChat && (
              <div className="flex items-center gap-1 text-xs text-white/60">
                {getCityIcon(activeChat)}
                <span>
                  {activeChat}
                  {activeChat !== "All Cities" && getStateForCity(activeChat) && (
                    <span className="text-white/40">, {getStateForCity(activeChat)}</span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <Select 
        value={activeChat || ""} 
        onValueChange={setActiveChat}
      >
        <SelectTrigger className="w-[140px] sm:w-[180px] h-10 text-sm bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300 rounded-xl shadow-lg text-white">
          <div className="flex items-center gap-2">
            {activeChat && getCityIcon(activeChat)}
            <SelectValue placeholder="Select a city" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl max-h-[300px]">
          {chats.map((chat) => (
            <SelectItem 
              key={chat} 
              value={chat} 
              className="text-sm flex items-center gap-2 cursor-pointer hover:bg-white/10 focus:bg-white/10 transition-all duration-300 text-white"
            >
              <div className="flex items-center gap-2 w-full">
                {getCityIcon(chat)}
                <div className="flex flex-col flex-1">
                  <span>{chat}</span>
                  {chat !== "All Cities" && getStateForCity(chat) && (
                    <span className="text-[10px] text-white/40">{getStateForCity(chat)}</span>
                  )}
                </div>
                {chat === "All Cities" && (
                  <span className="text-xs text-emerald-400 font-medium">Global</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ChatHeader;
