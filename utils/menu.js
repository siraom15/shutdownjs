import chalk from "chalk";
import prompt from "prompt";
import { shutdown, cancelShutdown, exit } from "./shutdownCommands.js";

const menuOptions = [
  { label: "Shutdown in 15 minutes", time: 15 * 60 },
  { label: "Shutdown in 30 minutes", time: 30 * 60 },
  { label: "Shutdown in 1 hour", time: 60 * 60 },
  { label: "Shutdown in 2 hours", time: 2 * 60 * 60 },
  { label: "Enter custom time manually", custom: true },
  { label: "Cancel shutdown scheduler", cancel: true },
  { label: "Exit", exit: true },
];

let selectedOptionIndex = 0;

const displayMenu = () => {
  console.clear();
  console.log(chalk.cyan("Select shutdown time:"));
  menuOptions.forEach((option, index) => {
    const label =
      index === selectedOptionIndex ? `> ${option.label}` : `  ${option.label}`;
    console.log(chalk[index === selectedOptionIndex ? "cyan" : "white"](label));
  });
};

const handleKeyPress = (ch, key) => {
  if (!key || !key.name) return;

  switch (key.name) {
    case "up":
      selectedOptionIndex =
        selectedOptionIndex - 1 < 0
          ? menuOptions.length - 1
          : selectedOptionIndex - 1;
      displayMenu();
      break;
    case "down":
      selectedOptionIndex =
        selectedOptionIndex + 1 > menuOptions.length - 1
          ? 0
          : selectedOptionIndex + 1;
      displayMenu();
      break;
    case "return":
      process.stdin.pause();
      process.stdin.removeListener("keypress", handleKeyPress);
      handleReturnAction();
      break;
    case "c":
    case "z":
      if (key.ctrl) exit(0);
      break;
    default:
      return;
  }
};

const handleReturnAction = () => {
  const selectedOption = menuOptions[selectedOptionIndex];

  if (selectedOption.custom) {
    handleCustomTimeInput();
  } else if (selectedOption.cancel) {
    cancelShutdown(true);
  } else if (selectedOption.exit) {
    exit(0);
  } else {
    shutdown(selectedOption.time);
  }
};

const handleCustomTimeInput = () => {
  process.stdin.resume();
  console.log(chalk.cyan("Enter custom time in minute(s):"));
  prompt.get(["customTime"], (err, result) => {
    if (err) {
      console.error(chalk.red("Error getting user input:"), err);
      exit(1);
    }

    const timeInMins = parseInt(result.customTime, 10);
    if (isNaN(timeInMins) || timeInMins <= 0) {
      console.error(
        chalk.red(
          "Invalid input. Please enter a valid positive number for shutdown time."
        )
      );
      exit(1);
    }

    const timeInSeconds = timeInMins * 60;
    shutdown(timeInSeconds);
  });
};
export { displayMenu, handleKeyPress, handleReturnAction };
