import { Activity } from '../activity';

export interface ActivityGroup {
    group: string;
    documents: Activity[];
}