var cp = require("child_process");

var commands = [
    `${/^win/.test(process.platform) ? 'tsc.cmd' : 'tsc'} --w`,
    `${/^win/.test(process.platform) ? 'sass.cmd' : 'sass'} --watch src:dist`,
    `${/^win/.test(process.platform) ? 'watchify.cmd' : 'watchify'} dist/public/js/index.js -o dist/public/js/bundle.dev.js`,
];
var processes = [];

commands.map((cmd, index) => {
    var x = cmd.split(" ");
    createProcess(`${x.shift()}`, x, index);
});

function createProcess(cmd, options, index) {
    processes[index] = null;
    var x = cp.spawn(cmd, options);

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

    processes[index] = x;
}