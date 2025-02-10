import { useCallback, useState } from "react";
import { QuestionDisplay } from "@/components/interview/QuestionDisplay";
import { Button } from "@/components/ui/button";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { QuestionReady } from "@/components/interview/QuestionReady";
import { Card } from "@/components/ui/card";
import { QuestionState, QuizQuestion } from "@/lib/types";
import QuestionsHeader from "@/components/interview/QuestionHeader";

type InterviewCardProps = {
  questions: QuizQuestion[];
};

export default function InterviewCard({ questions }: InterviewCardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questions[currentQuestionIndex];

  const handleNextQuestion = useCallback(() => {
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
  }, [currentQuestionIndex, questions.length]);

  // Hooks
  const { startRecording, stopRecording, isUploading, isUploadError } =
    useAudioRecorder(
      currentQuestionIndex,
      currentQuestion.id,
      handleNextQuestion
    );

  // State
  const [questionState, setQuestionState] = useState<QuestionState>("ready");
  const submitButtonText = isUploadError
    ? "Answer upload failed: Retry"
    : "Submit Answer";

  const handleReady = async () => {
    await startRecording();
    setQuestionState("recording");
  };

  return (
    <Card className="max-w-xl w-full p-1.5 ">
      <QuestionsHeader
        questionIndex={currentQuestionIndex}
        questionsLength={questions.length}
        questionTimeLimit={currentQuestion.timeLimit}
        questionId={currentQuestion.id}
        isRecording={questionState === "recording"}
        stopRecording={stopRecording}
      />
      {questionState === "ready" ? (
        <QuestionReady onReady={handleReady} />
      ) : (
        <>
          <QuestionDisplay question={currentQuestion} />

          <Button
            onClick={stopRecording}
            className="w-full "
            size="lg"
            disabled={isUploading}
          >
            {isUploading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#1c3c1c] border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              submitButtonText
            )}
          </Button>
        </>
      )}
    </Card>
  );
}
