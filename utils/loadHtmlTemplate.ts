import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

export const loadHtmlTemplate = (
    templateName: string,
    values: Record<string, unknown>
): string => {
    const filePath = path.join(process.cwd(), 'templates', `${templateName}.html`);
    const source = fs.readFileSync(filePath, 'utf8');
    const template = handlebars.compile(source);
    return template(values);
};