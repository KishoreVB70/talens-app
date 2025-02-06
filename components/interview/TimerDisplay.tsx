import React from "react";

function TimerDisplay({ time }: { time: number }) {
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

export default TimerDisplay;
