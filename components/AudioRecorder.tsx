import { Button } from "@/components/ui/button";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useAnswers } from "@/contexts/AnswersContext";
import { useState, useEffect } from "react";

export function AudioRecorder({ questionId }: { questionId: number }) {
  const { isRecording, audioURL, isUploading, startRecording, stopRecording } =
    useAudioRecorder(questionId);
  const { addAnswer } = useAnswers();
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);

  const handleStartRecording = async () => {
    setActiveQuestionId(questionId);
    await startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  useEffect(() => {
    if (!isRecording && audioURL && activeQuestionId !== null) {
      addAnswer({
        questionId: activeQuestionId,
        audioUrl: audioURL,
        transcription: null,
        questionData: null,
      });
      setActiveQuestionId(null);
    }
  }, [isRecording, audioURL, activeQuestionId, addAnswer]);

  return (
    <div className="mt-4">
      <Button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        className={
          isRecording
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        }
        disabled={isUploading}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      {isUploading && (
        <div className="text-sm text-gray-600">
          <span className="animate-pulse">Uploading audio...</span>
        </div>
      )}
      {audioURL && !isUploading && <audio src={audioURL} controls />}
    </div>
  );
}
