
import React from "react";
import { useChat } from "@/hooks/useChat";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const ChatComponent: React.FC = () => {
  const {
    messages,
    sendMessage,
    activeChat,
    setActiveChat,
    chats,
    startRecording,
    stopRecording,
    isRecording,
    addImageMessage,
    recordingTime,
  } = useChat();
  
  return (
    <div className="flex flex-col h-full max-w-md mx-auto w-full relative">
      {/* Premium glass container */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl" />
      <div className="relative z-10 flex flex-col h-full rounded-2xl overflow-hidden">
        <ChatHeader 
          activeChat={activeChat} 
          setActiveChat={setActiveChat} 
          chats={chats} 
        />
        <ChatMessages messages={activeChat ? messages[activeChat] || [] : []} />
        <ChatInput 
          onSend={sendMessage} 
          startRecording={startRecording}
          stopRecording={stopRecording}
          isRecording={isRecording}
          disabled={!activeChat}
          onImageUpload={(imageUrl) => activeChat && addImageMessage(activeChat, imageUrl)}
          recordingTime={recordingTime}
        />
      </div>
    </div>
  );
};

export default ChatComponent;
