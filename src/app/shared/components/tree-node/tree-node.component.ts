import { Component, OnInit, Input, Output, ContentChild, TemplateRef, ViewChild, HostListener, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { EventEmitter } from 'events';
import { TreeStyle } from '../_/enum/tree-style.enum';
import { TreeData } from '../_/interface/tree-data.interface';
import { TreeViewService } from '../service/treeview.service';
@Component({
    selector: 'tree-node',
    templateUrl: './tree-node.component.html',
    styleUrls: ['./tree-node.component.scss']
})
export class TreeNodeComponent implements OnInit {
    @Input() data: TreeData<any>;
    @Input() depth: number = 0;
    treeNode: TreeNodeComponent;

    selected: boolean = false;
    @ViewChild('nodeChildren', { read: ElementRef, static: false }) nodeChildren: ElementRef<HTMLDivElement>;
    @HostListener('click', ['$event']) $$emitNotifications($event: MouseEvent) {
        // $event.stopPropagation();
        this._treeViewService.select(this);
    }

    _isExpanded: boolean = true;

    get isExpanded() { return this._isExpanded; }
    set isExpanded(y) {
        this._isExpanded = y;
    }

    constructor(private _treeViewService: TreeViewService, private _elementRef: ElementRef, private _renderer: Renderer2, private _changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.treeNode = this;

        if (this._treeViewService.treeStyle === TreeStyle.Bulletin && this.depth > 1)
            this._renderer.addClass(this._elementRef.nativeElement, 'card');
    }

    get nodeTemplate() {
        return this._treeViewService.nodeTemplate;
    }

    get treeStyle() {
        return this._treeViewService.treeStyle;
    }

    private _hideChildren() {
        if (this.nodeChildren)
            this._renderer.addClass(this.nodeChildren.nativeElement, 'hidden');
    }

    private _showChildren() {
        if (this.nodeChildren)
            this._renderer.removeClass(this.nodeChildren.nativeElement, 'hidden');
    }

    $$toggleChildren() {
        if (this.isExpanded) {
            this.isExpanded = false;
            this._hideChildren();
        } else {
            this.isExpanded = true;
            this._showChildren();
        }
        this._changeDetectorRef.detectChanges();
    }
}
