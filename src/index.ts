import chalk from "chalk";
import * as Types from "./types.ts";

const defaultSettings: Types.LoggerSettings = {
    show: {
        mainProgram: true,
        subProgram: true,
        date: true,
        dateformat: {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false, // 24-hour
        },
        ignoreLevels: ["DEBUG"],
    },
    logStorage: {
        path: "./logs",
        json: false,
        txt: true,
        db: false,
        splitBy: "day",
        stratagy: "single",
    },
    logWebook: {
        enable: false,
        url: "",
        form: "",
    },
};

export class Logger {
    private formatSettings: Types.LogFormatSettings;
    private storageSettings: Types.LogStorageSettings;
    private webhookSettings: Types.LogWebhookSettings;

    constructor(userSettings: Partial<Types.CustomLoggerSettings> = {}) {
        // Apply Defualt settings
        this.formatSettings = {
            ...defaultSettings.show,
            ...userSettings.show,
        };

        this.storageSettings = {
            ...defaultSettings.logStorage,
            ...userSettings.logStorage,
        };

        this.webhookSettings = {
            ...defaultSettings.logWebook,
            ...userSettings.logWebook,
        };

        // TODO Change this to use the correct log! And better formatting
        console.log(chalk.yellow("=========== Settings ==========="));
        console.log(chalk.yellow(JSON.stringify(this.formatSettings, null, 4)));
        console.log(chalk.yellow(JSON.stringify(this.storageSettings, null, 4)));
        console.log(chalk.yellow(JSON.stringify(this.webhookSettings, null, 4)));
        console.log(chalk.yellow("=========== Settings ==========="));
    }
    private sendLog(logLevel: string, logMessage: string | number, logData: any) {
        const currentTime = new Date();

        // !Might need to add more types for logMessage
        let colours: { [key: string]: Function } = {
            FATAL: chalk.redBright,
            ERROR: chalk.red,
            WARN: chalk.yellow,
            SUCCESS: chalk.green,
            INFO: chalk.blue,
            DEBUG: chalk.magenta,
        };

        let outMessage = "";

        if (this.formatSettings.date) {
            outMessage += `[${new Intl.DateTimeFormat("", this.formatSettings.dateformat)}]`;
        }

        if (this.formatSettings.mainProgram) {
        }

        outMessage += logMessage;

        console.log(colours[logLevel](outMessage));
    }

    // Print methods
    fatal(message: string, data?: any) {
        this.sendLog("FATAL", message, data);
    }

    error(message: string, data?: any) {
        this.sendLog("ERROR", message, data);
    }

    warn(message: string, data?: any) {
        this.sendLog("WARN", message, data);
    }

    success(message: string, data?: any) {
        this.sendLog("SUCCESS", message, data);
    }

    // Info and log do the same thing
    info(message: string, data?: any) {
        this.sendLog("INFO", message, data);
    }

    log = this.info;

    debug(message: string, data?: any) {
        this.sendLog("DEBUG", message, data);
    }
}
