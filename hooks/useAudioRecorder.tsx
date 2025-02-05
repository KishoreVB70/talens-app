import {
  useState,
  useRef,
  useCallback,
  useEffect,
  MutableRefObject,
} from "react";
import { useAnswers } from "@/contexts/AnswersContext";
import { uploadAudio } from "@/lib/api-utils";

// Todo: Provide upload control to interview page rather than on stop
export function useAudioRecorder(questionId: number) {
  const { interviewId } = useAnswers();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Todo: Can utilize single state for idle, recording and uploading
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const initiateUploadAudio = async (chunksRef: MutableRefObject<Blob[]>) => {
    console.log("Recording stopped, processing audio...");
    const audioBlob = new Blob(chunksRef.current, { type: "audio/mp3" });

    // Todo: assess requirement for this url
    const audioUrl = URL.createObjectURL(audioBlob);

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadAudio(
        audioBlob,
        questionId,
        interviewId!
      );
      console.log("Audio uploaded successfully:", uploadedUrl);
      setAudioURL(uploadedUrl);
    } catch (error) {
      console.error("Failed to upload audio:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const startRecording = useCallback(async () => {
    console.log("Starting recording for question:", questionId);
    try {
      // Clear previous recording data
      setAudioURL(null);
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Upload Audio to supabase onStop
      // Obtain the url in supabase and set it to audioURL
      // After the audioURL is set, control is returned back to the interview page
      // to render next question
      mediaRecorderRef.current.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log("Recording started successfully");
    } catch (error) {
      console.error("Error in startRecording:", error);
    }
  }, [questionId]);

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
    console.log("Audio state updated:", { isRecording, audioURL });
  }, [isRecording, audioURL]);

  return {
    isRecording,
    audioURL,
    isUploading,
    transcription: null,
    startRecording,
    stopRecording,
  };
}
