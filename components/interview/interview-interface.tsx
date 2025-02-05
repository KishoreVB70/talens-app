"use client";

import { useState, useEffect } from "react";
import { QuizQuestion } from "@/lib/types";
import InterviewCard from "@/components/interview/InterviewCard";

export function InterviewInterfaceComponent() {
  // Question related state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // Data fetching
  useEffect(() => {
    fetch("/quizData.json")
      .then((response) => response.json())
      .then((data) => setQuestions(data.questions))
      .catch((error) => console.error("Error fetching quiz data:", error));
  }, []);

  if (questions.length === 0)
    return (
      <div className="w-full flex flex-col items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen p-5 flex flex-col">
      <main className="flex-grow flex flex-col justify-center items-center space-y-5">
        <InterviewCard questions={questions} />
      </main>
    </div>
  );
}
