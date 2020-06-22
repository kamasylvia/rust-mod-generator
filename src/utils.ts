import * as vscode from 'vscode';

export async function fileExists(uri: vscode.Uri): Promise<boolean> {
    return await vscode.workspace.fs.stat(uri).then(stat => stat.type ? true : false).then(undefined, isRejected => !isRejected);
}