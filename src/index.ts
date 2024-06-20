import chalk from "chalk";
import dateFormat from "dateformat";
import * as Types from "./types.ts";
import { appendFileSync } from "node:fs";

const defaultSettings: Types.LoggerSettings = {
    show: {
        stdoutEnable: true,
        mainProgram: true,
        subProgram: true,
        date: true,
        dateformat: "yyyy-mm-dd HH:MM:ss:l Z",
        dateCountry: "en",
        level: true,
        ignoreLevels: ["DEBUG"],
    },
    logStorage: {
        path: "./logs",
        json: false,
        txt: true,
        splitBy: "day",
        stratagy: "single",
        batch: 1,
        ignoreLevels: ["DEBUG"],
    },
    logWebook: {
        enable: false,
        url: "",
        form: "",
    },
};

const usingBun: boolean = process.versions.bun == undefined ? false : true;

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

        this.success(`Initialised Logger, Running in bun? > ${usingBun}`);

        // TODO Change this to use the correct log! And better formatting
        this.debug("Settings:\n" + JSON.stringify(this.formatSettings, null, 4));
        this.debug("\n" + JSON.stringify(this.storageSettings, null, 4));
        this.debug("\n" + JSON.stringify(this.webhookSettings, null, 4) + "\n");

        if (this.storageSettings.stratagy == "batch" && !usingBun) {
            this.fatal("Logger cannot use batch mode when not running in bun");
            process.exit(1);
        }
    }
    private sendLog(logLevel: Types.LogLevel, logMessage: any, logData: any) {
        const currentTime = new Date();
        const formattedDate: string = dateFormat(currentTime, this.formatSettings.dateformat);
        const logMessageString = this.handleLogDatatype(logMessage);
        const logDataString = this.handleLogDatatype(logData);

        if (this.formatSettings.stdoutEnable && !this.formatSettings.ignoreLevels.includes(logLevel))
            this.logToStdout(formattedDate, logMessageString, logLevel, logDataString);
    }

    private logToStdout(formattedDate: string, logMessage: string, logLevel: string, logDataString: string) {
        let outMessage = "";
        outMessage += this.formatSettings.date ? `[${formattedDate}] ` : "";

        outMessage += this.formatSettings.mainProgram || this.formatSettings.subProgram ? "<" : "";

        outMessage += this.formatSettings.mainProgram ? this.mainProcess : "";

        outMessage += this.formatSettings.mainProgram && this.formatSettings.subProgram ? "." : "";

        outMessage += this.formatSettings.subProgram ? this.subProcess : "";

        outMessage += this.formatSettings.mainProgram || this.formatSettings.subProgram ? "> " : "";

        outMessage += this.formatSettings.level ? `[${logLevel}] ` : "";

        outMessage += logMessage;

        outMessage += logDataString != "" ? "\nLog Data:\n" + logDataString : "";

        console.log(this.colours[logLevel](outMessage));
    }

    private logToFile(
        currentTime: Date,
        formattedDate: string,
        logMessageString: string,
        logLevel: string,
        logDataString: string,
    ) {
        // TODO add filestorage

        // Form log JSON

        const logJSON: Types.LogJSON = {
            date: currentTime,
            formattedDate: formattedDate,
            mainProcess: this.mainProcess,
            subProcess: this.subProcess,
            logLevel: logLevel,
            logMessage: logMessageString,
            logData: logDataString,
        };

        let logJSONString: string;

        try {
            logJSONString = JSON.stringify(logJSON);
        } catch (error) {
            this.error("Error converting logJSON to string", { error: error, data: logJSON });
        }

        let logLocation = this.storageSettings.path;

        switch (this.storageSettings.splitBy) {
            case "year":
                logLocation += `/${currentTime.getFullYear()}/logs.`;
                break;
            case "month":
                logLocation += `/${currentTime.getFullYear()}/${currentTime.getMonth()}/logs.`;
                break;
        }
    }

    private handleLogDatatype(logData: any): string {
        if (logData == undefined) return "";

        const dataType = typeof logData;

        if (dataType == "string") return logData;

        if (["bigint", "boolean", "number", "symbol", "function"].includes(dataType)) return logData.toString();

        if (dataType == "object") {
            try {
                return JSON.stringify(logData, null, 4);
            } catch (error) {
                this.error("Datatype of object is not json", { dataType: dataType, data: logData });
                return "";
            }
        }

        this.error("Datatype Error", { dataType: dataType, data: logData });
        return "Datatype error";
    }

    // Print methods
    fatal(message: string, data?: any) {
        this.sendLog("FATAL", message, data);
    }

    error(message: string, data?: any) {
        this.sendLog("ERROR", message, data);
    }

    err = this.error;

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
