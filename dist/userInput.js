"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleExit = exports.setupUserInputHandlers = void 0;
const keypress_1 = require("keypress");
const menu_js_1 = require("./menu.js");
(0, keypress_1.default)(process.stdin);
const setupUserInputHandlers = () => {
    process.stdin.on("keypress", menu_js_1.handleKeyPress);
    process.stdin.setRawMode(true);
    process.stdin.resume();
};
exports.setupUserInputHandlers = setupUserInputHandlers;
const handleExit = () => {
    console.log("\nExiting the shutdown program.");
    exit(0);
};
exports.handleExit = handleExit;
