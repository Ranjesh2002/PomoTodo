import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import PropTypes from "prop-types";

const Pomodoro = ({
  selectedTask,
  onPomodoroComplete,
  adjustEstimatedPomodoros,
}) => {
  const [time, setTime] = useState(0.2 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionMessage, setCompletionMessage] = useState(""); // New state for completion message

  useEffect(() => {
    let interval = null;

    if (isActive && !isPaused && time > 0 && !isCompleted) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0 && !isCompleted) {
      clearInterval(interval);

      if (isWorkTime) {
        // Check if this Pomodoro completion would reach the target
        const nextCompletedCount = selectedTask.completedPomodoros + 1;

        if (
          selectedTask &&
          nextCompletedCount >= selectedTask.estimatedPomodoros
        ) {
          // Task is fully completed
          onPomodoroComplete(selectedTask.id); // Update completed Pomodoros one last time
          setIsCompleted(true);
          setIsActive(false);
          setTime(0); // Stop the timer
          setCompletionMessage(
            "Congratulations! You've completed all estimated Pomodoros for this task!"
          );
        } else {
          // Start break time if task is not fully completed
          onPomodoroComplete(selectedTask.id); // Update completed Pomodoros
          setTime(0.1 * 60); // 5-minute break
          setIsWorkTime(false);
        }
      } else {
        // Coming back from break
        setTime(0.2 * 60); // 20-minute work session
        setIsWorkTime(true);
      }
    }

    return () => clearInterval(interval);
  }, [
    isActive,
    isPaused,
    time,
    isWorkTime,
    selectedTask,
    onPomodoroComplete,
    isCompleted,
  ]);

  const startTimer = () => {
    if (isCompleted) {
      alert("You've already completed all Pomodoros for this task!");
      return;
    }
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    if (isCompleted) {
      alert("You've already completed all Pomodoros for this task!");
      return;
    }
    setIsPaused(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime(0.2 * 60); // Reset to 20-minute work session
    setIsWorkTime(true);
    setIsCompleted(false);
    selectedTask.completedPomodoros = 0; // Reset completed Pomodoros for the task
    selectedTask.estimatedPomodoros = 0; // Reset estimated Pomodoros for the task
    setCompletionMessage(""); // Clear the completion message
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`w-50 h-50 rounded-full ${
          isCompleted ? "bg-green-600" : "bg-gray-900"
        } flex items-center justify-center shadow-2xl shadow-black/50 mb-10`}
      >
        <span className="text-5xl font-bold tracking-wider text-white">
          {isCompleted ? "✓" : formatTime(time)}
        </span>
      </div>

      {selectedTask && (
        <>
          <p className="text-xl mb-4 p-2">Current Task: {selectedTask.todo}</p>
          <div className="flex items-center gap-1 text-sm">
            <Clock size={16} className={`transition-colors duration-300`} />
            <span
              className={`transition-colors duration-300 ${
                isCompleted ? "text-green-600 font-bold" : ""
              }`}
            >
              {selectedTask.completedPomodoros}/
              {selectedTask.estimatedPomodoros}
            </span>
            <button
              onClick={() => adjustEstimatedPomodoros(selectedTask.id, -1)}
              className={`w-4 h-4 flex items-center justify-center text-xs rounded transition-colors duration-300 ${
                selectedTask.estimatedPomodoros <= 1
                  ? "bg-gray-300"
                  : "bg-gray-200"
              }`}
              disabled={selectedTask.estimatedPomodoros <= 1}
            >
              -
            </button>
            <button
              onClick={() => adjustEstimatedPomodoros(selectedTask.id, 1)}
              className="w-4 h-4 flex items-center justify-center text-xs rounded transition-colors duration-300 bg-gray-200"
            >
              +
            </button>
          </div>
        </>
      )}

      {completionMessage && (
        <p className="text-green-600 font-bold text-center mt-4">
          {completionMessage}
        </p>
      )}

      <h1 className="text-xl mb-8">
        {isCompleted
          ? "All Pomodoros completed!"
          : isWorkTime
          ? "Click start for work time"
          : "It's break time"}
      </h1>

      <div className="flex flex-wrap justify-center gap-4 w-full max-w-md">
        <button
          onClick={() => {
            if (selectedTask.estimatedPomodoros === 0) {
              alert("Please set an estimated Pomodoros first!");
              return;
            }
            startTimer();
          }}
          disabled={isCompleted}
          className={`px-6 py-3 ${
            isCompleted ? "bg-gray-400" : "bg-green-600 hover:scale-105"
          } text-white font-bold rounded-lg transition-transform`}
        >
          Start
        </button>
        <button
          onClick={pauseTimer}
          disabled={isCompleted}
          className={`px-6 py-3 ${
            isCompleted ? "bg-gray-400" : "bg-red-600 hover:scale-105"
          } text-white font-bold rounded-lg transition-transform`}
        >
          Pause
        </button>
        <button
          onClick={resumeTimer}
          disabled={isCompleted}
          className={`px-6 py-3 ${
            isCompleted ? "bg-gray-400" : "bg-blue-600 hover:scale-105"
          } text-white font-bold rounded-lg transition-transform`}
        >
          Resume
        </button>
        <button
          onClick={resetTimer}
          className="px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:scale-105 transition-transform"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

Pomodoro.propTypes = {
  selectedTask: PropTypes.shape({
    id: PropTypes.string.isRequired,
    todo: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    completedPomodoros: PropTypes.number.isRequired,
    estimatedPomodoros: PropTypes.number.isRequired,
  }),
  onPomodoroComplete: PropTypes.func.isRequired,
  adjustEstimatedPomodoros: PropTypes.func.isRequired,
};

export default Pomodoro;
