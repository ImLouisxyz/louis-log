import chalk, { ChalkInstance } from "chalk";
import * as Types from "./types.ts"

const defaultSettings: Types.LoggerSettings = {
    show: {
        mainProgram: true,
        subProgram: true,
        date: true,
        ignoreLevels: ["DEBUG"]

    },
    logStorage: {
        path: "./logs",
        json: false,
        txt: true,
        db: false,
        splitBy: "day"

    },
    logWebook: {
        enable: false,
        url: "",
        form: ""
    }
}

export class Logger {
    constructor(userSettings: Partial<Types.LoggerSettings> = {}) {
        console.log(chalk.green("Hello there!"));
        
        let settings: Types.LoggerSettings = { ...defaultSettings, ...userSettings };
        console.log(chalk.yellow(JSON.stringify(settings)))
    }
    sendLog(logLevel: number, logMessage: string|number , logData: any){ // !Might need to add more types for logMessage
        let colours:  {[key: string]: Function} = {
            "FATAL": chalk.redBright,
            "ERROR": chalk.red,
            "WARN": chalk.yellow,
            "SUCCESS": chalk.green,
            "INFO": chalk.blue,
            "DEBUG": chalk.magenta,
        }
        console.log(colours[logLevel]())
    }


    log(message: string) {
        console.log(chalk.yellow(message));
    }
}