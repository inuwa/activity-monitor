"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var platform_folders_1 = require("platform-folders");
var path_1 = require("path");
var FileMaker = /** @class */ (function () {
    function FileMaker() {
    }
    FileMaker.prototype.writeFileToFolder = function (fileName, buffer, filePath) {
        var downloadsFolder = platform_folders_1.getDownloadsFolder();
        var dirPath = (filePath) ? filePath : path_1.join(downloadsFolder, fileName);
        fs_1.writeFile(dirPath, buffer, function (error) {
            if (error)
                throw error;
            console.log('File Saved Successfully');
        });
    };
    FileMaker.prototype.saveTemplateFile = function (filePath, destFilePath) {
        return new Promise(function (resolve, reject) {
            fs_1.copyFile(filePath, destFilePath, function (error) {
                (error) ? reject(error) : resolve('file saved');
            });
        });
    };
    ;
    return FileMaker;
}());
exports.FileMaker = FileMaker;
//# sourceMappingURL=file-maker.js.map