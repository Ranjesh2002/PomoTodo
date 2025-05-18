import { useState } from "react";
import Todo from "./components/Todo";
import Pomodoro from "./components/Pomodoro";

function App() {
  const [selectedTask, setSelectedTask] = useState(null);

  const handlePomodoroComplete = (taskId) => {
    setSelectedTask((prevTask) => {
      if (prevTask && prevTask.id === taskId) {
        return {
          ...prevTask,
          completedPomodoros: prevTask.completedPomodoros + 1,
        };
      }
      return prevTask;
    });
  };

  const adjustEstimatedPomodoros = (taskId, change) => {
    setSelectedTask((prevTask) => {
      if (prevTask && prevTask.id === taskId) {
        return {
          ...prevTask,
          estimatedPomodoros: Math.max(1, prevTask.estimatedPomodoros + change),
        };
      }
      return prevTask;
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-teal-600 text-white p-4 text-center">
        <h1 className="text-3xl font-bold">Pomodoro Todo App</h1>
      </header>
      {/* <DarkModeToggle /> */}
      {/* Main Content */}
      <main className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Todo List */}
        <div className="rounded-lg shadow-lg p-6">
          <Todo onTaskSelect={setSelectedTask} />
        </div>

        {/* Pomodoro Clock */}
        <div className="rounded-lg shadow-lg p-6">
          <Pomodoro
            selectedTask={selectedTask}
            onPomodoroComplete={handlePomodoroComplete}
            adjustEstimatedPomodoros={adjustEstimatedPomodoros}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
