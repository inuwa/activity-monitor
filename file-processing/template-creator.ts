import { readFileSync } from 'fs';
import { getDownloadsFolder } from 'platform-folders';
import { join } from 'path';
import { TemplateHandler } from 'easy-template-x';

interface Activity {
    name: string;
    dateModified: string;
    __type: string,
    group: string
}

export class TemplateCreator {
    async createDocx(activities: Activity[]): Promise<any> {
        const downloadsFolder: string = getDownloadsFolder();
        const templatePath: string = join(downloadsFolder, 'arali.docx');
        const templateFile: Buffer = readFileSync(templatePath);
        const handler = new TemplateHandler();
        return handler.process(templateFile, { activities: activities });
    }
}
