import { Logger } from "../src/index.ts";

const Testing = new Logger("Testing", "testing even more");

Testing.log("hello world! 101 :)");
Testing.log("hello world! 202 :)");
Testing.log("hello world! 303 :)");
Testing.log("hello world! 404 :)");
Testing.log("hello world! 505 :)");
Testing.exit();
