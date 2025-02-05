"use client";

import { useState } from "react";
import AuthPage from "@/components/AuthPage";
import { StartingStep } from "@/lib/types";
import StartInterview from "@/components/StartInterview";

export default function StartingScreen() {
  const [step, setStep] = useState<StartingStep>("auth");

  if (step === "auth") return <AuthPage setStep={setStep} />;

  return <StartInterview />;
}
