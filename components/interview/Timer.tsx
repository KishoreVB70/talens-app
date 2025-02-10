import { useState, useEffect, useRef } from "react";

interface TimerProps {
  initialTime: number;
  timerKey?: number; // renamed from key to timerKey
  stopRecording: () => void;
}

export function Timer({ initialTime, timerKey, stopRecording }: TimerProps) {
  const [time, setTime] = useState(initialTime);
  const stopRecordingRef = useRef(stopRecording);

  useEffect(() => {
    stopRecordingRef.current = stopRecording;
  }, [stopRecording]);

  // Triggered every time time changes
  useEffect(() => {
    if (time <= 0) stopRecordingRef.current();
  }, [time]);

  // Triggered once when question id changes
  useEffect(() => {
    setTime(initialTime);
    // Once time reaches 0, interval would be cleared, component would not re-render
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 1) {
          return prevTime - 1;
        }
        clearInterval(interval);
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerKey, initialTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
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
