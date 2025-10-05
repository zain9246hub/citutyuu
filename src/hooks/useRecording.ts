
import { useState, useEffect, useCallback } from "react";

export const useRecording = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);

  // Initialize media recorder
  useEffect(() => {
    let stream: MediaStream | null = null;
    let recorder: MediaRecorder | null = null;
    
    const initMediaRecorder = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        
        // Try to find the best supported MIME type
        const mimeTypes = [
          'audio/webm;codecs=opus',
          'audio/webm',
          'audio/ogg;codecs=opus',
          'audio/mp4'
        ];
        
        let selectedMimeType = '';
        for (const mimeType of mimeTypes) {
          if (MediaRecorder.isTypeSupported(mimeType)) {
            selectedMimeType = mimeType;
            console.log('Using MIME type for recording:', mimeType);
            break;
          }
        }
        
        recorder = new MediaRecorder(stream, {
          mimeType: selectedMimeType || undefined
        });
        
        recorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0) {
            console.log('Audio chunk received:', event.data.size, 'bytes');
            setAudioChunks((prev) => [...prev, event.data]);
          }
        });
        
        recorder.addEventListener("start", () => {
          console.log('Recording started');
        });
        
        recorder.addEventListener("stop", () => {
          console.log('Recording stopped');
        });

        setMediaRecorder(recorder);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    initMediaRecorder();

    return () => {
      // Use local recorder variable instead of state
      if (recorder && recorder.state === "recording") {
        recorder.stop();
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
      setRecordingTime(0);
      mediaRecorder.start(100); // Collect data every 100ms for smoother recording
      setIsRecording(true);
      
      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          // Auto-stop at 60 seconds
          if (newTime >= 60) {
            if (mediaRecorder && mediaRecorder.state === "recording") {
              mediaRecorder.stop();
              setIsRecording(false);
            }
            return 60;
          }
          return newTime;
        });
      }, 1000);
      
      setRecordingTimer(timer);
    }
  }, [mediaRecorder]);

  // Function to stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
      
      // Clear timer
      if (recordingTimer) {
        clearInterval(recordingTimer);
        setRecordingTimer(null);
      }
      setRecordingTime(0);
    }
  }, [mediaRecorder, recordingTimer]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimer) {
        clearInterval(recordingTimer);
      }
    };
  }, [recordingTimer]);

  return {
    isRecording,
    audioChunks,
    startRecording,
    stopRecording,
    setAudioChunks,
    recordingTime
  };
};
