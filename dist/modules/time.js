"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Time = /** @class */ (function () {
    function Time() {
    }
    Time.millisecond = 1;
    Time.second = 1000;
    Time.minute = 1000 * 60;
    Time.hour = (1000 * 60) * 60;
    Time.day = ((1000 * 60) * 60) * 24;
    Time.week = (((1000 * 60) * 60) * 24) * 7;
    Time.month = (((1000 * 60) * 60) * 24) * 30;
    Time.year = (((1000 * 60) * 60) * 24) * 365;
    return Time;
}());
exports.Time = Time;
