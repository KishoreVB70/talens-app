"use client";

import { useState } from "react";
import AuthPage from "@/components/AuthPage";
import { Step } from "@/lib/types";
import StartInterview from "@/components/StartInterview";

export default function StartingScreen() {
  const [step, setStep] = useState<Step>("auth");
  const [name, setName] = useState("");

  if (step === "auth") return <AuthPage setStep={setStep} setName={setName} />;

  return <StartInterview name={name} />;
}
