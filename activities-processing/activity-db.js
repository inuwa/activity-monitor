"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataStore = require("nedb");
var path_1 = require("path");
var util_1 = require("util");
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
        if (!this._db)
            throw Error('Database not instantiated.');
        var today = new Date();
        var sevenDaysAgoMilleseconds = today.getTime() - (this._millisecondsInADay * 7);
        // return this._db.find({ dateModified: { $gt: sevenDaysAgoMilleseconds } });
        var findPromisify = util_1.promisify(this._db.find).apply({ dateModified: { $gt: sevenDaysAgoMilleseconds } });
        console.log(findPromisify);
        return findPromisify();
        // return findPromisify({ dateModified: { $gt: sevenDaysAgoMilleseconds } });
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