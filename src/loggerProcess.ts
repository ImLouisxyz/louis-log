process.on("message", (message) => {
    switch (message.type) {
        case "settings":
            // TODO add settings store

            break;
        case "log":
        // TODO add logging

        default:
            console.error("Unknown Message sent to logger process", message);
            break;
    }
});
