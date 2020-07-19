"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var platform_folders_1 = require("platform-folders");
var path_1 = require("path");
var activity_1 = require("./_/activity");
var date_compare_1 = require("./_/date-compare");
var file_extension_1 = require("./_/file-extension");
var ReadActivities;
(function (ReadActivities) {
    var _listOfItems = [];
    var _paths = [platform_folders_1.getDocumentsFolder(), platform_folders_1.getDownloadsFolder()];
    function getActivities() {
        _paths.forEach(function (dirPath) {
            _getActivities(dirPath);
        });
        return _listOfItems;
    }
    ReadActivities.getActivities = getActivities;
    function _getActivities(dirPath) {
        var listOfItems = fs_1.readdirSync(dirPath, { encoding: 'utf-8', withFileTypes: true });
        listOfItems.filter(function (dirent) { return !dirent.name.startsWith('.') || dirent.name.indexOf('node_modules') < 0; }).forEach(function (dirent) {
            if (dirent.isDirectory()) {
                var _dirPath = path_1.join(dirPath, dirent.name);
                _getActivities(_dirPath);
            }
            if (!file_extension_1.FileMethods.shouldBeStored(dirent.name))
                return;
            var fileStat;
            try {
                fileStat = fs_1.statSync(path_1.join(dirPath, dirent.name));
            }
            catch (exception) {
                console.log(exception);
            }
            if (!fileStat || !date_compare_1.DateCompare.isToday(fileStat.mtimeMs))
                return;
            var activity = new activity_1.Activity({ name: dirent.name, fileStat: fileStat });
            _listOfItems.push(activity);
        });
    }
})(ReadActivities = exports.ReadActivities || (exports.ReadActivities = {}));
//# sourceMappingURL=read-activities.js.map