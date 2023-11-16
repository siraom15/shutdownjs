#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const menu_js_1 = require("./menu.js");
const userInput_js_1 = require("./userInput.js");
const main = () => {
    (0, userInput_js_1.setupUserInputHandlers)();
    (0, menu_js_1.displayMenu)();
};
process.on("SIGINT", userInput_js_1.handleExit);
process.on("SIGTSTP", userInput_js_1.handleExit);
main();
