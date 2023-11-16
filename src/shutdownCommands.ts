import { ExecException, exec } from "child_process";
import chalk from "chalk";
import { CommandType } from "./command.type";

interface ExecutionResult {
  error: ExecException | null;
  stdout: string;
  stderr: string;
}

interface ExecutionOptions {
  time?: number;
  commandType: CommandType;
  exitAfter?: boolean;
}

const shutdown = (time: number) => {
  const command =
    process.platform === "win32"
      ? `shutdown /s /t ${time}`
      : `shutdown -h ${time}`;

  exec(command, (error, stdout, stderr) => {
    const result: ExecutionResult = { error, stdout, stderr };
    const options: ExecutionOptions = {
      commandType: CommandType.shutdown,
      time,
      exitAfter: true,
    };
    handleExec(result, options);
  });
};

const cancelShutdown = (exitAfter = false) => {
  const command = process.platform === "win32" ? `shutdown /a` : `shutdown -a`;

  exec(command, (error, stdout, stderr) => {
    const result: ExecutionResult = { error, stdout, stderr };
    const options: ExecutionOptions = {
      commandType: CommandType.cancelShutdown,
      exitAfter,
    };
    handleExec(result, options);
  });
};

const exit = (code: number) => {
  process.exit(code);
};

const handleExec = (result: ExecutionResult, options: ExecutionOptions): void => {
  const { error, stdout, stderr } = result;
  const { time = 0, commandType, exitAfter = false } = options;

  if (stderr.includes("A system shutdown has already been scheduled")) {
    console.log(chalk.yellow("A shutdown is already scheduled. Replacing..."));
    cancelShutdown();
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
    switch (commandType) {
      case CommandType.shutdown:
        const shutdownTime = new Date(Date.now() + time * 1000);
        const formattedShutdownTime = shutdownTime.toLocaleTimeString();
        console.log(
          chalk.green(
            `Shutdown scheduled successfully!\nYour PC will shutdown at ${formattedShutdownTime}.`
          )
        );
        break;
      case CommandType.cancelShutdown:
        console.log(chalk.green("Previous shutdown schedule canceled!"));
        break;
      default:
        break;
    }
    if (exitAfter) exit(0);
  }
}

export { shutdown, cancelShutdown, exit };
