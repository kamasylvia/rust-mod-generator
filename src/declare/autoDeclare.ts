import * as vscode from 'vscode';

export async function autoDeclare(resource: vscode.Uri, modName: string, modifier: string) {
    const text = `${modifier}mod ${modName};\n`;
}