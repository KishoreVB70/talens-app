import { useState } from "react";
import { QuestionDisplay } from "@/components/interview/QuestionDisplay";
import { Button } from "@/components/ui/button";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useAnswers } from "@/contexts/AnswersContext";
import { Card } from "@/components/ui/card";
import QuestionsHeader from "@/components/interview/QuestionsHeader";
import { QuestionReady } from "@/components/interview/QuestionReady";
import { QuizQuestion } from "@/lib/types";
import useUploadRecordedAudio from "@/hooks/useUploadRecordedAudio";
type QuestionState = "ready" | "recording";

type InterviewCardProps = {
  questions: QuizQuestion[];
};
// Todo: Can change into enum
export default function InterviewCard({ questions }: InterviewCardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questions[currentQuestionIndex];

  // Context
  const { addAnswer } = useAnswers();
  // Hooks
  const [questionState, setQuestionState] = useState<QuestionState>("ready");

  const { startRecording, stopRecording, chunksRef } = useAudioRecorder();

  //Todo: analyze the case if the question or audioURL is undefined?
  const { audioURL, initiateUploadAudio } = useUploadRecordedAudio(
    chunksRef,
    questions[currentQuestionIndex]?.id
  );

  // Todo: remove submitting, only required to trigger useEffect
  // const [isSubmitting, setIsSubmitting] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isUploadError, setIsUploadError] = useState(false);

  async function submitAnswer() {
    // 1) Upload audio to supabase db
    try {
      await initiateUploadAudio();
    } catch (error) {
      console.error("Failed to upload audio", error);
      setIsLoading(false);
      setIsUploadError(true);
    }

    if (!audioURL) return;
    console.log("Adding answer to context:");

    addAnswer({
      questionId: questions[currentQuestionIndex].id,
      audioUrl: audioURL,
      transcription: null,
    });

    // Move to next question or summary page
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
  }

  const handleReady = async () => {
    // console.log("Question ready, starting recording");
    await startRecording();
    setQuestionState("recording");
  };

  const handleSubmit = () => {
    // console.log("Submitting answer");
    setIsLoading(true);
    stopRecording();
    submitAnswer();
  };

  return (
    <Card className="max-w-xl w-full p-1.5 ">
      {questionState === "ready" ? (
        <>
          <QuestionsHeader
            questionIndex={currentQuestionIndex}
            questionsLength={questions.length}
            questionTimeLimit={currentQuestion.timeLimit}
            questionId={currentQuestion.id}
            isRecording={false}
          />
          {/* Preparation prompt */}
          <QuestionReady
            onReady={handleReady}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        </>
      ) : (
        // Recording state
        <>
          {/* Display question, question number and timer */}
          <QuestionsHeader
            questionIndex={currentQuestionIndex}
            questionsLength={questions.length}
            questionTimeLimit={currentQuestion.timeLimit}
            questionId={currentQuestion.id}
            isRecording={true}
          />
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
