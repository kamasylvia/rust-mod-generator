import * as vscode from 'vscode';
import * as fs from "fs";
const insertLine = require('insert-line')

export async function autoDeclare(resource: vscode.Uri, modName: string, modifier: string) {
    const text = `${modifier}mod ${modName};`;
    const relativePath = vscode.workspace.asRelativePath(resource);
    await insertLine(resource.fsPath).prepend(text).then((err: any) => {
        if (err) {
            vscode.window.showErrorMessage(`Failed to declare the mod "${modName}" in ${relativePath}"`);
        } else {
            vscode.window.showInformationMessage(`Successfully declare the mod "${modName}" in ${relativePath}"`);
        }
    });
}