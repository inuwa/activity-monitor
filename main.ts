import { app, BrowserWindow, screen } from 'electron';
import { join } from 'path';
import * as url from 'url';
import { ipcMain } from 'electron';
import { TemplateHandler } from 'easy-template-x';
import { writeFile, copyFile, PathLike, readFileSync, Stats, Dirent, readdirSync, statSync } from 'fs';
import * as DataStore from 'nedb';
import { DataStoreOptions } from 'nedb';
// import { FileMaker } from './file-processing/file-maker';
// import { TemplateCreator } from './file-processing/template-creator';
// import { ReadActivities } from './activities-processing/read-activities';
// import { Activity } from './activities-processing/_/activity';
// import { ActivityDb } from './activities-processing/activity-db';
// import { FileConstants } from './my-constants/file.enum';
import { getDownloadsFolder, getDocumentsFolder } from 'platform-folders';

const _templateLocation = '/file-processing/template/template.docx';
// Interfaces
interface ActivityTemplate {
    name: string;
    dateModified: string;
    __type: string,
    group: string,
    extension: string
}

interface FileData {
    name: string;
    fileStat: Stats
}
interface ActivityDbTemplate {
    name: string;
    dateModified: string;
    dateModifiedMilliseconds: number;
    __type: string;
    extension: string;
    group: string;
}
// End Interfaces

/***
 * Class Declarations
 */
// File Processing
class FileMaker {
    writeFileToFolder(fileName: string, buffer: Buffer, filePath?: string) {
        const downloadsFolder = getDownloadsFolder();
        const dirPath = (filePath) ? filePath : join(downloadsFolder, fileName);
        writeFile(dirPath, buffer, (error) => {
            if (error) throw error;
            console.log('File Saved Successfully');
        });
    }

    saveTemplateFile(filePath: PathLike, destFilePath: PathLike) {
        return new Promise((resolve, reject) => {
            copyFile(filePath, destFilePath, (error) => {
                (error) ? reject(error) : resolve('file saved');
            });
        });
    };
}

class TemplateCreator {
    async createDocx(activities: ActivityTemplate[], templatePath: string): Promise<any> {
        const templateFile: Buffer = readFileSync(templatePath);
        const handler = new TemplateHandler();
        return handler.process(templateFile, { activities: activities });
    }
}
// End File Processing

// Activity Processing
class Activity {
    private _data: FileData;

    get dateModifiedMilliseconds() {
        return this._data.fileStat.mtimeMs;
    };

    get name(): string {
        return this._data.name;
    }

    constructor(data: FileData) {
        this._data = data
    }

    private get _extension(): string {
        return this._data.name.substring(this._data.name.lastIndexOf('.') + 1);
    }

    get __type(): string {
        return 'activity';
    }

    get group(): string {
        switch (this._extension) {
            case 'csv':
                return 'CSV';
            case 'docx':
            case 'doc':
            case 'docm':
            case 'dot':
            case 'dotx':
            case 'odt':
            case 'xps':
                return 'Word';
            case 'html':
            case 'htm':
            case 'mhtm':
            case 'mhtml':
                return 'Webpage';
            case 'ods':
            case 'xls':
            case 'xlsm':
            case 'xlsx':
            case 'xlsb':
            case 'xlw':
            case 'xlr':
            case 'xlam':
                return 'Excel';
            case 'odp':
            case 'ppt':
            case 'pptx':
            case 'pps':
            case 'ppsm':
            case 'ppsx':
                return 'Powerpoint'
            case 'rtf':
            case 'txt':
                return 'Text';
            case 'bmp':
            case 'gif':
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'tif':
                return 'Picture'
            case 'mpp':
            case 'xer':
            case 'xml':
                return 'Project'
            case 'dxf':
            case 'dwf':
            case 'dwf':
                return 'CAD'
            default:
                return 'Others';
        }
    }

    get data(): ActivityDbTemplate {
        return {
            name: this.name,
            dateModified: new Date(this.dateModifiedMilliseconds).toLocaleDateString(),
            dateModifiedMilliseconds: this.dateModifiedMilliseconds,
            __type: this.__type,
            extension: this._extension,
            group: this.group
        };
    }
}

class ActivityDb {
    private _db: DataStore;
    private readonly _millisecondsInADay: number = 86400000;

    constructor() {
        this._createDb();
    }

    private _deleteOldActivities() {
        const sevenDaysAgoMilleseconds: number = new Date().getTime() - (this._millisecondsInADay * 7);
        this._db.remove({ dateModifiedMilliseconds: { $lte: sevenDaysAgoMilleseconds } }, { multi: true }, (error: Error, numberOfDeletedItems) => {
            if (error) throw new Error(error.message);
        });
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
        const sevenDaysAgoMilleseconds: number = new Date().getTime() - (this._millisecondsInADay * 7);
        return new Promise((resolve, reject) => {
            this._deleteOldActivities();
            this._db.find({ dateModifiedMilliseconds: { $gte: sevenDaysAgoMilleseconds } },
                (error: Error, activities: ActivityDbTemplate[]) => error ? reject(error) : resolve([...activities])
            );
        });
    }

    private _createDb() {
        // const dataStoreOptions: DataStoreOptions = { filename: join(__dirname, '__datastore.db'), autoload: true }
        const dataStoreOptions: DataStoreOptions = { filename: join(getDocumentsFolder(), '/activity-monitor/__datastore.db'), autoload: true }
        this._db = new DataStore(dataStoreOptions);
    }
}
class ReadActivities {
    private _listOfItems: Activity[] = [];
    private _paths: string[] = [getDocumentsFolder(), getDownloadsFolder()];
    private _today: Date = new Date();
    private _millisecondsInADay = 86400000;
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

                if (!this._shouldBeStored(dirent.name)) return;
                let fileStat: Stats;
                try {
                    fileStat = statSync(join(dirPath, dirent.name));
                } catch (exception) {
                    console.log(exception);
                }
                if (!fileStat || !this._isToday(fileStat.mtimeMs)) return;
                const activity = new Activity({ name: dirent.name, fileStat: fileStat });
                this._listOfItems.push(activity);
            }
        )
    }

    private _shouldBeStored(name: string) {
        const fileExtensions: string[] = ['csv', 'docx', 'doc', 'docm', 'dot', 'dotx', 'odt', 'xps', 'html', 'htm', 'mhtm', 'mhtml', 'ods', 'xls', 'xlsm', 'xlsx', 'xlsb', 'xlw', 'xlr', 'xlam', 'odp', 'ppt', 'pptx', 'pps', 'ppsm', 'ppsx', 'rtf', 'txt', 'bmp', 'gif', 'jpg', 'jpeg', 'png', 'tif', 'mpp', 'xer', 'xml', 'dxf', 'dwf', 'dwf'];

        return fileExtensions.some(e => name.endsWith(e));
    }

    private _isToday(thisDate: number): boolean {
        return (this._millisecondsInADay > (this._today.getTime() - thisDate));
    }
}
// End Activity Processing
// End class Declarations
let win: BrowserWindow = null;
const activityDb: ActivityDb = new ActivityDb();
const args = process.argv.slice(1),
    serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    // Create the browser window.
    win = new BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (serve) ? true : false,
        },
        titleBarStyle: 'hidden'
    });

    if (serve) {

        require('devtron').install();
        win.webContents.openDevTools();

        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`),
            ignored: '*.docx'
        });
        win.loadURL('http://localhost:4200');

    } else {
        win.loadURL(url.format({
            pathname: join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }

    win.on('focus', () => { });

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    return win;
}

try {

    app.allowRendererProcessReuse = true;

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    app.on('ready', () => {
        setTimeout(createWindow, 400);
        _insertActivities();
    });

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });

    _applicationMessageReceiver();
    _getActivities();
} catch (e) {
    // Catch Error
    // throw e;
}


function _applicationMessageReceiver() {
    ipcMain.on('save-file', (event, args) => {
        const fileMaker = new FileMaker();
        const templateCreator = new TemplateCreator();
        const templatePath = join(__dirname, _templateLocation);
        templateCreator.createDocx(args, templatePath).then((fileBuffer) => {
            fileMaker.writeFileToFolder('activities.docx', fileBuffer);
        }).catch(e => console.log(e));
    })

    ipcMain.on('save-template-file', (event, filePath) => {
        console.log(filePath, event);

        const fileMaker = new FileMaker();
        const destFilePath = join(__dirname, _templateLocation);
        fileMaker.saveTemplateFile(filePath, destFilePath).then((response: string) => {
            console.log(response);
        }).catch(e => console.log(e));
    });
}

function _insertActivities() {
    const listOfActivities: Activity[] = new ReadActivities().getActivities();
    if (!listOfActivities || !listOfActivities.length) return;
    // store Activities
    activityDb.insertActivities(listOfActivities);
}

function _getActivities() {
    ipcMain.handle('get-activities', async (event, args) => {
        return activityDb.getActivities();
    });
}
