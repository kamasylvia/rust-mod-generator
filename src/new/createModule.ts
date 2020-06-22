import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { fileExists } from "../utils";


export async function getModName(uri: vscode.Uri, rootUri: vscode.Uri): Promise<string | undefined> {
    return vscode.window.showInputBox({ placeHolder: "<directory name> or <file name>.rs", prompt: "Enter the mod name. If the input ends with .rs, a single .rs file will be created, else a new subdirectory with mod.rs will be created.", value: "mod_name(.rs)" }).then(async modName => {
        if (!modName) {
            return;
        }

        let modUri = vscode.Uri.joinPath(rootUri, modName);

        if (modName.endsWith(".rs")) {
            // Check if the mod already exists.
            if (await fileExists(modUri) || await fileExists(vscode.Uri.joinPath(rootUri, path.basename(modName, ".rs")))) {
                const err = `The mod "${path.basename(modName, ".rs")}" already exists.`;
                vscode.window.showErrorMessage(err);
                throw new Error(err);
            }

            await createModule(modUri, false);

        } else {
            // Check if the mod already exists.
            if (await fileExists(modUri) || await fileExists(vscode.Uri.file(modUri.fsPath + ".rs"))) {
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
        fs.promises.mkdir(uri.fsPath);
        uri = vscode.Uri.joinPath(uri, "mod.rs");
    }

    // Create the file.
    (await fs.promises.open(uri.fsPath, "w")).close();

    // Focus on the new created file.
    const autoFocus = vscode.workspace.getConfiguration("rust-mod-generator").get("autoFocus");
    if (autoFocus) {
        await vscode.workspace.openTextDocument(uri).then(doc => vscode.window.showTextDocument(doc));
    }
}