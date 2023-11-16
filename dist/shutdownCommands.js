"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exit = exports.cancelShutdown = exports.shutdown = void 0;
const child_process_1 = require("child_process");
const chalk_1 = require("chalk");
const command_type_1 = require("./command.type");
const shutdown = (time) => {
    const command = process.platform === "win32"
        ? `shutdown /s /t ${time}`
        : `shutdown -h ${time}`;
    (0, child_process_1.exec)(command, (error, stdout, stderr) => {
        const result = { error, stdout, stderr };
        const options = {
            commandType: command_type_1.CommandType.shutdown,
            time,
            exitAfter: true,
        };
        handleExec(result, options);
    });
};
exports.shutdown = shutdown;
const cancelShutdown = (exitAfter = false) => {
    const command = process.platform === "win32" ? `shutdown /a` : `shutdown -a`;
    (0, child_process_1.exec)(command, (error, stdout, stderr) => {
        const result = { error, stdout, stderr };
        const options = {
            commandType: command_type_1.CommandType.cancelShutdown,
            exitAfter,
        };
        handleExec(result, options);
    });
};
exports.cancelShutdown = cancelShutdown;
const exit = (code) => {
    process.exit(code);
};
exports.exit = exit;
const handleExec = (result, options) => {
    const { error, stdout, stderr } = result;
    const { time = 0, commandType, exitAfter = false } = options;
    if (stderr.includes("A system shutdown has already been scheduled")) {
        console.log(chalk_1.default.yellow("A shutdown is already scheduled. Replacing..."));
        cancelShutdown();
        shutdown(time);
    }
    else if (stderr.includes("Unable to abort the system shutdown because no shutdown was in progress")) {
        console.error(chalk_1.default.red("Error: No shutdown is currently in progress. Please schedule a shutdown first."));
    }
    else {
        switch (commandType) {
            case command_type_1.CommandType.shutdown:
                const shutdownTime = new Date(Date.now() + time * 1000);
                const formattedShutdownTime = shutdownTime.toLocaleTimeString();
                console.log(chalk_1.default.green(`Shutdown scheduled successfully!\nYour PC will shutdown at ${formattedShutdownTime}.`));
                break;
            case command_type_1.CommandType.cancelShutdown:
                console.log(chalk_1.default.green("Previous shutdown schedule canceled!"));
                break;
            default:
                break;
        }
        if (exitAfter)
            exit(0);
    }
};
