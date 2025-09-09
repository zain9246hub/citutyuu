
import { useState, useEffect, useCallback } from "react";

export const useRecording = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  // Initialize media recorder
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const initMediaRecorder = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        
        recorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0) {
            setAudioChunks((prev) => [...prev, event.data]);
          }
        });

        setMediaRecorder(recorder);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    initMediaRecorder();

    return () => {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
      // Clean up any active media streams
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Function to start recording
  const startRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== "recording") {
      setAudioChunks([]);
      mediaRecorder.start();
      setIsRecording(true);
    }
  }, [mediaRecorder]);

  // Function to stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  }, [mediaRecorder]);

  return {
    isRecording,
    audioChunks,
    startRecording,
    stopRecording,
    setAudioChunks
  };
};
