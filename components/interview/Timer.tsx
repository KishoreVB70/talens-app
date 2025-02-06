import TimerDisplay from "@/components/interview/TimerDisplay";
import { useState, useEffect } from "react";

interface TimerProps {
  initialTime: number;
  timerKey: number;
  handleSubmit: () => void;
}

export function Timer({ initialTime, timerKey, handleSubmit }: TimerProps) {
  const [time, setTime] = useState(initialTime);
  const [isComplete, setIsCompleted] = useState(false);

  useEffect(() => {
    if (time <= 0) {
      setIsCompleted(true);
      return;
    }

    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]); // Add timerKey to dependencies to restart the timer on question change

  useEffect(() => {
    setTime(initialTime);
  }, [timerKey, initialTime]);

  // use effect to handle submit once timer is complete
  useEffect(() => {
    if (isComplete) {
      handleSubmit();
      // Prevent further calling of handleSubmit on rerender
      setIsCompleted(false);
    }
  }, [isComplete, handleSubmit]);

  return <TimerDisplay time={time} />;
}
