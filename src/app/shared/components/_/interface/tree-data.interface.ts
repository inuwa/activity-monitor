export interface TreeData<T> {
    children: T[];
    parent: T;
    isRoot: boolean;
    state: boolean;
}