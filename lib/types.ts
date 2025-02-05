export type StartingStep = "auth" | "instructions";
export interface QuizQuestion {
  id: number;
  title: string;
  questionText: string;
  instructions: string[];
  timeLimit: number;
}
export type QuestionState = "ready" | "recording";
