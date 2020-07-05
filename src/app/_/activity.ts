export class Activity {
    name: string;
    dateModified: Date;

    constructor(data: { name: string, dateModified: Date }) {
        this.name = data.name;
        this.dateModified = data.dateModified;
    }

    private get _extension(): string {
        return this.name.substring(this.name.lastIndexOf('.') + 1);
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
        return JSON.stringify({
            name: this.name,
            dateModified: this.dateModified,
            __type: this.__type,
            group: this.group
        })
    }
}