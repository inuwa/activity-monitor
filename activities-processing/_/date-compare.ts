export namespace DateCompare {
    const _today: Date = new Date();
    const _millisecondsInADay = 86400000;

    export function isToday(thisDate: number): boolean {
        return (_millisecondsInADay > (_today.getTime() - thisDate));
    }

    export function moreThanSevenDaysAgo(thisDate: number) {
        const sevenDaysAgo: number = _millisecondsInADay * 7;
        return ((_today.getTime() - thisDate) < sevenDaysAgo);
    }
}