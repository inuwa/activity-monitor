import { Component, HostListener, OnChanges } from '@angular/core';
import { HomeService } from './home.service';
import { Activity } from '../_/activity';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnChanges {
    activityCheck = {
        menu: true,
        activities: false,
        report: false,
        email: false
    };
    chosenActivities: Activity[];
    @HostListener('click', ['$event']) changeComponentState($event: MouseEvent) {
        const target = (<HTMLDivElement>$event.target);
        switch (target.id) {
            case 'activities':
            case 'email':
            case 'home':
            case 'menu':
            case 'report':
                this.$$changeComponentState(target.id);
                break;
            default:
                break;
        }
    }

    $$changeComponentState(id: string) {
        this._homeService.changeComponentState(id);
        this.activityCheck = this._homeService.activityCheck;

    }

    $$createReport(chosenActivities: Activity[]) {
        this.chosenActivities = chosenActivities;
        console.log(this.chosenActivities);
        this.$$changeComponentState('report');
    }

    constructor(private _homeService: HomeService) { }

    ngOnChanges() {
        this.activityCheck = this._homeService.activityCheck;
    }
}
