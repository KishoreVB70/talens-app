import React from "react";
import { useState } from "react";
import { useAnswers } from "@/contexts/AnswersContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { VALID_ACCESS_CODE } from "@/lib/contants";
import { StartingStep } from "@/lib/types";

type AuthPageProps = {
  setStep: (step: StartingStep) => void;
};

function AuthPage({ setStep }: AuthPageProps) {
  const { setUserName } = useAnswers();
  const [error, setError] = useState("");

  const nameRef = React.useRef<HTMLInputElement>(null);
  const accessCodeRef = React.useRef<HTMLInputElement>(null);

  const handleSubmitAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const name = nameRef.current?.value;
    const accessCode = accessCodeRef.current?.value;

    if (!name || !name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!accessCode || accessCode !== VALID_ACCESS_CODE) {
      setError("Invalid access code");
      return;
    }

    setUserName(name);
    setStep("instructions");
  };

  return (
    <div className="flex flex-col items-center p-5">
      <Card className="max-w-xl w-full p-1.5 space-y-10">
        <div className="flex flex-col  mx-6 mt-5">
          <h2 className="text-xl md:text-2xl tracking-tight font-semibold leading-tight md:leading-tight">
            Welcome to Your Interview
          </h2>
          <p className="text-xl md:text-2xl tracking-tight opacity-50 leading-tight md:leading-tight">
            To get started, please enter your name{" "}
            <br className="hidden md:block" /> and access code to continue
          </p>
        </div>

        <form onSubmit={handleSubmitAuth} className="space-y-4">
          <div className="px-6 pb-10 space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#1c3c1c] mb-1"
              >
                Your Name
              </label>
              <Input
                id="name"
                type="text"
                ref={nameRef}
                placeholder="Enter your full name"
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="accessCode"
                className="block text-sm font-medium text-[#1c3c1c] mb-1"
              >
                Access Code
              </label>
              <Input
                id="accessCode"
                type="text"
                ref={accessCodeRef}
                placeholder="Enter access code"
                className="w-full"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <Button type="submit" className="w-full" size="lg">
            Continue
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default AuthPage;
