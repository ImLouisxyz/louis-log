import chalk from "chalk";
import * as Types from "./types.ts"

const defaultSettings: Types.LoggerSettings = {
    show: {
        mainProgram: true,
        subProgram: true,
        date: true
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
        console.log(chalk.yellow(settings))
    }
    sendLog(logLevel: number, logMessage: string|number , logData: any){ // !Might need to add more types for logMessage
        
    }


    log(message: string) {
        console.log(chalk.yellow(message));
    }
}


// Example usage: function that accepts settings with default values
function initializeSettings(customSettings: Partial<Settings> = {}): Settings {
    return 
}