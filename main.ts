import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { ipcMain } from 'electron';
import { FileMaker } from './file-processing/file-maker';
import { TemplateCreator } from './file-processing/template-creator';
import { ReadActivities } from './activities-processing/read-activities';
import { Activity } from './activities-processing/_/activity';
import { ActivityDb } from './activities-processing/activity-db';
let win: BrowserWindow = null;
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
    });

    if (serve) {

        require('devtron').install();
        win.webContents.openDevTools();

        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`)
        });
        win.loadURL('http://localhost:4200');

    } else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
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
        templateCreator.createDocx(args).then((fileBuffer) => {
            fileMaker.writeFileToDocumentsFolder('activities.docx', fileBuffer);
        });
    })
}

function _insertActivities() {
    const listOfActivities: Activity[] = ReadActivities.getActivities();
    if (!listOfActivities || !listOfActivities.length) return;
    // store Activities
    const activityDb: ActivityDb = new ActivityDb();
    activityDb.insertActivities(listOfActivities);
}

function _getActivities() {
    ipcMain.handle('get-activities', async (event, args) => {
        const activityDb: ActivityDb = new ActivityDb();
        return activityDb.getActivities();
    });
}