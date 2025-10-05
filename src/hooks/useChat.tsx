
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
      
      // Use the first chunk's type as it contains the correct MIME type from MediaRecorder
      const mimeType = audioChunks[0]?.type || 'audio/webm';
      console.log('Using MIME type:', mimeType);
      
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      console.log('Audio blob created:', audioBlob.size, 'bytes, type:', audioBlob.type);
      
      if (audioBlob.size === 0) {
        console.error('Audio blob is empty!');
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
    addImageMessage,
    recordingTime
  };
};
