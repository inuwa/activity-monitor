import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { Activity } from '../_/activity';
import { GroupedActivity } from '../_/interfaces/grouped-activity.interface';
import { DocumentGroup } from '../_/interfaces/document-group.interface';
import { ipcRenderer } from 'electron';
import { ActivityDbTemplate } from '../_/interfaces/activity-db-template.interface';
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
        if (id === 'home') id = 'menu';
        Object.keys(this._activityCheck).forEach(key => {
            if (key === id) this._activityCheck[key] = true;
            else this._activityCheck[key] = false;
        });
    }

    getGroupedActivities$(): Observable<GroupedActivity[]> {
        return this._getActivities$().pipe(
            mergeMap(e => of(this._groupActivities(e)))
        );
    }

    private _getActivities$(): Observable<Activity[]> {
        const resultsPromise = ipcRenderer.invoke('get-activities');
        return from(resultsPromise).pipe(
            map((results: ActivityDbTemplate[]) => {
                return results.map(e => new Activity(e));
            })
        );
    }


    // private _getRawActivties(): Activity[] {
    //     const testActivites = [
    //         {
    //             name: 'file.docx',
    //             dateModified: new Date(2019, 10, 7),
    //         }, {
    //             name: 'file.dwg',
    //             dateModified: new Date(2020, 6, 9),
    //         }, {
    //             name: 'file.xlsx',
    //             dateModified: new Date(2017, 6, 7),
    //         }, {
    //             name: 'file.html',
    //             dateModified: new Date(2015, 6, 9),
    //         }, {
    //             name: 'file.pptx',
    //             dateModified: new Date(2024, 8, 8),
    //         },
    //         {
    //             name: 'file.rtf',
    //             dateModified: new Date(2023, 10, 8),
    //         }, {
    //             name: 'file.bmp',
    //             dateModified: new Date(2015, 8, 6),
    //         },
    //         {
    //             name: 'file.xer',
    //             dateModified: new Date(2008, 8, 8),
    //         }, {
    //             name: 'file.dwf',
    //             dateModified: new Date(2003, 9, 9),
    //         }
    //     ]

    //     // return testActivites.map(e => new Activity(e));
    // }

    private _groupActivities(activities: Activity[]): GroupedActivity[] {
        const groupedActivities: GroupedActivity[] = [];
        // group activities and instantiate classes
        const uniqueValues = this._uniqueValues(activities);
        uniqueValues.uniqueDates.forEach(e => {
            const groupedActivity: GroupedActivity = {
                name: e,
                children: [],
                __type: 'group'
            }
            const filteredActivitiesByDate: Activity[] = activities.filter(ga => ga.dateModified === e);
            const groupedAccordingToDate: DocumentGroup[] = uniqueValues.uniqueGroups.map(gatd => {
                return {
                    name: gatd,
                    children: filteredActivitiesByDate.filter(fgbd => fgbd.group === gatd),
                    __type: 'document-group'
                };
            });
            groupedActivity.children = groupedAccordingToDate;
            groupedActivities.push(groupedActivity);
        });
        return groupedActivities;
    }

    private _uniqueValues(groups: Activity[]): { uniqueDates: Date[]; uniqueGroups: string[] } {
        const uniqueDates: Date[] = [];
        const uniqueGroups: string[] = [];
        groups.forEach(e => {
            if (!uniqueDates.find(ud => ud === e.dateModified)) uniqueDates.push(e.dateModified);
            if (!uniqueGroups.find(ug => ug === e.group)) uniqueGroups.push(e.group);
        });
        return { uniqueDates, uniqueGroups };
    }
}
