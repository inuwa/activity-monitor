"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var platform_folders_1 = require("platform-folders");
var path_1 = require("path");
var ReadActivities = /** @class */ (function () {
    function ReadActivities() {
        this._listOfItems = [];
    }
    ReadActivities.prototype.getActivities = function () {
        var dirPath = platform_folders_1.getDocumentsFolder();
        // const listOfItems: string[] = readdirSync(dirPath, { encoding: 'utf-8' });
        this._getActivities(dirPath);
        console.log(this._listOfItems);
    };
    ReadActivities.prototype._getActivities = function (dirPath) {
        var _this = this;
        var listOfItems = fs_1.readdirSync(dirPath, { encoding: 'utf-8', withFileTypes: true });
        listOfItems.forEach(function (dirent) {
            if (!dirent.isDirectory())
                return _this._listOfItems.push(dirent.name);
            var _dirPath = path_1.join(dirPath, dirent.name);
            _this._getActivities(_dirPath);
        });
    };
    return ReadActivities;
}());
exports.ReadActivities = ReadActivities;
//# sourceMappingURL=read-activities.js.map