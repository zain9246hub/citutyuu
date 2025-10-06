
import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/hooks/useChat";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { CheckCheck, Check, MessageSquare } from "lucide-react";

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-3 sm:p-4 bg-gradient-to-b from-transparent to-black/5">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center p-6 min-h-[400px]">
            <div className="max-w-xs p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Start a conversation by sending a message or voice note
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={message.id} 
              className={`flex flex-col animate-fade-in transition-all duration-500 ease-out`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`flex items-start gap-3 ${message.sender === "You" ? "justify-end" : ""}`}>
                {message.sender !== "You" && (
                  <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-white/20 shadow-lg hover:scale-110 transition-all duration-300">
                    <AvatarFallback className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium">
                      {message.sender.charAt(0)}
                    </AvatarFallback>
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${message.sender}&background=random`} />
                  </Avatar>
                )}
                <div className={`flex flex-col ${message.sender === "You" ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-xs text-white/70">{message.sender}</span>
                    <span className="text-xs text-white/50">
                      {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <div 
                    className={`relative p-4 rounded-2xl max-w-[80%] sm:max-w-[280px] transition-all duration-300 hover:scale-[1.02] group
                      ${message.sender === "You" 
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-tr-sm shadow-lg hover:shadow-xl" 
                        : "bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-tl-sm shadow-lg hover:shadow-xl"}`}
                  >
                    {/* Premium glass effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10">
                      {message.contentType === "text" ? (
                        <p className="text-sm break-words leading-relaxed">{message.content}</p>
                      ) : message.contentType === "image" ? (
                        <div className="flex flex-col gap-2">
                          {message.imageUrl ? (
                            <img 
                              src={message.imageUrl} 
                              alt="Shared image" 
                              className="max-w-full h-auto rounded-lg shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
                              onClick={() => window.open(message.imageUrl, '_blank')}
                            />
                          ) : (
                            <p className="text-sm text-red-400">Image unavailable</p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                          {message.audioUrl ? (
                            <audio 
                              src={message.audioUrl} 
                              controls 
                              preload="auto"
                              controlsList="nodownload"
                              className="max-w-[150px] sm:max-w-[200px] md:max-w-[250px] h-8 rounded-lg opacity-80 hover:opacity-100 transition-opacity"
                              onLoadedMetadata={(e) => {
                                console.log('Audio loaded successfully:', {
                                  duration: e.currentTarget.duration,
                                  readyState: e.currentTarget.readyState,
                                  src: e.currentTarget.src.substring(0, 50) + '...'
                                });
                              }}
                              onCanPlay={() => {
                                console.log('Audio can play');
                              }}
                              onError={(e) => {
                                console.error('Audio playback error:', e);
                                const audioElement = e.currentTarget;
                                const errorDetails = {
                                  error: audioElement.error?.code,
                                  errorMessage: audioElement.error?.message,
                                  networkState: audioElement.networkState,
                                  readyState: audioElement.readyState,
                                  src: audioElement.src.substring(0, 100)
                                };
                                console.error('Audio error details:', errorDetails);
                                toast({
                                  title: "Audio Error",
                                  description: `Failed to load voice message (Error code: ${audioElement.error?.code || 'unknown'})`,
                                  variant: "destructive"
                                });
                              }}
                              onPlay={() => console.log('Audio started playing')}
                            />
                          ) : (
                            <p className="text-sm text-red-400">Voice message unavailable</p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Delivery status indicator */}
                    {message.sender === "You" && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white/20 animate-pulse" />
                    )}
                  </div>
                </div>
                {message.sender === "You" && (
                  <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-white/20 shadow-lg hover:scale-110 transition-all duration-300">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500 text-white font-medium">
                      {message.sender.charAt(0)}
                    </AvatarFallback>
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${message.sender}&background=random`} />
                  </Avatar>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
