import { Component, OnInit, Input, Output, ContentChild, TemplateRef } from '@angular/core';
import { TreeViewService } from '../service/treeview.service';
import { TreeStyle } from '../_/enum/tree-style.enum';
import { EventEmitter } from 'events';
import { TreeData } from '../_/interface/tree-data.interface';
@Component({
    selector: 'tree-view',
    templateUrl: './tree-view.component.html',
    styleUrls: ['./tree-view.component.scss'],
})
export class TreeViewComponent implements OnInit {
    @Input('data') data: any;
    @Output('nodeClick') nodeClickEmitter: any = new EventEmitter();
    @ContentChild('nodeTemplate') nodeTemplate: TemplateRef<any>;
    @Input('treeStyle') treeStyle: TreeStyle;
    constructor(private _treeService: TreeViewService) { }

    ngOnInit() {
        this._treeService.register(this);
        if (!this.treeStyle) this.treeStyle = TreeStyle.Default;
    }

}
