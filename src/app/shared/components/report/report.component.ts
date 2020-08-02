import { Component, OnInit, Input } from '@angular/core';
import { ElectronService } from '../../../core/services';
import { Activity } from '../../../_/activity';
@Component({
    selector: 'report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
    @Input() chosenActivities: Activity[];
    closeAlert: boolean = false;
    templateSelected: boolean = false;
    constructor(private _electronService: ElectronService) { }

    ngOnInit(): void { }

    $$saveTemplate($event) {
        if ($event.target.files && $event.target.files.length) {
            const [templateFile] = $event.target.files;
            this._electronService.ipcRenderer.send('save-template-file', templateFile.path);
            this.templateSelected = true;
        }

    }

    $$sendReport() {
        if (!this.chosenActivities) return;
        this._electronService.ipcRenderer.send('save-file', this.chosenActivities);
        this.closeAlert = true;
    }

    $$close() {
        this.closeAlert = true;
    }
}
