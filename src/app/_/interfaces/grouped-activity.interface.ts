import { ActivityGroup } from "./activy-group.interface";
import { DocumentGroup } from './document-group.interface';

export interface GroupedActivity {
    name: Date;
    children: DocumentGroup[];
    __type: string;
}
