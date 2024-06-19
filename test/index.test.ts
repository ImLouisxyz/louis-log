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
    const logger = new Logger({ show: { mainProgram: false } });
    logger.log(logMessage);

    // Restore original console.log
    console.log = originalLog;

    logger.log(stdout);

    return stdout;
});

describe("Log", () => {
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
