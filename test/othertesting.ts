import Logger from "../src/index.ts";

const Testing = new Logger("Testing", "testing even more", {
    logWebook: { enable: true, url: new URL(process.env.DISCORD_URL!), form: "discord" },
});

Testing.log("hello world! 101 :)");
Testing.log("hello world! 202 :)");
Testing.log("hello world! 303 :)");
Testing.log("hello world! 404 :)");
Testing.log("hello world! 505 :)");

Testing.fatal("This is a fatal error");
Testing.error("This is a normal error");
Testing.err("This is a shorthand for error");
Testing.warn("This is a warning");
Testing.success("This is a success message");
Testing.info("This is a normal log message");
Testing.log("This is also a normal log message");
Testing.debug("This is a debug message");

Testing.info("This has extra data", { you: "can put anything you like here" });

let count = 0;
let id = setInterval(() => {
    Testing.info("Hello", count);
    count++;
    if (count > 10) clearInterval(id);
}, 500);

// setTimeout(() => {
//     throw new Error("Simulated crash");
// }, 4000);
