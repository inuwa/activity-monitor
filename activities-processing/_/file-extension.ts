export namespace FileMethods {
    export function shouldBeStored(name: string) {
        const fileExtensions: string[] = ['csv', 'docx', 'doc', 'docm', 'dot', 'dotx', 'odt', 'xps', 'html', 'htm', 'mhtm', 'mhtml', 'ods', 'xls', 'xlsm', 'xlsx', 'xlsb', 'xlw', 'xlr', 'xlam', 'odp', 'ppt', 'pptx', 'pps', 'ppsm', 'ppsx', 'rtf', 'txt', 'bmp', 'gif', 'jpg', 'jpeg', 'png', 'tif', 'mpp', 'xer', 'xml', 'dxf', 'dwf', 'dwf'];

        return fileExtensions.some(e => name.endsWith(e));
    }
}