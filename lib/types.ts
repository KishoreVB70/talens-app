// Todo: can change into enum
export type StartingStep = "auth" | "instructions";
export type QuestionState = "ready" | "recording";

export interface QuizQuestion {
  id: number;
  title: string;
  questionText: string;
  instructions: string[];
  timeLimit: number;
}
