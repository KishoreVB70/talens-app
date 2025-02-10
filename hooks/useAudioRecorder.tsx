import { useAnswers } from "@/contexts/AnswersContext";
import { uploadAudio } from "@/lib/api-utils";
import { useState, useRef, useCallback, useEffect } from "react";

export function useAudioRecorder(
  currentQuestionIndex: number,
  questionId: number,
  handleNextQuestion: () => void
) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { addAnswer, interviewId } = useAnswers();

  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadError, setIsUploadError] = useState(false);

  const onStopRecording = useCallback(async () => {
    try {
      const audioBlob = new Blob(chunksRef.current, {
        type: "audio/mp3",
      });

      // Upload audio to db
      // Todo: check interview id could be null
      const audioUrl = await uploadAudio(audioBlob, questionId, interviewId!);

      // Add answer to context
      addAnswer({
        questionId,
        audioUrl,
        transcription: null,
      });
      handleNextQuestion();
    } catch (error) {
      console.error("Failed to upload audio", error);
      setIsUploadError(true);
    } finally {
      setIsUploading(false);
    }
  }, [addAnswer, handleNextQuestion, interviewId, questionId]);

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
        await onStopRecording();
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log("Recording started successfully");
    } catch (error) {
      console.error("Error in startRecording:", error);
    }
  };

  const stopRecording = useCallback(() => {
    setIsUploading(true);

    // If User has recorded audio: Stop recording and upload audio
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("Recording stopped successfully");
    }
    // User retry on upload error
    else if (isUploadError) {
      onStopRecording();
    }
    // If user hasn't recorded audio: Move on to next question
    else {
      console.log("No active recording to stop");
      setIsUploading(false);
      handleNextQuestion();
    }
  }, [isRecording, handleNextQuestion, isUploadError, onStopRecording]);

  // Log state changes
  useEffect(() => {
    console.log("Audio state updated:", { isRecording });
  }, [isRecording]);

  return {
    chunksRef,
    startRecording,
    stopRecording,
    isUploading,
    isUploadError,
  };
}
