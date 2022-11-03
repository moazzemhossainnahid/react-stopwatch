// import "./styles.css";
import { useEffect, useReducer } from "react";
import Designer from "./Designer";

interface StopwatchState {
  running: boolean;
  currentTime: number;
  lastTime: number;
}
type StopwatchActions =
  | { type: "stop" }
  | { type: "start" }
  | { type: "reset" }
  | { type: "tick" };

function StopwatchReducer(
  state: StopwatchState,
  action: StopwatchActions
): StopwatchState {
  switch (action.type) {
    case "reset":
      return { running: false, currentTime: 0, lastTime: 0 };
    case "start":
      return { ...state, running: true, lastTime: Date.now() };
    case "stop":
      return { ...state, running: false };
    case "tick":
      if (!state.running) return state;
      return {
        ...state,
        currentTime: state.currentTime + (Date.now() - state.lastTime),
        lastTime: Date.now()
      };
  }
}
function parseTime(
  time: number
): { hours: number; minutes: number; seconds: number; milliseconds: number } {
  const date = new Date(time);
  const hours = date.getHours() + date.getTimezoneOffset() / 60 - 24;
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  return {
    hours,
    minutes,
    seconds,
    milliseconds
  };
}
export default function App() {
  const [state, dispatch] = useReducer(StopwatchReducer, {
    running: false,
    currentTime: 0,
    lastTime: 0
  });
  useEffect(() => {
    let frame: number;
    function tick() {
      dispatch({ type: "tick" });
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  const time = parseTime(state.currentTime);
  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col justify-center items-center">
      <div className="pb-16">
        <h3 className="text-5xl font-sans font-bold text-orange-500">React <span className="text-rose-500">StopWatch</span></h3>
      </div>
      <span className="text-6xl font-bold tabular-nums">
        {time.hours.toString().padStart(2, "0")}:
        {time.minutes.toString().padStart(2, "0")}:
        {time.seconds.toString().padStart(2, "0")}.
        {time.milliseconds.toString().padStart(3, "0")}
      </span>
      <div className="space-x-6 space-y-5">
        <button
          onClick={() => dispatch({ type: "reset" })}
          className="bg-yellow-500 hover:bg-yellow-600 border-4 border-yellow-700 rounded-full w-16 h-16"
        >
          Reset
        </button>
        {!state.running ? (
          <button
            onClick={() => dispatch({ type: "start" })}
            className="bg-green-500 hover:bg-green-600 border-4 border-green-700 rounded-full w-16 h-16"
          >
            Start
          </button>
        ) : (
          <button
            onClick={() => dispatch({ type: "stop" })}
            className="bg-red-500 hover:bg-red-600 border-4 border-red-700 rounded-full w-16 h-16"
          >
            Stop
          </button>
        )}
      </div>
      <div className="flex w-full justify-end items-end p-5">
        <Designer/>
      </div>
    </div>
  );
}

// Please create new with typescript as per below video link
// https://youtu.be/JGFsBI11nes
