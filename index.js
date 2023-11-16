#!/usr/bin/env node

import { displayMenu } from "./utils/menu.js";
import { setupUserInputHandlers, handleExit } from "./utils/userInput.js";

const main = () => {
  setupUserInputHandlers();
  displayMenu();
};

process.on("SIGINT", handleExit);
process.on("SIGTSTP", handleExit);

main();
