import * as vscode from "vscode";
import * as fs from "fs";
const insertLine = require("insert-line");

export async function autoDeclare(
    resource: vscode.Uri,
    modName: string,
    modifier: string
) {
    const text = `${modifier}mod ${modName};`;
    const relativePath = vscode.workspace.asRelativePath(resource);

    // Convert Uri to filesystem path
    const filePath = resource.fsPath;

    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    let lastCrateAttrIndex = -1;

    // Find last crate attribute line
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Match crate attribute lines (ignoring comments)
        if (line.startsWith('#![') && !line.startsWith('//')) {
            lastCrateAttrIndex = i;
        } else if (line.length > 0 && !line.startsWith('//')) {
            // Stop at first non-empty, non-comment line
            break;
        }
    }

    // Insert content after crate attributes
    const insertPosition = lastCrateAttrIndex + 1;
    lines.splice(insertPosition, 0, text);

    // Write updated content back to file
    await fs.promises.writeFile(filePath, lines.join('\n'), 'utf8').then(() => {
        vscode.window.showInformationMessage(
            `Successfully declare the mod "${modName}" in ${relativePath}"`
        );
    }).catch((err) => {
        vscode.window.showErrorMessage(
            `Failed to declare the mod "${modName}" in ${relativePath}"`
        );
    });

    /*     await insertLine(resource.fsPath)
            .prepend(text)
            .then((err: any) => {
                if (err) {
                    vscode.window.showErrorMessage(
                        `Failed to declare the mod "${modName}" in ${relativePath}"`
                    );
                } else {
                    vscode.window.showInformationMessage(
                        `Successfully declare the mod "${modName}" in ${relativePath}"`
                    );
                }
            }); */
}
