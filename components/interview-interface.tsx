"use client";

import { useState, useEffect } from "react";
import { Timer } from "@/components/Timer";
import { QuestionDisplay } from "@/components/QuestionDisplay";
import { Button } from "@/components/ui/button";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useAnswers } from "@/contexts/AnswersContext";
import { QuestionReady } from "@/components/QuestionReady";
import { Card } from "@/components/ui/card";

interface QuizQuestion {
  id: number;
  title: string;
  questionText: string;
  instructions: string[];
  timeLimit: number;
}

type QuestionState = "ready" | "recording";

export function InterviewInterfaceComponent() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionState, setQuestionState] = useState<QuestionState>("ready");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { startRecording, stopRecording, audioURL } = useAudioRecorder(
    questions[currentQuestionIndex]?.id
  );
  const { addAnswer } = useAnswers();

  useEffect(() => {
    fetch("/quizData.json")
      .then((response) => response.json())
      .then((data) => setQuestions(data.questions))
      .catch((error) => console.error("Error fetching quiz data:", error));
  }, []);

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

  if (questions.length === 0)
    return (
      <div className="w-full flex flex-col items-center justify-center">
        Loading...
      </div>
    );

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen p-5 flex flex-col">
      {/* 
        <header className="flex justify-between items-center mb-5">
        <div className="text-lg font-medium text-[#1c3c1c]" aria-label="Progress">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <Timer 
          initialTime={currentQuestion.timeLimit} 
          timerKey={currentQuestion.id}
        />
      </header>
      
      */}

      <main className="flex-grow flex flex-col justify-center items-center space-y-5">
        <Card className="max-w-xl w-full p-1.5 ">
          {questionState === "ready" ? (
            <div>
              <div className="flex  w-full justify-between py-5 px-6 ">
                <div className="flex items-center gap-1 w-1/3">
                  <span className="text-sm ">Question</span>
                </div>

                <div className="tabular-nums text-sm text-center w-1/3">
                  {" "}
                  {currentQuestionIndex + 1} of {questions.length}
                </div>
                <div className="flex justify-end w-1/3">
                  <Timer
                    initialTime={currentQuestion.timeLimit}
                    timerKey={currentQuestion.id}
                  />
                </div>
              </div>
              <div className="relative  bg-foreground/15 rounded-full h-1 mx-6">
                <div
                  className="absolute bg-primary rounded-full h-1"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / questions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <QuestionReady
                onReady={handleReady}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
              />
            </div>
          ) : (
            <div>
              <div className="flex  w-full justify-between py-5 px-6 ">
                <div className="flex items-center gap-1 w-1/3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-xs font-medium tracking-wide uppercase ">
                    Recording
                  </span>
                </div>

                <div className="tabular-nums text-sm text-center w-1/3">
                  {" "}
                  {currentQuestionIndex + 1} of {questions.length}
                </div>
                <div className="flex justify-end w-1/3">
                  <Timer
                    initialTime={currentQuestion.timeLimit}
                    timerKey={currentQuestion.id}
                  />
                </div>
              </div>
              <div className="relative  bg-foreground/15 rounded-full h-1 mx-6">
                <div
                  className="absolute bg-primary rounded-full h-1"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / questions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
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
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
