import * as vscode from 'vscode';
import * as fs from "fs";
import * as path from "path";
import { createModule } from "./createModule";

export async function showModuleNameDialog(originUri: vscode.Uri) {
    let uri = originUri ? originUri : vscode.window.activeTextEditor?.document.uri;
    if (!uri) {
        vscode.window.showErrorMessage("Please focus on a .rs file .. or just right-click on a .rs file and use the context menu!");
        throw new Error("Please focus on a .rs file .. or just right-click on a .rs file and use the context menu!");
    }

    let rootPath = path.dirname(uri.fsPath);
    let rootUri = vscode.Uri.file(rootPath);

    vscode.window.showInputBox({ placeHolder: "<directory name> or <file name>.rs", prompt: "Enter the mod name. If the input ends with .rs, a single .rs file will be created, else a new subdirectory with mod.rs will be created.", value: "my_mod" }).then(async modName => {
        if (!modName || !uri) {
            return;
        }

        let modUri = vscode.Uri.joinPath(rootUri, modName);

        if (modName.endsWith(".rs")) {
            // Check if the mod already exists.
            if (fs.existsSync(modUri.fsPath) ||
                fs.existsSync(vscode.Uri.joinPath(rootUri, path.basename(modName, ".rs")).fsPath)) {
                vscode.window.showErrorMessage("The mod " + path.basename(modName, ".rs") + " already exists.");
                throw new Error("The mod " + path.basename(modName, ".rs") + " already exists.");

            }

            await createModule(modUri, false);

        } else {
            // Check if the mod already exists.
            if (fs.existsSync(modUri.fsPath) ||
                fs.existsSync(modUri.fsPath + ".rs")) {
                vscode.window.showErrorMessage("The mod " + modName + " already exists.");
                throw new Error("The mod " + modName + " already exists.");

            }

            await createModule(modUri, true);
        }
    });
}