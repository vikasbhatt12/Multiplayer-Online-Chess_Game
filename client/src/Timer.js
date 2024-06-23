// Timer.js
import React, { useState, useEffect } from "react";

const Timer = ({ initialMinutes = 3, initialSeconds = 0, isActive, onTimeUp, onTimeChange }) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    let intervalId;

    if (isActive) {
      intervalId = setInterval(() => {
        if (seconds > 0) {
          setSeconds(prevSeconds => {
            const newSeconds = prevSeconds - 1;
            onTimeChange(minutes, newSeconds);
            return newSeconds;
          });
        } else if (minutes > 0) {
          setMinutes(prevMinutes => {
            const newMinutes = prevMinutes - 1;
            setSeconds(59);
            onTimeChange(newMinutes, 59);
            return newMinutes;
          });
        } else if (minutes === 0 && seconds === 0) {
          if (onTimeUp) onTimeUp();
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive, minutes, seconds, onTimeUp, onTimeChange]);

  return (
    <div className="timer">
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
};

export default Timer;
