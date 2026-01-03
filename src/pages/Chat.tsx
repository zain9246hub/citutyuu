
import React from "react";
import ChatComponent from "@/components/chat/ChatComponent";
import { useAuth } from "@/contexts/AuthContext";

const Chat = () => {
  // Both business and explorer roles can access chat functionality
  const { currentUser } = useAuth();
  
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-purple-900 dark:to-indigo-900 safe-area-view relative overflow-hidden">
      {/* Premium animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200/30 via-pink-200/30 to-cyan-200/30 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-cyan-500/20 animate-gradient-x" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.08),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      
      {/* Floating orbs for premium feel */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-300/30 dark:bg-purple-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-16 w-24 h-24 bg-cyan-300/30 dark:bg-cyan-500/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}} />
      <div className="absolute bottom-32 left-20 w-40 h-40 bg-pink-300/30 dark:bg-pink-500/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}} />
      
      <div className="flex-1 overflow-hidden relative z-10">
        <ChatComponent />
      </div>
    </div>
  );
};

export default Chat;
