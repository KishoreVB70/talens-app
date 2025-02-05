import React from "react";
import { useRouter } from "next/navigation";
import { useAnswers } from "@/contexts/AnswersContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function StartInterview() {
  const { initializeInterview, userName } = useAnswers();
  const router = useRouter();

  const handleStartInterview = () => {
    initializeInterview();
    router.push("/interview");
  };
  return (
    <div className=" flex flex-col items-center p-5">
      <Card className="max-w-xl w-full p-1.5 space-y-10">
        <div className="flex flex-col  mx-6 mt-5">
          <h2 className="text-xl md:text-2xl tracking-tight font-semibold leading-tight md:leading-tight ">
            Welcome, {userName}!
          </h2>
          <p className="text-xl md:text-2xl tracking-tight opacity-50 leading-tight md:leading-tight">
            Please review the following instructions
            <br className="hidden md:block" /> before beginning your interview
          </p>
        </div>

        <div className="space-y-4 mx-6 border-t pt-5 border-foreground/15">
          <h3 className="text-xs font-semibold uppercase tracking-wide -mb-2">
            Interview Instructions
          </h3>
          <ul className="space-y-1">
            <li>• Read questions aloud before answering</li>
            <li>• Speak your thoughts aloud</li>
            <li>• No external help or AI tools allowed</li>
          </ul>
        </div>

        <Button onClick={handleStartInterview} className="w-full" size="lg">
          Start Interview
        </Button>
      </Card>
    </div>
  );
}

export default StartInterview;
