var cp = require("child_process");
var cred = require("./credentials.json");

createProcess(`node`, ["dist/main.js"]);

function createProcess(cmd, options) {
    var x = cp.spawn(cmd, options, {
        env: {
            DB_USERNAME: cred.DB_USERNAME,
            DB_PASSWORD: cred.DB_PASSWORD,
            DB_PORT: cred.DB_PORT,
            DB_DATABASE: cred.DB_DATABASE,

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
