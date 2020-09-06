import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, Output, HostListener, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { HomeService } from '../../../home/home.service';
import { Subscription } from 'rxjs';
import { GroupedActivity } from '../../../_/interfaces/grouped-activity.interface';
import { TreeData } from '../_/interface/tree-data.interface';
import { TreeViewService } from '../service/treeview.service';
import { TreeNodeComponent } from '../tree-node/tree-node.component';
import { Activity } from '../../../_/activity';
@Component({
    selector: 'list-activities',
    templateUrl: './list-activities.component.html',
    styleUrls: ['./list-activities.component.scss'],
    providers: [TreeViewService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListActivitiesComponent implements OnInit, OnDestroy {
    root: TreeData<any>;
    selected: boolean;
    closeAlert: boolean;
    private _subscription: Subscription;
    @Output('report') _reportEmitter: EventEmitter<Activity[]> = new EventEmitter<Activity[]>();
    @ViewChildren('document', { read: ElementRef }) checkboxes!: QueryList<ElementRef>;
    constructor(private _homeService: HomeService, private _changeDetectorRef: ChangeDetectorRef) { }

    @HostListener('click', ['$event']) $$captureEvents($event) {
        const values = this.checkboxes.filter(e => e.nativeElement.checked);
        this.selected = (values.length) ? true : false;
        this.closeAlert = (values.length) ? true : false;
    }

    ngOnInit() {
        this.loadActivities();
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
        this._subscription = null;
    }

    $$close() {
        this.closeAlert = false;
    }

    $$toggle(node: TreeNodeComponent) {
        node.$$toggleChildren();
        this._changeDetectorRef.detectChanges();
    }

    $$produceReport() {
        const chosenActivities = this.checkboxes.filter(e => e.nativeElement.checked)
            .map(e => JSON.parse(e.nativeElement.value));
        this._reportEmitter.emit(chosenActivities);
    }

    loadActivities() {
        this._subscription = this._homeService.getGroupedActivities$().subscribe((groupedActivities: GroupedActivity[]) => {
            this.root = this._getTree(groupedActivities);
            console.log(groupedActivities);
            this._changeDetectorRef.detectChanges();
        });
    }

    private _getTree(data: Array<any>): TreeData<any> {
        return {
            children: data,
            parent: null,
            isRoot: true,
            state: true
        };
    }
}
