import * as DataStore from 'nedb';
import { DataStoreOptions } from 'nedb';
import { join } from 'path';
import { promises } from 'fs';
import { Activity } from './_/activity';
import { FileData } from './_/file-data.interface';
import { promisify } from 'util';
import { ActivityDbTemplate } from './_/interface/activity-db-template.interface';

export class ActivityDb {
    private _db: DataStore;
    private readonly _millisecondsInADay: number = 86400000;

    constructor() {
        this._createDb();
    }



    deleteActivities() {

    }

    insertActivities(activities: Activity[]) {
        if (!this._db) throw Error('Database not instantiated');
        const _activities = activities.map(e => e.data);
        console.log(_activities);
        this._db.insert(_activities, (error, _activities) => {
            if (error) throw error;
            console.log('files inserted');
        });
    }

    getActivities(): Promise<any> {
        if (!this._db) throw Error('Database not instantiated.');
        const today = new Date();
        const sevenDaysAgoMilleseconds: number = today.getTime() - (this._millisecondsInADay * 7);
        return new Promise((resolve, reject) => {
            this._db.find({ dateModifiedMilliseconds: { $gte: sevenDaysAgoMilleseconds } },
                (error: Error, results: ActivityDbTemplate[]) => error ? reject(error) : resolve([...results])
            );
        });
    }

    private _archiveActivities() { return; }

    private _createDb() {
        const dataStoreOptions: DataStoreOptions = { filename: join(__dirname, '__datastore.db'), autoload: true }
        this._db = new DataStore(dataStoreOptions);
    }
}
