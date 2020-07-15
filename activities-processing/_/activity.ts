import { FileData } from './file-data.interface';

export class Activity {
    private _data: FileData;

    get dateModified() {
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

    get data() {
        return {
            name: this.name,
            dateModified: new Date(this.dateModified).toLocaleDateString(),
            dateModifiedMilliseconds: this.dateModified,
            __type: this.__type,
            extension: this._extension,
            group: this.group
        };
    }
}