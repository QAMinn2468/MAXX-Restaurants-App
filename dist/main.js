"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var routes_1 = require("./modules/routes");
var api_1 = require("./modules/api");
var database_1 = require("./database");
var path_1 = require("path");
var dbUsername = process.env["DB_USERNAME"];
var dbPassword = process.env["DB_PASSWORD"];
var dbPort = process.env["DB_PORT"];
var dbDatabase = process.env["DB_DATABASE"];
var srvPort = process.env["SRV_PORT"];
var Main = /** @class */ (function () {
    function Main() {
        var _this = this;
        this.app = express();
        this.database = new database_1.DatabaseMethods.Database(dbUsername, dbPassword, dbPort, dbDatabase);
        this.database.onConnection = function () {
            _this.routesModule = new routes_1.Routes(_this);
            _this.apiModule = new api_1.API(_this);
            _this.app.use(express.static(path_1.join(__dirname, "public")));
            _this.app.use(_this.routesModule.routes);
            _this.app.use("/api", _this.apiModule.routes);
            _this.startServer();
        };
        this.database.onFail = function () {
            _this.startTempServer();
        };
    }
    Main.prototype.startServer = function () {
        console.log("Starting server");
        this.app.listen(srvPort, function () {
            console.log("Listening on port " + srvPort);
        });
    };
    Main.prototype.startTempServer = function () {
        console.log("Starting (temp) server");
        this.app.listen(srvPort, function () {
            console.log("Listening on port " + srvPort);
        });
        this.app.all("*", function (req, res) {
            res.send("Database connection failed. Server could not start");
        });
    };
    return Main;
}());
exports.Main = Main;
new Main();
