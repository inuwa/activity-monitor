"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DateCompare;
(function (DateCompare) {
    var _today = new Date();
    var _millisecondsInADay = 86400000;
    function isToday(thisDate) {
        return (_millisecondsInADay > (_today.getTime() - thisDate));
    }
    DateCompare.isToday = isToday;
    function moreThanSevenDaysAgo(thisDate) {
        var sevenDaysAgo = _millisecondsInADay * 7;
        return ((_today.getTime() - thisDate) < sevenDaysAgo);
    }
    DateCompare.moreThanSevenDaysAgo = moreThanSevenDaysAgo;
})(DateCompare = exports.DateCompare || (exports.DateCompare = {}));
//# sourceMappingURL=date-compare.js.map