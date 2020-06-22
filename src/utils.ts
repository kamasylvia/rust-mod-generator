import * as vscode from 'vscode';

export async function fileExists(uri: vscode.Uri): Promise<boolean> {
    return await vscode.workspace.fs.stat(uri).then(stat => stat.type ? true : false).then(undefined, isRejected => !isRejected);
}

export async function focusOnFile(uri: vscode.Uri) {
    await vscode.workspace.openTextDocument(uri).then(doc => vscode.window.showTextDocument(doc));
}