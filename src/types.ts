export type LogStorageSettings = {
    path: string; // Location for logs to be placed
    json: boolean; // Enable json logging
    txt: boolean; // Enable txt logging (store stdout)
    splitBy: "don't split" | "year" | "month" | "day" | "hour" | "minute" | "second"; // Split up log files by time
    stratagy: "single" | "batch"; // How to handle disk accesses: single = every log means update logfile. batch = every x amount of logs means update
    batch: number; // x count for log amounts
    ignoreLevels: LogLevel[]; // If you don't want to store certain levels
};

export type LogWebhookSettings = {
    enable: boolean; // Send to webhook
    url: URL | undefined; // URL for webhook
    form?: "" | "discord"; // Formation of webhook
};

export type LogFormatSettings = {
    stdoutEnable: boolean; // Enable stdout
    mainProgram: boolean; // Display of main process/program in txt logs and stdout
    subProgram: boolean; // Display of sub process/program in txt logs and stdout
    date: boolean; // Display Date in txt logs and stdout
    dateformat: string; // Formatting of dates for logs
    level: boolean; // Display the level of a log in logs
    ignoreLevels: LogLevel[]; // If you don't want to store certain levels
};

export type LoggerSettings = {
    logStorage: LogStorageSettings;
    logWebook: LogWebhookSettings;
    show: LogFormatSettings;
};

export type CustomLoggerSettings = {
    logStorage: Partial<LogStorageSettings>;
    logWebook: Partial<LogWebhookSettings>;
    show: Partial<LogFormatSettings>;
};

export type LogLevel = "FATAL" | "FATALRATE" | "ERROR" | "WARN" | "SUCCESS" | "INFO" | "DEBUG";

export type LogJSON = {
    date: Date;
    formattedDate: string;
    mainProcess: string;
    subProcess: string;
    logLevel: string;
    logMessage: string;
    logData: any;
};

export type LogBufferItem = {
    logTXT: string;
    logJSONString: string;
};

export type WebhookBufferItem = {
    title: string;
    description: string;
    color: null;
    footer: { text: string };
};
