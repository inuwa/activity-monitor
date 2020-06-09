import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { ListActivitiesComponent } from './components/list-activities/list-activities.component';

@NgModule({
    declarations: [PageNotFoundComponent, WebviewDirective, ListActivitiesComponent],
    imports: [CommonModule, TranslateModule, FormsModule],
    exports: [TranslateModule, WebviewDirective, FormsModule, ListActivitiesComponent]
})
export class SharedModule { }
