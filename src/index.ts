import chalk from "chalk";

export class Logger {
    constructor() {
        console.log(chalk.green("Hello there!"));
    }
    log(message: string) {
        console.log(chalk.yellow(message));
    }
}
