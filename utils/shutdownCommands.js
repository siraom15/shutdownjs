import { exec } from "child_process";
import chalk from "chalk";

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
      exit(0);
    }
  });
};

const cancelShutdown = (exitAfter = false) => {
  const command = process.platform === "win32" ? `shutdown /a` : `shutdown -a`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      handleError(error, stderr);
    } else {
      console.log(chalk.green("Previous shutdown schedule canceled!"));
      if (exitAfter) exit(0);
    }
  });
};

const exit = (code) => {
  process.exit(code);
};

const handleError = (error, stderr, time = 0) => {
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
    console.error(chalk.red(`Error executing shutdown command: ${error}`));
    exit(1);
  }
};

export { shutdown, cancelShutdown, exit };
