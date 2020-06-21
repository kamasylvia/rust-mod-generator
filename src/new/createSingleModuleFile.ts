import * as vscode from "vscode";
import * as fs from "fs";

export async function createSingleModuleFile(uri: vscode.Uri) {
    fs.openSync(uri.fsPath, "w");
    await vscode.workspace.openTextDocument(uri).then(doc => vscode.window.showTextDocument(doc));
}