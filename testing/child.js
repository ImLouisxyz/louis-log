console.log("Child process started");
setInterval(() => {
    console.log(`Child process is running at ${new Date()}`);
}, 1000);
