import { ActivityGroup } from './activy-group.interface';
import { Activity } from '../activity';
export interface DocumentGroup {
    name: string;
    children: Activity[];
    __type: string;
}
