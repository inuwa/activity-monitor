import { readFileSync } from 'fs';
import { TemplateHandler } from 'easy-template-x';

interface Activity {
    name: string;
    dateModified: string;
    __type: string,
    group: string,
    extension: string
}

export class TemplateCreator {
    async createDocx(activities: Activity[], templatePath: string): Promise<any> {
        const templateFile: Buffer = readFileSync(templatePath);
        const handler = new TemplateHandler();
        return handler.process(templateFile, { activities: activities });
    }
}
