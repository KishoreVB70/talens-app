import { useState, useRef, useCallback, useEffect } from "react";

export function useAudioRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      // Clear previous recording data
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log("Recording started successfully");
    } catch (error) {
      console.error("Error in startRecording:", error);
    }
  };

  // Stop the MediaRecorder and set isRecording to false
  const stopRecording = useCallback(() => {
    console.log("Stopping recording");
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("Recording stopped successfully");
    } else {
      console.log("No active recording to stop");
    }
  }, [isRecording]);

  // Log state changes
  useEffect(() => {
    console.log("Audio state updated:", { isRecording });
  }, [isRecording]);

  return {
    chunksRef,
    startRecording,
    stopRecording,
  };
}
