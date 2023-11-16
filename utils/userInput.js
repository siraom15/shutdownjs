import prompt from "prompt";
import keypress from "keypress";
import { handleKeyPress } from "./menu.js";

keypress(process.stdin);

const setupUserInputHandlers = () => {
  process.stdin.on("keypress", handleKeyPress);
  process.stdin.setRawMode(true);
  process.stdin.resume();
};

const handleExit = () => {
  console.log("\nExiting the shutdown program.");
  exit(0);
};

export { setupUserInputHandlers, handleExit };
