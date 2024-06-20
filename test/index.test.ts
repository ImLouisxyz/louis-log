import { describe, test, expect, mock } from "bun:test";
import { Logger } from "../src/index.ts";

const useLogger = mock((logMessage: string) => {
    const originalLog = console.log;
    let stdout = "";

    // Override console.log to capture the output
    console.log = (message) => {
        stdout += message + "\n";
    };

    // Create a new Logger instance and log a message
    const logger = new Logger("Bun-testing", "log-tests", {});
    logger.log(logMessage, "console.log");

    // Restore original console.log
    console.log = originalLog;

    console.log(stdout);

    return stdout;
});

describe("Log", () => {
    useLogger("This log is so that it preloads the mock function so it will run fast!");
    test("Plain text", () => {
        const log = useLogger("Hello World");

        expect(log).toContain("Hello World");
        expect(useLogger).toHaveBeenCalled();
    });
    test("Alphanumeric", () => {
        const log = useLogger("Hello World 123");

        expect(log).toContain("Hello World 123");
        expect(useLogger).toHaveBeenCalled();
    });
    test("Special Characters", () => {
        const log = useLogger("Hello, World! 123");

        expect(log).toContain("Hello, World! 123");
        expect(useLogger).toHaveBeenCalled();
    });
});
