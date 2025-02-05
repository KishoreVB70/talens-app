"use client";

import { useState, useEffect } from "react";
import { QuestionDisplay } from "@/components/interview/QuestionDisplay";
import { Button } from "@/components/ui/button";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useAnswers } from "@/contexts/AnswersContext";
import { Card } from "@/components/ui/card";
import QuestionsHeader from "@/components/interview/QuestionsHeader";
import { QuestionReady } from "@/components/interview/QuestionReady";
import { QuizQuestion } from "@/lib/types";

// Todo: Can change into enum
type QuestionState = "ready" | "recording";

export function InterviewInterfaceComponent() {
  // Context
  const { addAnswer } = useAnswers();

  // Question related state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionState, setQuestionState] = useState<QuestionState>("ready");

  // Hooks
  //Todo: What in the case if the question is undefined?
  const { startRecording, stopRecording, audioURL } = useAudioRecorder(
    questions[currentQuestionIndex]?.id
  );

  // Todo: remove submitting, only required to trigger useEffect
  // const [isSubmitting, setIsSubmitting] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // Data fetching
  useEffect(() => {
    fetch("/quizData.json")
      .then((response) => response.json())
      .then((data) => setQuestions(data.questions))
      .catch((error) => console.error("Error fetching quiz data:", error));
  }, []);

  // Todo: Analyze the requirement of useEFfect and Change useEffect to function
  // Handle submission
  // Add audio url to context and move to next question or move to summary page
  // useEffect(() => {
  //   // console.log("Submission effect triggered:", {
  //   //   isSubmitting,
  //   //   audioURL,
  //   //   currentQuestionIndex,
  //   //   questionId: questions[currentQuestionIndex]?.id,
  //   // });

  //   if (isSubmitting && audioURL) {
  //     // console.log("Adding answer to context:", {
  //     //   questionId: questions[currentQuestionIndex].id,
  //     //   audioUrl: audioURL,
  //     // });

  //     addAnswer({
  //       questionId: questions[currentQuestionIndex].id,
  //       audioUrl: audioURL,
  //       transcription: null,
  //     });

  //     if (currentQuestionIndex < questions.length - 1) {
  //       // console.log("Moving to next question");
  //       setCurrentQuestionIndex((prev) => prev + 1);
  //       setQuestionState("ready");
  //     } else {
  //       // console.log("Interview complete, redirecting to summary");
  //       // Todo: Use router for navigation?
  //       // Causes hard refresh on the page
  //       window.location.href = "/summary";
  //     }

  //     setIsSubmitting(false);
  //     setIsLoading(false);
  //   }
  // }, [isSubmitting, audioURL, currentQuestionIndex, questions, addAnswer]);

  function submitAnswer() {
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

  if (questions.length === 0)
    return (
      <div className="w-full flex flex-col items-center justify-center">
        Loading...
      </div>
    );

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen p-5 flex flex-col">
      <main className="flex-grow flex flex-col justify-center items-center space-y-5">
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
            <div>
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
                ) : (
                  "Submit Answer"
                )}
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
