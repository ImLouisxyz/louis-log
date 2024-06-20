import chalk from "chalk";
import dateFormat from "dateformat";
import * as Types from "./types.ts";
import * as fs from "node:fs";

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
        json: true,
        txt: true,
        splitBy: "day",
        stratagy: "batch",
        batch: 6,
        ignoreLevels: ["DEBUG"],
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

    private logBuffer: Types.LogBufferItem[] = [];

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

        this.success(`Initialised Logger`);

        this.debug("Settings:\n" + JSON.stringify(this.formatSettings, null, 4));
        this.debug("\n" + JSON.stringify(this.storageSettings, null, 4));
        this.debug("\n" + JSON.stringify(this.webhookSettings, null, 4) + "\n");
    }
    private sendLog(logLevel: Types.LogLevel, logMessage: any, logData: any) {
        const currentTime = new Date();
        const formattedDate: string = dateFormat(currentTime, this.formatSettings.dateformat);
        const logMessageString = this.handleLogDatatype(logMessage);
        const logDataString = this.handleLogDatatype(logData);

        const txtLog = this.formTxtLog(formattedDate, logMessageString, logLevel, logDataString);

        if (this.formatSettings.stdoutEnable && !this.formatSettings.ignoreLevels.includes(logLevel))
            console.log(this.colours[logLevel](txtLog));

        if (
            (this.storageSettings.json || this.storageSettings.txt) &&
            !this.storageSettings.ignoreLevels.includes(logLevel)
        )
            this.logToFile(currentTime, formattedDate, logMessageString, logLevel, logDataString, txtLog);
    }

    private formTxtLog(formattedDate: string, logMessage: string, logLevel: string, logDataString: string): string {
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

        return outMessage;
    }

    private logToFile(
        currentTime: Date,
        formattedDate: string,
        logMessageString: string,
        logLevel: string,
        logDataString: string,
        logTxt: string,
    ) {
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

        let logJSONString: string = "";

        try {
            logJSONString = JSON.stringify(logJSON);
        } catch (error) {
            this.error("Error converting logJSON to string", { error: error, data: logJSON });
        }

        // storing
        if (this.storageSettings.stratagy == "batch" && this.storageSettings.batch > 1) {
            // Update buffer
            let bufferLength: number = this.logBuffer.push({ logTXT: logTxt, logJSONString: logJSONString });

            // if we are at batch count, send to file
            if (bufferLength >= this.storageSettings.batch) {
                this.extractBuffer(currentTime);
            }
        } else {
            // send file every time
            let { dirLocation, logLocation } = this.generatePaths(currentTime);

            if (!fs.existsSync(dirLocation)) {
                fs.mkdirSync(dirLocation, { recursive: true });
            }

            if (this.storageSettings.txt) {
                const txtWriteStream = fs.createWriteStream(logLocation + "txt.log", { flags: "a" });
                txtWriteStream.write(logTxt + "\n");
                txtWriteStream.end();
            }

            if (this.storageSettings.json) {
                const jsonWriteStream = fs.createWriteStream(logLocation + "json.log", { flags: "a" });
                jsonWriteStream.write(logJSONString + "\n");
                jsonWriteStream.end();
            }
        }
    }

    private generatePaths(currentTime: Date) {
        let logLocation = "";
        let dirLocation = this.storageSettings.path;
        //        dateformat: "yyyy-mm-dd HH:MM:ss:l Z",
        switch (this.storageSettings.splitBy) {
            case "don't split":
                dirLocation += `/`;
                logLocation += dirLocation + "logs.";
                break;
            case "year":
                dirLocation += `/`;
                logLocation += `${dateFormat(currentTime, "yyyy")}.`;
                break;
            case "month":
                dirLocation += `/${dateFormat(currentTime, "yyyy")}/`;
                logLocation += dirLocation + `${dateFormat(currentTime, "mm")}.`;
                break;
            case "day":
                dirLocation += `/${dateFormat(currentTime, "yyyy/mm")}/`;
                logLocation += dirLocation + `${dateFormat(currentTime, "dd")}.`;
                break;
            case "hour":
                dirLocation += `/${dateFormat(currentTime, "yyyy/mm/dd")}/`;
                logLocation += dirLocation + `${dateFormat(currentTime, "HH")}.`;
                break;
            case "minute":
                dirLocation += `/${dateFormat(currentTime, "yyyy/mm/dd/HH")}/`;
                logLocation += dirLocation + `${dateFormat(currentTime, "MM")}.`;
                break;
            case "second":
                dirLocation += `/${dateFormat(currentTime, "yyyy/mm/dd/HH/MM")}/`;
                logLocation += dirLocation + `${dateFormat(currentTime, "ss")}.`;
                break;
            default:
                this.error("Logger split by value is invalid", this.storageSettings.splitBy);
                break;
        }
        return { dirLocation, logLocation };
    }

    private extractBuffer(currentTime: Date) {
        let { dirLocation, logLocation } = this.generatePaths(currentTime);

        if (!fs.existsSync(dirLocation)) {
            fs.mkdirSync(dirLocation, { recursive: true });
        }

        let txtUnpacked: string = "";
        let jsonUnpacked: string = "";

        let bufferLength = this.logBuffer.length;

        for (let i = 0; i < bufferLength; i++) {
            let logItem = this.logBuffer.shift();
            if (logItem == undefined) {
                this.error("Log buffer item is empty whilst trying to read from it");
            } else {
                txtUnpacked += logItem.logTXT + "\n";
                jsonUnpacked += logItem.logJSONString + "\n";
            }
        }

        if (this.storageSettings.txt) {
            const txtWriteStream = fs.createWriteStream(logLocation + "txt.log", { flags: "a" });
            txtWriteStream.write(txtUnpacked);
            txtWriteStream.end();
        }

        if (this.storageSettings.json) {
            const jsonWriteStream = fs.createWriteStream(logLocation + "json.log", { flags: "a" });
            jsonWriteStream.write(jsonUnpacked);
            jsonWriteStream.end();
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

    // Closing process
    exit() {
        const currentTime = new Date();
        this.extractBuffer(currentTime);
    }
}
