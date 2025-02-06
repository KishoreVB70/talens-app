import { useState, useEffect, useCallback } from "react";
import { QuestionDisplay } from "@/components/interview/QuestionDisplay";
import { Button } from "@/components/ui/button";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useAnswers } from "@/contexts/AnswersContext";
import { QuestionReady } from "@/components/interview/QuestionReady";
import { Card } from "@/components/ui/card";
import { QuestionState, QuizQuestion } from "@/lib/types";
import QuestionsHeader from "@/components/interview/QuestionHeader";
import useUploadRecordedAudio from "@/hooks/useUploadRecordedAudio";

type InterviewCardProps = {
  questions: QuizQuestion[];
};

export default function InterviewCard({ questions }: InterviewCardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questions[currentQuestionIndex];

  // Hooks
  const { addAnswer } = useAnswers();
  const { startRecording, stopRecording, chunksRef } = useAudioRecorder();

  // Info: Currently questions[index] can't be undefined
  const { audioURL, uploadRecordedAudio } = useUploadRecordedAudio(
    chunksRef,
    questions[currentQuestionIndex]?.id
  );

  // State
  const [questionState, setQuestionState] = useState<QuestionState>("ready");
  const [isLoading, setIsLoading] = useState(false);

  const handleReady = async () => {
    console.log("Question ready, starting recording");
    await startRecording();
    setQuestionState("recording");
  };

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    stopRecording();

    // 1) Upload audio to supabase db
    try {
      await uploadRecordedAudio();
    } catch (error) {
      console.error("Failed to upload audio", error);
      setIsLoading(false);
    }

    // 2) Add answer to context
    if (!audioURL) return;
    // Doesn't return an error
    addAnswer({
      questionId: questions[currentQuestionIndex].id,
      audioUrl: audioURL,
      transcription: null,
    });

    // 3) Move to next question or summary page
    if (currentQuestionIndex < questions.length - 1) {
      // console.log("Moving to next question");
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionState("ready");
    } else {
      // console.log("Interview complete, redirecting to summary");
      // Todo: Use router for navigation?
      // Causes hard refresh on the page
      window.location.href = "/summary";
    }
    setIsLoading(false);
  }, [
    addAnswer,
    audioURL,
    currentQuestionIndex,
    questions,
    stopRecording,
    uploadRecordedAudio,
  ]);

  if (questions.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Card className="max-w-xl w-full p-1.5 ">
      <QuestionsHeader
        questionIndex={currentQuestionIndex}
        questionsLength={questions.length}
        questionTimeLimit={currentQuestion.timeLimit}
        questionId={currentQuestion.id}
        isRecording={questionState === "recording"}
      />
      {questionState === "ready" ? (
        <QuestionReady onReady={handleReady} />
      ) : (
        <>
          <QuestionDisplay
            questionNumber={currentQuestionIndex + 1}
            questionTitle={currentQuestion.title}
            questionText={currentQuestion.questionText}
            instructions={currentQuestion.instructions}
          />

          <Button
            onClick={handleSubmit}
            className="w-full "
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#1c3c1c] border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              "Submit Answer"
            )}
          </Button>
        </>
      )}
    </Card>
  );
}
