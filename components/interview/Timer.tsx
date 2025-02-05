import { useState, useEffect } from "react";

interface TimerProps {
  initialTime: number;
  timerKey: number;
}

export function Timer({ initialTime, timerKey }: TimerProps) {
  const [time, setTime] = useState(initialTime);

  // Todo: When timer hits 0, auto submit the answer and proceed to next question
  useEffect(() => {
    setTime(initialTime); // Reset the timer when initialTime changes
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialTime, timerKey]); // Add timerKey to dependencies to restart the timer on question change

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
