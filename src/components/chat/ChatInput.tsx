
import React, { useState } from "react";
import { Mic, Send, StopCircle, Image, Paperclip, Smile } from "lucide-react";
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
  onImageUpload?: (imageUrl: string) => void;
  recordingTime?: number;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  startRecording,
  stopRecording,
  isRecording,
  disabled = false,
  onImageUpload,
  recordingTime = 0,
}) => {
  const [message, setMessage] = useState("");
  const [showAttachOptions, setShowAttachOptions] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const { toast } = useToast();
  const { canShareImages, canUseVoiceMessages, canSendMessage, monthlyMessagesUsed, maxMonthlyMessages, useMessage } = useSubscription();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      if (!canSendMessage) {
        toast({
          title: "Message Limit Reached",
          description: `Free users get ${maxMonthlyMessages} messages/month. Subscribe to City Chat for unlimited messages.`,
          variant: "destructive"
        });
        setShowSubscriptionDialog(true);
        return;
      }
      onSend(message, "text");
      setMessage("");
      useMessage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceRecord = () => {
    if (!canUseVoiceMessages && !isRecording) {
      setShowSubscriptionDialog(true);
      return;
    }
    
    if (isRecording) {
      stopRecording();
      const duration = recordingTime >= 60 ? "60 seconds (max)" : `${recordingTime} seconds`;
      toast({
        title: "Voice message recorded",
        description: `Recording duration: ${duration}`,
      });
    } else {
      try {
        startRecording();
        toast({
          title: "Recording started",
          description: "Speak now. Maximum 60 seconds.",
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
      setShowAttachOptions(false);
      return;
    }
    fileInputRef.current?.click();
    setShowAttachOptions(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      if (imageUrl && onImageUpload) {
        onImageUpload(imageUrl);
        toast({
          title: "Image shared",
          description: "Your image has been sent.",
        });
      }
    };
    reader.readAsDataURL(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <SubscriptionDialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="border-t border-purple-200/50 dark:border-white/10 p-4 bg-white/60 dark:bg-white/5 backdrop-blur-sm sticky bottom-0 z-10 pb-8 safe-bottom">
        {!canSendMessage && (
          <div className="mb-3 p-3 bg-orange-100 dark:bg-orange-500/20 backdrop-blur-sm border border-orange-300 dark:border-orange-500/30 rounded-xl">
            <p className="text-sm text-orange-700 dark:text-orange-200 text-center">
              {monthlyMessagesUsed}/{maxMonthlyMessages} free messages used this month
            </p>
          </div>
        )}
        
        {showAttachOptions && (
        <div className="flex items-center gap-3 mb-4 p-4 bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-200/50 dark:border-white/10 shadow-lg">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleImageShare}
            className="h-10 w-10 rounded-full bg-purple-100 dark:bg-white/10 backdrop-blur-sm border border-purple-200 dark:border-white/20 hover:bg-purple-200 dark:hover:bg-white/20 text-foreground transition-all duration-300 transform hover:scale-110" 
            disabled={disabled || isRecording}
          >
            <Image className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-full bg-purple-100 dark:bg-white/10 backdrop-blur-sm border border-purple-200 dark:border-white/20 hover:bg-purple-200 dark:hover:bg-white/20 text-foreground transition-all duration-300 transform hover:scale-110" 
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
          className="h-10 w-10 rounded-full bg-purple-100 dark:bg-white/10 backdrop-blur-sm border border-purple-200 dark:border-white/20 hover:bg-purple-200 dark:hover:bg-white/20 text-foreground flex-shrink-0 transition-all duration-300 transform hover:scale-110"
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
            className="flex-1 resize-none min-h-[48px] max-h-[120px] py-3 px-4 text-base rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-purple-200/50 dark:border-white/20 placeholder:text-muted-foreground text-foreground focus-visible:border-purple-400 dark:focus-visible:border-white/40 focus-visible:ring-purple-200/50 dark:focus-visible:ring-white/20 shadow-lg transition-all duration-300"
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
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-500/20 dark:to-pink-500/20 backdrop-blur-sm border border-red-300 dark:border-red-500/30 rounded-2xl shadow-lg">
              {/* Animated recording indicator */}
              <div className="relative">
                <div className="w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full animate-ping" />
              </div>
              
              {/* Timer display */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-red-700 dark:text-white tabular-nums animate-scale-in">
                  {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-xs text-red-500 dark:text-red-200">/ 1:00</span>
              </div>
            
              {/* Animated waveform */}
              <div className="flex gap-1 items-center">
                <div className="w-1 h-3 bg-red-500 dark:bg-red-400 rounded-full animate-pulse" />
                <div className="w-1 h-5 bg-red-500 dark:bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.1s'}} />
                <div className="w-1 h-4 bg-red-500 dark:bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}} />
                <div className="w-1 h-6 bg-red-500 dark:bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}} />
                <div className="w-1 h-3 bg-red-500 dark:bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}} />
              </div>
              
              {/* Recording text */}
              <span className="text-sm text-red-600 dark:text-red-200 font-medium">Recording</span>
            </div>
            
          {/* Progress bar */}
          <div className="mt-3 w-full max-w-xs mx-auto h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-400 to-pink-400 rounded-full transition-all duration-1000 ease-linear animate-pulse"
              style={{ width: `${(recordingTime / 60) * 100}%` }}
            />
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default ChatInput;
