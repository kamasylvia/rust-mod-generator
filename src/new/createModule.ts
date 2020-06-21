import * as vscode from "vscode";
import * as fs from "fs";
import path = require("path");


export async function getModName(uri: vscode.Uri, rootUri: vscode.Uri): Promise<string | undefined> {
    return vscode.window.showInputBox({ placeHolder: "<directory name> or <file name>.rs", prompt: "Enter the mod name. If the input ends with .rs, a single .rs file will be created, else a new subdirectory with mod.rs will be created.", value: "mod_name(.rs)" }).then(async modName => {
        if (!modName) {
            return;
        }

        let modUri = vscode.Uri.joinPath(rootUri, modName);

        if (modName.endsWith(".rs")) {
            // Check if the mod already exists.
            if (fs.existsSync(modUri.fsPath) ||
                fs.existsSync(vscode.Uri.joinPath(rootUri, path.basename(modName, ".rs")).fsPath)) {
                const err = `The mod "${path.basename(modName, ".rs")}" already exists.`;
                vscode.window.showErrorMessage(err);
                throw new Error(err);
            }

            await createModule(modUri, false);

        } else {
            // Check if the mod already exists.
            if (fs.existsSync(modUri.fsPath) ||
                fs.existsSync(modUri.fsPath + ".rs")) {
                const err = `The mod "${modName}" already exists.`;
                vscode.window.showErrorMessage(err);
                throw new Error(err);
            }

            await createModule(modUri, true);
        }

        return modName;
    });
}

async function createModule(uri: vscode.Uri, isDir = false) {
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
    const autoFocus = vscode.workspace.getConfiguration("rust-mod-generator").get("autoFocus");
    if (autoFocus) {
        await vscode.workspace.openTextDocument(uri).then(doc => vscode.window.showTextDocument(doc));
    }
}