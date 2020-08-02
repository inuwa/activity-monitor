import * as DataStore from 'nedb';
import { DataStoreOptions } from 'nedb';
import { join } from 'path';
import { Activity } from './_/activity';
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
        // get All activities check that they do not exist in activities
        const today: string = new Date().toLocaleDateString();
        this._db.find({ dateModified: { $in: [today] } }, (error: Error, storedActivities: ActivityDbTemplate[]) => {
            if (error) throw error;
            const _activities = checkNoDuplicates(storedActivities, activities);
            (_activities.length) ? insertActivities(_activities) : doNothing();
        });

        const checkNoDuplicates = (storedActivities: ActivityDbTemplate[], activities: Activity[]) => {
            return (storedActivities && storedActivities.length) ? activities.filter(acvty => {
                return (storedActivities.find(sa => sa.name === acvty.data.name)) ? false : true;
            }).map(e => e.data) : activities.map(e => e.data);
        }

        const insertActivities = (activities: ActivityDbTemplate[]) => {
            this._db.insert(activities, (error: Error, _activities: ActivityDbTemplate[]) => {
                if (error) throw error;
                console.log('files inserted');
            });
        }

        const doNothing = () => { return; };
    }

    getActivities(): Promise<ActivityDbTemplate[]> {
        if (!this._db) throw Error('Database not instantiated.');
        const today = new Date();
        const sevenDaysAgoMilleseconds: number = today.getTime() - (this._millisecondsInADay * 7);
        return new Promise((resolve, reject) => {
            this._db.find({ dateModifiedMilliseconds: { $gte: sevenDaysAgoMilleseconds } },
                (error: Error, activities: ActivityDbTemplate[]) => error ? reject(error) : resolve([...activities])
            );
        });
    }

    private _archiveActivities() { return; }

    private _createDb() {
        const dataStoreOptions: DataStoreOptions = { filename: join(__dirname, '__datastore.db'), autoload: true }
        this._db = new DataStore(dataStoreOptions);
    }
}
