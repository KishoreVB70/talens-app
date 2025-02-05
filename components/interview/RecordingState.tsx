// import React from "react";
// import { useState, useEffect } from "react";
// import { QuestionDisplay } from "@/components/QuestionDisplay";
// import { Button } from "@/components/ui/button";
// import { useAudioRecorder } from "@/hooks/useAudioRecorder";
// import { useAnswers } from "@/contexts/AnswersContext";
// import QuestionsHeader from "@/components/interview/QuestionsHeader";
// import { QuizQuestion } from "@/lib/types";

// type RecordingStateProps = {
//   questionsLength: number;
//   currentQuestion: QuizQuestion;
// };
// function RecordingState() {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { startRecording, stopRecording, audioURL } = useAudioRecorder(
//     questions[currentQuestionIndex]?.id
//   );
//   const { addAnswer } = useAnswers();
//   // Handle submission
//   useEffect(() => {
//     console.log("Submission effect triggered:", {
//       isSubmitting,
//       audioURL,
//       currentQuestionIndex,
//       questionId: questions[currentQuestionIndex]?.id,
//     });

//     if (isSubmitting && audioURL) {
//       console.log("Adding answer to context:", {
//         questionId: questions[currentQuestionIndex].id,
//         audioUrl: audioURL,
//       });

//       addAnswer({
//         questionId: questions[currentQuestionIndex].id,
//         audioUrl: audioURL,
//         transcription: null,
//       });

//       if (currentQuestionIndex < questions.length - 1) {
//         console.log("Moving to next question");
//         setCurrentQuestionIndex((prev) => prev + 1);
//         setQuestionState("ready");
//       } else {
//         console.log("Interview complete, redirecting to summary");
//         window.location.href = "/summary";
//       }

//       setIsSubmitting(false);
//       setIsLoading(false);
//     }
//   }, [isSubmitting, audioURL, currentQuestionIndex, questions, addAnswer]);

//   const handleSubmit = () => {
//     console.log("Submitting answer");
//     setIsLoading(true);
//     setIsSubmitting(true);
//     stopRecording();
//   };
//   return (
//     <div>
//       {/* Display question, question number and timer */}
//       <QuestionsHeader
//         questionIndex={currentQuestionIndex}
//         questionsLength={questions.length}
//         questionTimeLimit={currentQuestion.timeLimit}
//         questionId={currentQuestion.id}
//         isRecording={true}
//       />
//       <QuestionDisplay
//         questionNumber={currentQuestionIndex + 1}
//         questionTitle={currentQuestion.title}
//         questionText={currentQuestion.questionText}
//         instructions={currentQuestion.instructions}
//       />

//       {/* Submit Button */}
//       <Button
//         onClick={handleSubmit}
//         className="w-full "
//         size="lg"
//         disabled={isLoading}
//       >
//         {isLoading ? (
//           <div className="flex items-center justify-center gap-2">
//             <div className="w-4 h-4 border-2 border-[#1c3c1c] border-t-transparent rounded-full animate-spin" />
//             <span>Processing...</span>
//           </div>
//         ) : (
//           "Submit Answer"
//         )}
//       </Button>
//     </div>
//   );
// }

// export default RecordingState;
