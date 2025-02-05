import { Button } from "@/components/ui/button";
import { Mic, Speech, CheckSquare } from "lucide-react";

interface QuestionReadyProps {
  onReady: () => void;
}

export function QuestionReady({ onReady }: QuestionReadyProps) {
  return (
    <div className=" w-full space-y-8">
      <div className="flex flex-col  mx-6 mt-5">
        <h3 className="text-xl md:text-2xl tracking-tight font-semibold leading-tight md:leading-tight">
          Before you begin
        </h3>
        <p className="text-xl md:text-2xl tracking-tight opacity-50 leading-tight md:leading-tight">
          note that there is a time limit for each question
          <br className="hidden md:block" /> and review the following
          instructions
        </p>
        <ul className="space-y-4 text-[#1c3c1c] my-6">
          <li className="flex items-center">
            <span className="bg-foreground/15 p-3.5 rounded-full inline-flex  mr-3">
              <Mic className=" text-[#1c3c1c] flex-shrink-0" size={24} />
            </span>
            <span className="text-md">Recording will start automatically</span>
          </li>
          <li className="flex items-center">
            <span className="bg-foreground/15 p-3.5 rounded-full inline-flex  mr-3">
              <Speech className=" text-[#1c3c1c] flex-shrink-0" size={24} />
            </span>
            <span className="text-md">Read the question out loud</span>
          </li>
          <li className="flex items-center">
            <span className="bg-foreground/15 p-3.5 rounded-full inline-flex  mr-3">
              <CheckSquare
                className=" text-[#1c3c1c] flex-shrink-0"
                size={24}
              />
            </span>
            <span className="text-md">Click "Submit" when you're done</span>
          </li>
        </ul>
      </div>
      <Button onClick={onReady} className="w-full" size="lg">
        I'm Ready
      </Button>
    </div>
  );
}
