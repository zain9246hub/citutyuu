
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
    setAudioChunks
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
      console.log('Creating audio from chunks:', audioChunks.length);
      
      // Try multiple MIME types for better compatibility
      const mimeTypes = ['audio/webm', 'audio/webm;codecs=opus', 'audio/ogg', 'audio/mp4'];
      let audioBlob: Blob | null = null;
      
      for (const mimeType of mimeTypes) {
        try {
          const testBlob = new Blob(audioChunks, { type: mimeType });
          if (testBlob.size > 0) {
            audioBlob = testBlob;
            console.log('Using MIME type:', mimeType, 'Size:', testBlob.size);
            break;
          }
        } catch (e) {
          console.log('MIME type not supported:', mimeType);
        }
      }
      
      if (!audioBlob || audioBlob.size === 0) {
        console.error('Failed to create audio blob');
        return;
      }
      
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('Created audio URL:', audioUrl);
      
      // Create and send the voice message
      addVoiceMessage(activeChat, audioUrl);
      
      // Reset audio chunks
      setAudioChunks([]);
    }
  }, [isRecording, audioChunks, activeChat, addVoiceMessage, setAudioChunks]);

  return {
    messages,
    sendMessage,
    activeChat,
    setActiveChat,
    chats,
    startRecording,
    stopRecording,
    isRecording,
    addImageMessage
  };
};
