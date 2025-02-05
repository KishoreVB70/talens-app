import { useState } from "react";
import { QuestionDisplay } from "@/components/interview/QuestionDisplay";
import { Button } from "@/components/ui/button";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useAnswers } from "@/contexts/AnswersContext";
import { Card } from "@/components/ui/card";
import QuestionsHeader from "@/components/interview/QuestionsHeader";
import { QuestionReady } from "@/components/interview/QuestionReady";
import { QuestionState, QuizQuestion } from "@/lib/types";
import useUploadRecordedAudio from "@/hooks/useUploadRecordedAudio";

type InterviewCardProps = {
  questions: QuizQuestion[];
};
// Todo: Can change into enum
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
  const [isUploadError, setIsUploadError] = useState(false);

  const handleReady = async () => {
    await startRecording();
    setQuestionState("recording");
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    stopRecording();

    // 1) Upload audio to supabase db
    try {
      await uploadRecordedAudio();
    } catch (error) {
      console.error("Failed to upload audio", error);
      setIsLoading(false);
      setIsUploadError(true);
    }

    // 2) Add answer to context
    if (!audioURL) return;
    // Info: Doesn't return an error
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
  };

  return (
    <Card className="max-w-xl w-full p-1.5 ">
      {/* Header with question number, time limit, and recording status */}
      <QuestionsHeader
        questionIndex={currentQuestionIndex}
        questionsLength={questions.length}
        questionTimeLimit={currentQuestion.timeLimit}
        questionId={currentQuestion.id}
        isRecording={questionState === "recording"}
      />
      {questionState === "ready" ? (
        <QuestionReady
          onReady={handleReady}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />
      ) : (
        // Recording state
        <>
          <QuestionDisplay
            questionNumber={currentQuestionIndex + 1}
            questionTitle={currentQuestion.title}
            questionText={currentQuestion.questionText}
            instructions={currentQuestion.instructions}
          />

          {/* Submit Button */}
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
            ) : isUploadError ? (
              "Retry"
            ) : (
              "Submit Answer"
            )}
          </Button>
        </>
      )}
    </Card>
  );
}
