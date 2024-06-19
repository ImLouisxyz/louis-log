import chalk from "chalk";
import * as Types from "./types.ts";

const defaultSettings: Types.LoggerSettings = {
    show: {
        stdoutEnable: true,
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
        dateCountry: "en",
        level: true,
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

    public mainProcess: string;
    public subProcess: string;

    // * Might need to add more types for logMessage
    // TODO add colour theme changing support
    private colours: { [key: string]: Function } = {
        FATAL: chalk.bgRedBright,
        ERROR: chalk.red,
        WARN: chalk.yellow,
        SUCCESS: chalk.green,
        INFO: chalk.blue,
        DEBUG: chalk.magenta,
    };

    constructor(mainProcess: string, subProcess: string, userSettings: Partial<Types.CustomLoggerSettings> = {}) {
        this.mainProcess = mainProcess;
        this.subProcess = subProcess;

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

        this.success("Initialised Logger");
        // TODO Change this to use the correct log! And better formatting
        this.debug("Settings:\n" + JSON.stringify(this.formatSettings, null, 4));
        this.debug("\n" + JSON.stringify(this.storageSettings, null, 4));
        this.debug("\n" + JSON.stringify(this.webhookSettings, null, 4) + "\n");
    }
    private sendLog(logLevel: string, logMessage: string | number, logData: any) {
        const currentTime = new Date();

        if (this.formatSettings.stdoutEnable) this.logToStdout(currentTime, logMessage, logLevel);
    }

    private logToStdout(currentTime: Date, logMessage: string | number, logLevel: string) {
        let outMessage = "";

        if (this.formatSettings.date) {
            outMessage += `[ ${new Intl.DateTimeFormat(
                this.formatSettings.dateCountry,
                this.formatSettings.dateformat,
            ).format(currentTime)} ] `;
        }

        if (this.formatSettings.mainProgram || this.formatSettings.subProgram) {
            outMessage += "<";
        }

        if (this.formatSettings.mainProgram) {
            outMessage += this.mainProcess;
        }

        if (this.formatSettings.mainProgram && this.formatSettings.subProgram) {
            outMessage += ".";
        }

        if (this.formatSettings.subProgram) {
            outMessage += this.subProcess;
        }

        if (this.formatSettings.mainProgram || this.formatSettings.subProgram) {
            outMessage += ">";
        }

        outMessage += logMessage;

        console.log(this.colours[logLevel](outMessage));
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
