"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var DataStore = require("nedb");
var path_1 = require("path");
var ActivityDb = /** @class */ (function () {
    function ActivityDb() {
        this._millisecondsInADay = 86400000;
        this._createDb();
    }
    ActivityDb.prototype.deleteActivities = function () {
    };
    ActivityDb.prototype.insertActivities = function (activities) {
        if (!this._db)
            throw Error('Database not instantiated');
        var _activities = activities.map(function (e) { return e.data; });
        console.log(_activities);
        this._db.insert(_activities, function (error, _activities) {
            if (error)
                throw error;
            console.log('files inserted');
        });
    };
    ActivityDb.prototype.getActivities = function () {
        var _this = this;
        if (!this._db)
            throw Error('Database not instantiated.');
        var today = new Date();
        var sevenDaysAgoMilleseconds = today.getTime() - (this._millisecondsInADay * 7);
        return new Promise(function (resolve, reject) {
            _this._db.find({ dateModifiedMilliseconds: { $gte: sevenDaysAgoMilleseconds } }, function (error, results) { return error ? reject(error) : resolve(__spreadArrays(results)); });
        });
    };
    ActivityDb.prototype._archiveActivities = function () { return; };
    ActivityDb.prototype._createDb = function () {
        var dataStoreOptions = { filename: path_1.join(__dirname, '__datastore.db'), autoload: true };
        this._db = new DataStore(dataStoreOptions);
    };
    return ActivityDb;
}());
exports.ActivityDb = ActivityDb;
//# sourceMappingURL=activity-db.js.map