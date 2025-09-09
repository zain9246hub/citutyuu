
import React, { useState } from "react";
import { Mic, Send, StopCircle, Image, Paperclip, Smile, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";
import SubscriptionDialog from "@/components/subscription/SubscriptionDialog";

interface ChatInputProps {
  onSend: (content: string, contentType: "text" | "voice") => void;
  startRecording: () => void;
  stopRecording: () => void;
  isRecording: boolean;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  startRecording,
  stopRecording,
  isRecording,
  disabled = false,
}) => {
  const [message, setMessage] = useState("");
  const [showAttachOptions, setShowAttachOptions] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const { toast } = useToast();
  const { canShareImages } = useSubscription();

  const handleSend = () => {
    if (message.trim()) {
      onSend(message, "text");
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      stopRecording();
      toast({
        title: "Voice message recorded",
        description: "Your voice message has been sent.",
      });
    } else {
      try {
        startRecording();
        toast({
          title: "Recording started",
          description: "Speak now. Click the stop button when finished.",
        });
      } catch (error) {
        console.error("Error starting recording:", error);
        toast({
          title: "Recording failed",
          description: "Failed to access microphone. Please check your permissions.",
          variant: "destructive",
        });
      }
    }
  };

  const toggleAttachOptions = () => {
    setShowAttachOptions(!showAttachOptions);
  };

  const handleImageShare = () => {
    if (!canShareImages) {
      setShowSubscriptionDialog(true);
      return;
    }
    // Demo: Image sharing functionality for subscribers
    toast({
      title: "Image sharing",
      description: "Demo: Image sharing is available for subscribers!",
    });
  };

  return (
    <div className="border-t border-white/10 p-4 bg-white/5 backdrop-blur-sm sticky bottom-0 z-10 pb-8 safe-bottom">
      {showAttachOptions && (
        <div className="flex items-center gap-3 mb-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 shadow-lg">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleImageShare}
            className={`h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white hover:text-white transition-all duration-300 transform hover:scale-110 ${!canShareImages ? 'opacity-60' : ''}`} 
            disabled={disabled || isRecording}
            title={canShareImages ? "Share image" : "Premium feature - Subscribe to share images"}
          >
            <Image className="h-5 w-5" />
            {!canShareImages && <Crown className="h-3 w-3 absolute -top-1 -right-1 text-primary" />}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white hover:text-white transition-all duration-300 transform hover:scale-110" 
            disabled={disabled || isRecording}
          >
            <Smile className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      <div className="flex items-end gap-3">
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleAttachOptions}
          disabled={disabled || isRecording}
          className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white flex-shrink-0 transition-all duration-300 transform hover:scale-110"
          title="Attach files"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 resize-none min-h-[48px] max-h-[120px] py-3 px-4 text-base rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 placeholder:text-white/50 text-white focus-visible:border-white/40 focus-visible:ring-white/20 shadow-lg transition-all duration-300"
            disabled={disabled || isRecording}
          />
          
          {/* Premium typing indicator */}
          {message.trim() && (
            <div className="absolute bottom-2 right-3 flex gap-1">
              <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}} />
              <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}} />
            </div>
          )}
        </div>
        
        {message.trim() ? (
          <Button
            size="icon"
            onClick={handleSend}
            disabled={disabled || !message.trim() || isRecording}
            title="Send message"
            className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border border-white/20 flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          >
            <Send className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            size="icon"
            variant={isRecording ? "destructive" : "default"}
            onClick={handleVoiceRecord}
            disabled={disabled}
            title={isRecording ? "Stop recording" : "Record voice message"}
            className={`h-10 w-10 rounded-full flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-white/20 ${
              isRecording 
                ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 animate-pulse" 
                : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            }`}
          >
            {isRecording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
        )}
      </div>
      
      {isRecording && (
        <div className="mt-4 text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-sm text-red-300">Recording... Click stop when finished</span>
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-red-400 rounded-full animate-pulse" />
              <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}} />
              <div className="w-1 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}} />
            </div>
          </div>
        </div>
      )}
      
      <SubscriptionDialog 
        open={showSubscriptionDialog} 
        onOpenChange={setShowSubscriptionDialog} 
      />
    </div>
  );
};

export default ChatInput;
