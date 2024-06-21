console.log("Hello from logger process!");

process.on("message", (message) => {
    switch (message.type) {
        case "settings":
            // TODO add settings store
            console.log(message.data);

            break;
        case "log":
            // TODO add logging
            console.log(message.data);

        default:
            console.error("Unknown Message sent to logger process", message);
            break;
    }
});

console.log("Exiting logger Process");
process.exit(0);
