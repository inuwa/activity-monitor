import { ActivityDbTemplate } from '../_/interfaces/activity-db-template.interface'
export class Activity {
    name: string;
    dateModified: Date;
    dateModifiedMilliseconds: number;
    extension: string;
    group: string;
    constructor(data: ActivityDbTemplate) {
        this.name = data.name;
        this.dateModified = data.dateModified;
        this.dateModifiedMilliseconds = data.dateModifiedMilliseconds;
        this.extension = data.extension;
        this.group = data.group;
    }


    get __type(): string {
        return 'activity';
    }

    get data() {
        return JSON.stringify({
            name: this.name,
            dateModified: this.dateModified,
            dateModifiedMilliseconds: this.dateModifiedMilliseconds,
            __type: this.__type,
            group: this.group
        })
    }
}