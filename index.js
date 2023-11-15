#!/usr/bin/env node

import { exec } from "child_process";
import prompt from "prompt";
import keypress from "keypress";
import chalk from "chalk";

keypress(process.stdin);

const shutdown = (time) => {
  const command =
    process.platform === "win32"
      ? `shutdown /s /t ${time}`
      : `shutdown -h ${time}`;

  const shutdownTime = new Date(Date.now() + time * 1000);
  const formattedShutdownTime = shutdownTime.toLocaleTimeString();

  exec(command, (error, stdout, stderr) => {
    if (error) {
      handleError(error, stderr, time);
    } else {
      console.log(
        chalk.green(
          `Shutdown scheduled successfully!\nYour PC will shutdown at ${formattedShutdownTime}.`
        )
      );
      process.exit(0);
    }
  });
};

const handleError = (error, stderr, time = 0) => {
  if (stderr.includes("A system shutdown has already been scheduled")) {
    console.log(chalk.yellow("A shutdown is already scheduled. Replacing..."));
    cancelShutdownSchedule();
    shutdown(time);
  } else if (
    stderr.includes(
      "Unable to abort the system shutdown because no shutdown was in progress"
    )
  ) {
    console.error(
      chalk.red(
        "Error: No shutdown is currently in progress. Please schedule a shutdown first."
      )
    );
  } else {
    console.error(chalk.red(`Error executing shutdown command: ${error}`));
    process.exit(1);
  }
};

const cancelShutdownSchedule = () => {
  const command = process.platform === "win32" ? `shutdown /a` : `shutdown -a`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      handleError(error, stderr);
      return false;
    } else {
      console.log(chalk.green("Previous shutdown schedule canceled!"));
      return true;
    }
  });
};

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
      if (key.ctrl) process.exit(0);
      break;
    default:
      return;
  }

  displayMenu();
};

const handleReturnAction = () => {
  const selectedOption = menuOptions[selectedOptionIndex];

  if (selectedOption.custom) {
    handleCustomTimeInput();
  } else if (selectedOption.cancel) {
    cancelShutdownSchedule();
  } else if (selectedOption.exit) {
    process.exit(0);
  } else {
    shutdown(selectedOption.time);
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

process.stdin.on("keypress", handleKeyPress);
process.stdin.setRawMode(true);
process.stdin.resume();

const handleExit = () => {
  console.log("\nExiting the shutdown program.");
  process.exit(0);
};

process.on("SIGINT", handleExit);
process.on("SIGTSTP", handleExit);

displayMenu();
