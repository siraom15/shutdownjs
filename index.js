#!/usr/bin/env node

import { exec } from "child_process";
import prompt from "prompt";
import keypress from "keypress";
import chalk from "chalk";

// Enable keypress events for the process
keypress(process.stdin);

// Define the shutdown function
const shutdown = (time) => {
  const command =
    process.platform === "win32"
      ? `shutdown /s /t ${time}`
      : `shutdown -h ${time}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(chalk.red(`Error executing shutdown command: ${error}`));
    } else {
      console.log(chalk.green("Shutdown scheduled successfully!"));
    }
    process.exit(0);
  });
};

const cancelShutdownSchedule = () => {
  const command = process.platform === "win32" ? `shutdown /a` : `shutdown -a`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(
        chalk.red(`Error executing Cancel Shutdown Schedule: ${error}`)
      );
    } else {
      console.log(chalk.green("Canceled Shutdown scheduled!"));
    }
    process.exit(0);
  });
};

// Prompt user for shutdown time
const menuOptions = [
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
    if (index === selectedOptionIndex) {
      console.log(chalk.cyan(`> ${option.label}`));
    } else {
      console.log(chalk.white(`  ${option.label}`));
    }
  });
};

const handleKeyPress = (ch, key) => {
  if (!key || !key.name) {
    return;
  }

  switch (key.name) {
    case "up":
      selectedOptionIndex = Math.max(0, selectedOptionIndex - 1);
      break;

    case "down":
      selectedOptionIndex = Math.min(
        menuOptions.length - 1,
        selectedOptionIndex + 1
      );
      break;

    case "return":
      process.stdin.pause();
      handleReturnAction();
      break;

    case "c":
    case "z":
      if (key.ctrl) {
        // terminate key
        process.exit(0);
      }
      break;

    default:
      return;
  }

  displayMenu();
};

const handleReturnAction = () => {
  if (menuOptions[selectedOptionIndex].custom) {
    handleCustomTimeInput();
  } else if (menuOptions[selectedOptionIndex].cancel) {
    cancelShutdownSchedule();
  } else if (menuOptions[selectedOptionIndex].exit) {
    process.exit(0);
  } else {
    shutdown(menuOptions[selectedOptionIndex].time);
  }
};

const handleCustomTimeInput = () => {
  console.clear();
  console.log(chalk.cyan("Enter custom time in minute(s):"));
  prompt.start();
  prompt.get(["customTime"], (err, result) => {
    if (err) {
      console.error(chalk.red("Error getting user input:"), err);
      process.exit(1);
    }

    const timeInMins = parseInt(result.customTime, 10);
    if (isNaN(timeInMins) || timeInMins <= 0) {
      console.error(
        chalk.red(
          "Invalid input. Please enter a valid positive number for shutdown time."
        )
      );
      process.exit(1);
    }

    const timeInMillis = timeInMins * 60 * 1000;
    shutdown(timeInMillis);
  });
};

// Set up event listeners
process.stdin.on("keypress", handleKeyPress);
process.stdin.setRawMode(true);
process.stdin.resume();

// Handle exit
const handleExit = () => {
  console.log("\nExiting the shutdown program.");
  process.exit(0);
};
process.on("SIGINT", handleExit); // Ctrl+C
process.on("SIGTSTP", handleExit); // Ctrl+Z

// Display initial menu
displayMenu();
