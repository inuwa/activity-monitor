import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';

@Injectable()
export class ReportService {

    constructor() { }

    createReport(reportData: string) {
        console.log('I am sent');
        ipcRenderer.send('synchronous-message', 'ping');
    }
}
