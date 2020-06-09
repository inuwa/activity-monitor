import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'list-activities',
    templateUrl: './list-activities.component.html',
    styleUrls: ['./list-activities.component.css']
})
export class ListActivitiesComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
        console.log('I am hee');
    }
}
