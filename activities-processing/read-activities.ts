import { readFile, readdirSync, readdir, Dirent, statSync, Stats } from 'fs';
import { getDocumentsFolder, getDownloadsFolder } from 'platform-folders';
import { join } from 'path';
import { Activity } from './_/activity';
import { DateCompare } from './_/date-compare';
import { FileMethods } from './_/file-extension';
export namespace ReadActivities {
    const _listOfItems: Activity[] = [];


    export function getActivities(): Activity[] {
        // const dirPath = getDocumentsFolder();
        const dirPath = getDownloadsFolder();
        _getActivities(dirPath);
        return _listOfItems;
    }

    function _getActivities(dirPath: string) {
        const listOfItems: Dirent[] = readdirSync(dirPath, { encoding: 'utf-8', withFileTypes: true });

        listOfItems.filter(dirent => !dirent.name.startsWith('.') || dirent.name.indexOf('node_modules') < 0).forEach(
            (dirent: Dirent) => {
                if (dirent.isDirectory()) {
                    const _dirPath = join(dirPath, dirent.name);
                    _getActivities(_dirPath);
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
                _listOfItems.push(activity);
            }
        )
    }

    /**
     * interface Activity {
     *      name: string;
     *     dateModified: string;
     *     __type: string,
     *    group: string
     *  }
     */
}