var cp = require("child_process");

createProcess(`node`, ["dist/main.js"]);

function createProcess(cmd, options) {
    var x = cp.spawn(cmd, options, {
        env: {
            DB_USERNAME: "darryl",
            DB_PASSWORD: "password",
            DB_PORT: "27017",
            DB_DATABASE: "restaurant",

            SRV_PORT: 8888
        }
    });

    x.stdout.on("data", (data) => {
        console.log(`(${cmd})`, data.toString());
    });

    x.stderr.on("data", (data) => {
        console.error(`(${cmd})`, data.toString());
    });

    x.on("error", (data) => {
        console.error(cmd, "error:", data.toString());
    });

    x.on("exit", (data) => {
        console.log(cmd, "Exit:", data.toString());
    });
}