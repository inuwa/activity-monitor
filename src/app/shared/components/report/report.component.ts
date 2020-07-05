import { Component, OnInit, Input } from '@angular/core';
import { ReportService } from '../service/report.service';
import { ElectronService } from '../../../core/services';
import { Activity } from '../../../_/activity';
@Component({
    selector: 'report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
    providers: [ReportService]
})
export class ReportComponent implements OnInit {
    @Input() chosenActivities: Activity[];
    constructor(private _electronService: ElectronService) { }

    ngOnInit(): void {
        console.log(this.chosenActivities);
    }
    $$sendReport() {
        if (!this.chosenActivities) return;
        this._electronService.ipcRenderer.send('save-file', this.chosenActivities);
        // this._reportService.createReport('some sting');
    }
}
