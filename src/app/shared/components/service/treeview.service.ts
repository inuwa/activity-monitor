import { Injectable } from '@angular/core';
import { TreeViewComponent } from '../tree-view/tree-view.component';
import { TreeNodeComponent } from '../tree-node/tree-node.component';

@Injectable()
export class TreeViewService {
    private _ref: TreeViewComponent;
    private _selectedNode: TreeNodeComponent;

    register(ref: TreeViewComponent) {
        this._ref = ref;
    }

    emit(item: any) {
        this._ref.nodeClickEmitter.emit(item);
    }

    select(selectedNode: TreeNodeComponent) {
        if (this._selectedNode) {
            this._selectedNode.selected = false;
            this._selectedNode['_changeDetectorRef'].detectChanges();
        }
        this._selectedNode = selectedNode;
        this._selectedNode.selected = true;
        this._ref.nodeClickEmitter.emit(this._selectedNode.data);
        this._selectedNode['_changeDetectorRef'].detectChanges();
    }

    get nodeTemplate() {
        return this._ref.nodeTemplate;
    }

    get treeStyle() {
        return this._ref.treeStyle;
    }
}
