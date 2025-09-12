
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
    addVoiceMessage
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
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);
      
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
  };
};
