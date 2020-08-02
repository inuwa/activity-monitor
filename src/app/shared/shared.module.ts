import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { ListActivitiesComponent } from './components/list-activities/list-activities.component';
import { TreeViewComponent as TreeViewComponent } from './components/tree-view/tree-view.component';
import { TreeNodeComponent } from './components/tree-node/tree-node.component';
import { ReportComponent } from './components/report/report.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [PageNotFoundComponent, WebviewDirective, ListActivitiesComponent, TreeViewComponent, TreeNodeComponent, ReportComponent],
    imports: [CommonModule, TranslateModule, FormsModule, NgbAlertModule],
    exports: [TranslateModule, WebviewDirective, FormsModule, ListActivitiesComponent, ReportComponent]
})
export class SharedModule { }
