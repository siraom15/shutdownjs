"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleReturnAction = exports.handleKeyPress = exports.displayMenu = void 0;
const chalk_1 = require("chalk");
const prompt_1 = require("prompt");
const shutdownCommands_js_1 = require("./shutdownCommands.js");
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
    console.log(chalk_1.default.cyan("Select shutdown time:"));
    menuOptions.forEach((option, index) => {
        const label = index === selectedOptionIndex ? `> ${option.label}` : `  ${option.label}`;
        console.log(chalk_1.default[index === selectedOptionIndex ? "cyan" : "white"](label));
    });
};
exports.displayMenu = displayMenu;
const handleKeyPress = (ch, key) => {
    if (!key || !key.name)
        return;
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
            handleReturnAction();
            break;
        case "c":
        case "z":
            if (key.ctrl)
                (0, shutdownCommands_js_1.exit)(0);
            break;
        default:
            return;
    }
};
exports.handleKeyPress = handleKeyPress;
const handleReturnAction = () => {
    const selectedOption = menuOptions[selectedOptionIndex];
    if (selectedOption.custom) {
        handleCustomTimeInput();
    }
    else if (selectedOption.cancel) {
        (0, shutdownCommands_js_1.cancelShutdown)(true);
    }
    else if (selectedOption.exit) {
        (0, shutdownCommands_js_1.exit)(0);
    }
    else {
        (0, shutdownCommands_js_1.shutdown)(selectedOption.time);
    }
};
exports.handleReturnAction = handleReturnAction;
const handleCustomTimeInput = () => {
    process.stdin.resume();
    console.log(chalk_1.default.cyan("Enter custom time in minute(s):"));
    prompt_1.default.get(["customTime"], (err, result) => {
        if (err) {
            console.error(chalk_1.default.red("Error getting user input:"), err);
            (0, shutdownCommands_js_1.exit)(1);
        }
        const timeInMins = parseInt(result.customTime, 10);
        if (isNaN(timeInMins) || timeInMins <= 0) {
            console.error(chalk_1.default.red("Invalid input. Please enter a valid positive number for shutdown time."));
            (0, shutdownCommands_js_1.exit)(1);
        }
        const timeInMillis = timeInMins * 60 * 1000;
        (0, shutdownCommands_js_1.shutdown)(timeInMillis);
    });
};
