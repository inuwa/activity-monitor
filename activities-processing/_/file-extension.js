"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileMethods;
(function (FileMethods) {
    function shouldBeStored(name) {
        var fileExtensions = ['csv', 'docx', 'doc', 'docm', 'dot', 'dotx', 'odt', 'xps', 'html', 'htm', 'mhtm', 'mhtml', 'ods', 'xls', 'xlsm', 'xlsx', 'xlsb', 'xlw', 'xlr', 'xlam', 'odp', 'ppt', 'pptx', 'pps', 'ppsm', 'ppsx', 'rtf', 'txt', 'bmp', 'gif', 'jpg', 'jpeg', 'png', 'tif', 'mpp', 'xer', 'xml', 'dxf', 'dwf', 'dwf'];
        return fileExtensions.some(function (e) { return name.endsWith(e); });
    }
    FileMethods.shouldBeStored = shouldBeStored;
})(FileMethods = exports.FileMethods || (exports.FileMethods = {}));
//# sourceMappingURL=file-extension.js.map