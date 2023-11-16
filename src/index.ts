#!/usr/bin/env node

import { displayMenu } from "./menu.js";
import { setupUserInputHandlers, handleExit } from "./userInput.js";

const main = () => {
  setupUserInputHandlers();
  displayMenu();
};

process.on("SIGINT", handleExit);
process.on("SIGTSTP", handleExit);

main();
