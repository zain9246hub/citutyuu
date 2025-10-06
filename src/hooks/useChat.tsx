
import { useEffect, useRef } from "react";
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
  // iOS Safari detection and duplicate-guard for recordings
  const isSafari = typeof navigator !== 'undefined' && /safari/i.test(navigator.userAgent) && !/chrome|android/i.test(navigator.userAgent);
  const lastProcessedSigRef = useRef<string | null>(null);

  // Auto-switch to selected city chat when city changes
  useEffect(() => {
    if (selectedCity && chats.includes(selectedCity) && activeChat !== selectedCity) {
      setActiveChat(selectedCity);
    }
  }, [selectedCity, chats, activeChat, setActiveChat]);

  // Listen for audioChunks changes to create and send voice message
  useEffect(() => {
    if (!isRecording && audioChunks.length > 0 && activeChat) {
      // Build a signature to avoid StrictMode double-execution duplicates
      const totalSize = audioChunks.reduce((acc: number, part: any) => acc + (part?.size || 0), 0);
      const signature = `${audioChunks.length}-${totalSize}`;
      if (lastProcessedSigRef.current === signature) {
        console.log('Skipping duplicate audio processing for signature:', signature);
        return;
      }
      lastProcessedSigRef.current = signature;

      console.log('Creating audio from chunks:', audioChunks.length, 'chunks');

      // Prefer the recorder-provided type; pick a safe default per browser if missing
      let recordedMimeType: string | undefined = (audioChunks[0] as any)?.type;
      if (!recordedMimeType || recordedMimeType === '') {
        recordedMimeType = isSafari ? 'audio/mp4' : 'audio/webm;codecs=opus';
      }
      // If Safari can't play webm, fallback to mp4
      if (isSafari && recordedMimeType.includes('webm')) {
        recordedMimeType = 'audio/mp4';
      }
      console.log('Selected MIME type for blob:', recordedMimeType);

      const audioBlob = new Blob(audioChunks, { type: recordedMimeType });
      console.log('Audio blob created:', { size: audioBlob.size, type: audioBlob.type });

      if (audioBlob.size === 0) {
        console.error('Audio blob is empty!');
        setAudioChunks([]);
        return;
      }

      // Convert blob to base64 (persists in localStorage across reloads)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result as string;
        console.log('Audio converted to base64 (prefix):', base64Audio.slice(0, 40));
        addVoiceMessage(activeChat, base64Audio);
        // Clear chunks after successful enqueue
        setAudioChunks([]);
      };
      reader.onerror = (error) => {
        console.error('Error converting audio to base64:', error);
        setAudioChunks([]);
      };
      reader.readAsDataURL(audioBlob);
    }
  }, [isRecording, audioChunks, activeChat, addVoiceMessage, setAudioChunks, isSafari]);

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
