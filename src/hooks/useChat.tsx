
import { useEffect } from "react";
import { useRecording } from "./useRecording";
import { useMessages } from "./useMessages";
import { Message } from "../types/chat";
import { useCityContext } from "@/contexts/CityContext";

export type { Message, MessageStatus } from "../types/chat";

export const useChat = () => {
  const { selectedCity } = useCityContext();
  const {
    isRecording,
    audioChunks,
    startRecording,
    stopRecording,
    setAudioChunks,
    recordingTime
  } = useRecording();

  const {
    messages,
    sendMessage,
    activeChat,
    setActiveChat,
    chats,
    addVoiceMessage,
    addImageMessage
  } = useMessages();

  // Auto-switch to selected city chat when city changes
  useEffect(() => {
    if (selectedCity && chats.includes(selectedCity) && activeChat !== selectedCity) {
      setActiveChat(selectedCity);
    }
  }, [selectedCity, chats, activeChat, setActiveChat]);

  // Listen for audioChunks changes to create and send voice message
  useEffect(() => {
    if (!isRecording && audioChunks.length > 0 && activeChat) {
      console.log('Creating audio from chunks:', audioChunks.length, 'chunks');
      
      // Get MIME type from first chunk
      const recordedMimeType = audioChunks[0]?.type || 'audio/webm;codecs=opus';
      console.log('Recorded MIME type:', recordedMimeType);
      
      // Create blob with the recorded MIME type
      const audioBlob = new Blob(audioChunks, { type: recordedMimeType });
      console.log('Audio blob created:', {
        size: audioBlob.size,
        type: audioBlob.type,
        chunks: audioChunks.length
      });
      
      if (audioBlob.size === 0) {
        console.error('Audio blob is empty!');
        setAudioChunks([]);
        return;
      }
      
      // Convert blob to base64 for better persistence
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result as string;
        console.log('Audio converted to base64, format:', base64Audio.substring(0, 50));
        
        // Create and send the voice message with base64 data URL
        addVoiceMessage(activeChat, base64Audio);
      };
      reader.onerror = (error) => {
        console.error('Error converting audio to base64:', error);
        setAudioChunks([]);
      };
      reader.readAsDataURL(audioBlob);
      
      // Reset audio chunks immediately to prevent duplicate processing
      setAudioChunks([]);
    }
  }, [isRecording, audioChunks.length, activeChat, addVoiceMessage, setAudioChunks]);

  return {
    messages,
    sendMessage,
    activeChat,
    setActiveChat,
    chats,
    startRecording,
    stopRecording,
    isRecording,
    addImageMessage,
    recordingTime
  };
};
