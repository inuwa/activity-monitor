import { readFile, readdirSync, readdir, Dirent, statSync, Stats } from 'fs';
import { getDocumentsFolder } from 'platform-folders';
import { join } from 'path';
import { Activity } from './_/activity';
export class ReadActivities {
    private _listOfItems: Activity[] = [];
    getActivities() {
        const dirPath = getDocumentsFolder();
        // const listOfItems: string[] = readdirSync(dirPath, { encoding: 'utf-8' });
        this._getActivities(dirPath);
        console.log(this._listOfItems);
    }

    private _getActivities(dirPath: string) {
        const listOfItems: Dirent[] = readdirSync(dirPath, { encoding: 'utf-8', withFileTypes: true });
        listOfItems.forEach((dirent: Dirent) => {
            if (dirent.isDirectory()) {
                const _dirPath = join(dirPath, dirent.name);
                return this._getActivities(_dirPath);
            }
            if (!this._shouldBeStored(dirent.name)) return;
            const fileStats: Stats = statSync(join(dirPath, dirent.name));
            const activity = new Activity({ name: dirent.name, fileStat: fileStats });
            // get the stats name details
            return this._listOfItems.push(activity);

        });
    }

    /**
     * interface Activity {
     *      name: string;
     *     dateModified: string;
     *     __type: string,
     *    group: string
     *  }
     */

    private _shouldBeStored(filename: string): boolean {
        const fileExtensions: string[] = ['csv', 'docx', 'doc', 'docm', 'dot', 'dotx', 'odt', 'xps', 'html', 'htm', 'mhtm', 'mhtml', 'ods', 'xls', 'xlsm', 'xlsx', 'xlsb', 'xlw', 'xlr', 'xlam', 'odp', 'ppt', 'pptx', 'pps', 'ppsm', 'ppsx', 'rtf', 'txt', 'bmp', 'gif', 'jpg', 'jpeg', 'png', 'tif', 'mpp', 'xer', 'xml', 'dxf', 'dwf', 'dwf'];

        return fileExtensions.some(e => filename.endsWith(e));
    }
}