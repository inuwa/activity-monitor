import { Component, OnInit, HostListener, OnChanges } from '@angular/core';
import { HomeService } from './home.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnChanges {
    activityCheck = {
        menu: true,
        activities: false,
        report: false,
        email: false
    };
    @HostListener('click', ['$event']) $$changeComponentState($event: MouseEvent) {
        const target = (<HTMLDivElement>$event.target);
        switch (target.id) {
            // case 'menu':
            //     this._homeService.changeComponentState('menu');
            //     break;
            case 'activities':
                this._homeService.changeComponentState('activities');
                this.activityCheck = this._homeService.activityCheck;
                break;
            default:
                break;
        }
    }

    constructor(private _homeService: HomeService) { }

    ngOnInit(): void {

    }

    ngOnChanges() {
        this.activityCheck = this._homeService.activityCheck;
    }
}
