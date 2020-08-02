import { writeFile, copyFile, PathLike } from 'fs';
import { getDownloadsFolder } from 'platform-folders';
import { join } from 'path';
export class FileMaker {
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
