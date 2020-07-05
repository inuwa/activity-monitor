import { writeFile } from 'fs';
import { getDownloadsFolder } from 'platform-folders';
import { join } from 'path';
export class FileMaker {
    writeFileToDocumentsFolder(fileName: string, buffer: Buffer) {
        const downloadsFolder = getDownloadsFolder();
        const dirPath = join(downloadsFolder, fileName);
        writeFile(dirPath, buffer, (error) => {
            if (error) throw error;
            console.log('File Saved Successfully');
        });
    }
}