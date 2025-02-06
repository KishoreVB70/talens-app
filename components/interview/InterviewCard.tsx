import { useState, useEffect } from "react";
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
  const [questionState, setQuestionState] = useState<QuestionState>("ready");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { addAnswer } = useAnswers();
  const { startRecording, stopRecording, chunksRef } = useAudioRecorder();

  // Info: Currently questions[index] can't be undefined
  const { audioURL } = useUploadRecordedAudio(
    chunksRef,
    questions[currentQuestionIndex]?.id
  );

  // New useEffect to handle submission
  useEffect(() => {
    console.log("Submission effect triggered:", {
      isSubmitting,
      audioURL,
      currentQuestionIndex,
      questionId: questions[currentQuestionIndex]?.id,
    });

    if (isSubmitting && audioURL) {
      console.log("Adding answer to context:", {
        questionId: questions[currentQuestionIndex].id,
        audioUrl: audioURL,
      });

      addAnswer({
        questionId: questions[currentQuestionIndex].id,
        audioUrl: audioURL,
        transcription: null,
      });

      if (currentQuestionIndex < questions.length - 1) {
        console.log("Moving to next question");
        setCurrentQuestionIndex((prev) => prev + 1);
        setQuestionState("ready");
      } else {
        console.log("Interview complete, redirecting to summary");
        window.location.href = "/summary";
      }

      setIsSubmitting(false);
      setIsLoading(false);
    }
  }, [isSubmitting, audioURL, currentQuestionIndex, questions, addAnswer]);

  const handleReady = async () => {
    console.log("Question ready, starting recording");
    await startRecording();
    setQuestionState("recording");
  };

  const handleSubmit = () => {
    console.log("Submitting answer");
    setIsLoading(true);
    setIsSubmitting(true);
    stopRecording();
  };

  if (questions.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        Loading...
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

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
