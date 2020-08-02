import { readdirSync, Dirent, statSync, Stats } from 'fs';
import { getDocumentsFolder, getDownloadsFolder } from 'platform-folders';
import { join } from 'path';
import { Activity } from './_/activity';
import { DateCompare } from './_/date-compare';
import { FileMethods } from './_/file-extension';
export class ReadActivities {
    private _listOfItems: Activity[] = [];
    private _paths: string[] = [getDocumentsFolder(), getDownloadsFolder()];

    getActivities(): Activity[] {
        this._paths.forEach((dirPath) => {
            this._getActivities(dirPath);
        });

        return this._listOfItems;
    }

    private _getActivities(dirPath: string) {
        const listOfItems: Dirent[] = readdirSync(dirPath, { encoding: 'utf-8', withFileTypes: true });

        listOfItems.filter(dirent => !dirent.name.startsWith('.') || dirent.name.indexOf('node_modules') < 0).forEach(
            (dirent: Dirent) => {
                if (dirent.isDirectory()) {
                    const _dirPath = join(dirPath, dirent.name);
                    this._getActivities(_dirPath);
                }

                if (!FileMethods.shouldBeStored(dirent.name)) return;
                let fileStat: Stats;
                try {
                    fileStat = statSync(join(dirPath, dirent.name));
                } catch (exception) {
                    console.log(exception);
                }
                if (!fileStat || !DateCompare.isToday(fileStat.mtimeMs)) return;
                const activity = new Activity({ name: dirent.name, fileStat: fileStat });
                this._listOfItems.push(activity);
            }
        )
    }
}