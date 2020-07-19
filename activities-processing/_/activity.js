"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Activity = /** @class */ (function () {
    function Activity(data) {
        this._data = data;
    }
    Object.defineProperty(Activity.prototype, "dateModifiedMilliseconds", {
        get: function () {
            return this._data.fileStat.mtimeMs;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Activity.prototype, "name", {
        get: function () {
            return this._data.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "_extension", {
        get: function () {
            return this._data.name.substring(this._data.name.lastIndexOf('.') + 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "__type", {
        get: function () {
            return 'activity';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "group", {
        get: function () {
            switch (this._extension) {
                case 'csv':
                    return 'CSV';
                case 'docx':
                case 'doc':
                case 'docm':
                case 'dot':
                case 'dotx':
                case 'odt':
                case 'xps':
                    return 'Word';
                case 'html':
                case 'htm':
                case 'mhtm':
                case 'mhtml':
                    return 'Webpage';
                case 'ods':
                case 'xls':
                case 'xlsm':
                case 'xlsx':
                case 'xlsb':
                case 'xlw':
                case 'xlr':
                case 'xlam':
                    return 'Excel';
                case 'odp':
                case 'ppt':
                case 'pptx':
                case 'pps':
                case 'ppsm':
                case 'ppsx':
                    return 'Powerpoint';
                case 'rtf':
                case 'txt':
                    return 'Text';
                case 'bmp':
                case 'gif':
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'tif':
                    return 'Picture';
                case 'mpp':
                case 'xer':
                case 'xml':
                    return 'Project';
                case 'dxf':
                case 'dwf':
                case 'dwf':
                    return 'CAD';
                default:
                    return 'Others';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "data", {
        get: function () {
            return {
                name: this.name,
                dateModified: new Date(this.dateModifiedMilliseconds).toLocaleDateString(),
                dateModifiedMilliseconds: this.dateModifiedMilliseconds,
                __type: this.__type,
                extension: this._extension,
                group: this.group
            };
        },
        enumerable: true,
        configurable: true
    });
    return Activity;
}());
exports.Activity = Activity;
//# sourceMappingURL=activity.js.map