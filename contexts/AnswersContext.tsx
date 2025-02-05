"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import quizData from "@/public/quizData.json";

interface Answer {
  questionId: number;
  audioUrl: string;
  transcription: string | null;
  questionData?: any;
}

interface AnswersContextType {
  answers: Answer[];
  interviewId: string | null;
  userName: string | null;
  addAnswer: (answer: Answer) => void;
  clearAnswers: () => void;
  initializeInterview: () => Promise<string>;
  setUserName: (name: string) => void;
}

const AnswersContext = createContext<AnswersContextType | undefined>(undefined);

export function AnswersProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // Obtain stored answers and interviewId from sessionStorage
  useEffect(() => {
    const storedAnswers = sessionStorage.getItem("interviewAnswers");
    const storedInterviewId = sessionStorage.getItem("interviewId");
    const storedUserName = sessionStorage.getItem("userName");

    if (storedAnswers) setAnswers(JSON.parse(storedAnswers));
    if (storedInterviewId) setInterviewId(storedInterviewId);
    if (storedUserName) setUserName(storedUserName);
  }, []);

  const handleSetUserName = (name: string) => {
    setUserName(name);
    sessionStorage.setItem("userName", name);
  };

  const initializeInterview = async () => {
    const newInterviewId = crypto.randomUUID();
    setInterviewId(newInterviewId);
    sessionStorage.setItem("interviewId", newInterviewId);

    const { error } = await supabase.from("interviews").insert({
      id: newInterviewId,
      user_name: userName,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error creating interview:", error);
      throw error;
    }

    return newInterviewId;
  };

  const addAnswer = (answer: Answer) => {
    const questionData = quizData.questions.find(
      (q) => q.id === answer.questionId
    );

    const answerWithQuestionData = {
      ...answer,
      questionData,
    };

    console.log("Adding answer to context:", answerWithQuestionData);
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers, answerWithQuestionData];
      console.log("Updated answers:", newAnswers);
      sessionStorage.setItem("interviewAnswers", JSON.stringify(newAnswers));
      return newAnswers;
    });

    if (interviewId) {
      supabase
        .from("answers")
        .insert({
          interview_id: interviewId,
          question_id: answer.questionId,
          audio_url: answer.audioUrl,
          transcription: answer.transcription,
          question_data: questionData,
        })
        .then(({ error }) => {
          if (error) console.error("Error saving answer:", error);
        });
    }
  };

  const clearAnswers = () => {
    setAnswers([]);
    setInterviewId(null);
    sessionStorage.removeItem("interviewAnswers");
    sessionStorage.removeItem("interviewId");
  };

  return (
    <AnswersContext.Provider
      value={{
        answers,
        interviewId,
        userName,
        addAnswer,
        clearAnswers,
        initializeInterview,
        setUserName: handleSetUserName,
      }}
    >
      {children}
    </AnswersContext.Provider>
  );
}

export function useAnswers() {
  const context = useContext(AnswersContext);
  if (context === undefined) {
    throw new Error("useAnswers must be used within an AnswersProvider");
  }
  return context;
}
