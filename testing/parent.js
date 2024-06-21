import { fork } from "child_process";
import path from "path";

const child = fork("./child.js", [], {
    //   detached: true,
    stdio: "inherit",
});

child.unref();

console.log("Parent process exiting");

setTimeout(() => {
    JSON.parse("[[]");
}, 4000);
