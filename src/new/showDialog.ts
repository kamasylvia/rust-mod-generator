import * as vscode from 'vscode';
import * as fs from "fs";
import * as path from "path";
import { createModule } from "./createModule";

export async function showDialog(originUri: vscode.Uri) {
    let uri = originUri ? originUri : vscode.window.activeTextEditor?.document.uri;
    if (!uri) {
        vscode.window.showErrorMessage("Please focus on a .rs file .. or just right-click on a .rs file and use the context menu!");
        throw new Error("Please focus on a .rs file .. or just right-click on a .rs file and use the context menu!");
    }

    let rootPath = path.dirname(uri.fsPath);
    let rootUri = vscode.Uri.file(rootPath);

    let modUri = await getModUri(uri, rootUri);
    let isPub = await vscode.window.showQuickPick(["private(default)", "pub"], { placeHolder: "pub" }).then(modifier => modifier === "pub" ? true : false);

    vscode.window.showInformationMessage("Is pub? " + isPub);
}

async function getModUri(uri: vscode.Uri, rootUri: vscode.Uri): Promise<vscode.Uri | undefined> {
    return vscode.window.showInputBox({ placeHolder: "<directory name> or <file name>.rs", prompt: "Enter the mod name. If the input ends with .rs, a single .rs file will be created, else a new subdirectory with mod.rs will be created.", value: "mod_name(.rs)" }).then(async modName => {
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
        return modUri;
    });
}