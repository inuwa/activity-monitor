import { Injectable } from '@angular/core';

@Injectable()
export class HomeService {
    private _activityCheck = {
        menu: true,
        activities: false,
        report: false,
        email: false
    };

    get activityCheck() {
        return this._activityCheck;
    }
    constructor() { }

    changeComponentState(id: string) {
        Object.keys(this._activityCheck).forEach(key => {
            if (key === id) this._activityCheck[key] = true;
            else this._activityCheck[key] = false;
        });
    }
}
