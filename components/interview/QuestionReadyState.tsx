import { QuestionReady } from "@/components/interview/QuestionReady";
import { Timer } from "@/components/Timer";
import React from "react";

type QuestionReadyStateProps = {
  questionIndex: number;
  questionId: number;
  questionTimeLimit: number;
  questionsLength: number;
  handleReady: () => void;
};

function QuestionReadyState({
  questionIndex,
  questionsLength,
  questionTimeLimit,
  questionId,
  handleReady,
}: QuestionReadyStateProps) {
  return (
    <>
      {/* Display question, question number and timer */}
      <div className="flex  w-full justify-between py-5 px-6 ">
        <div className="flex items-center gap-1 w-1/3">
          <span className="text-sm ">Question</span>
        </div>

        <div className="tabular-nums text-sm text-center w-1/3">
          {questionIndex + 1} of {questionsLength}
        </div>

        <div className="flex justify-end w-1/3">
          <Timer initialTime={questionTimeLimit} timerKey={questionId} />
        </div>
      </div>

      {/* Progress bar*/}
      <div className="relative  bg-foreground/15 rounded-full h-1 mx-6">
        <div
          className="absolute bg-primary rounded-full h-1"
          style={{
            width: `${((questionIndex + 1) / questionsLength) * 100}%`,
          }}
        ></div>
      </div>

      {/* Question display */}
      <QuestionReady
        onReady={handleReady}
        questionNumber={questionIndex + 1}
        totalQuestions={questionsLength}
      />
    </>
  );
}

export default QuestionReadyState;
