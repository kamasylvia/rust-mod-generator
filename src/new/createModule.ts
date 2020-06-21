import * as vscode from "vscode";
import * as fs from "fs";

export async function createModule(uri: vscode.Uri, isDir = false) {
    if (isDir) {
        // Create the directory.
        fs.mkdir(uri.fsPath, (err) => {
            if (err) {
                vscode.window.showErrorMessage(err.message);
            }
        });
        uri = vscode.Uri.joinPath(uri, "mod.rs");
    }

    // Create the file.
    fs.open(uri.fsPath, "w", (err, fd) => {
        if (err) {
            vscode.window.showErrorMessage(err.message);
            throw new Error(err.message);
        }
        fs.close(fd, (err) => {
            if (err) {
                vscode.window.showErrorMessage(err.message);
                throw new Error(err.message);
            }
        });
    });


    // Focus on the new created file.
    await vscode.workspace.openTextDocument(uri).then(doc => vscode.window.showTextDocument(doc));
}