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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center">
      <div
        className="tabular-nums text-sm"
        aria-live="polite"
        aria-label="Timer"
      >
        {formatTime(time)}
      </div>
    </div>
  );
}
