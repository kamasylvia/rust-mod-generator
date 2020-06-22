// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from "path";
import { getModName } from "./new/createModule";
import { autoDeclare } from './declare/autoDeclare';
import { fileExists, focusOnFile } from "./utils";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	vscode.commands.registerCommand('rust-mod-generator.showModuleNameDialog',
		async (originUri: vscode.Uri) => {
			let uri = originUri ? originUri : vscode.window.activeTextEditor?.document.uri;
			if (!uri) {
				const err = "Please focus on a .rs file .. or just right-click on a .rs file and use the context menu!";
				vscode.window.showErrorMessage(err);
				throw new Error(err);
			}

			const rootPath = path.dirname(uri.fsPath);
			const rootUri = vscode.Uri.file(rootPath);

			const mod = await getModName(uri, rootUri);
			if (!mod?.modName) {
				return;
			}

			let modifier = "";

			const allowAutoDeclare = vscode.workspace.getConfiguration("rust-mod-generator").get("addModDeclaration");
			const allowSetModifier = vscode.workspace.getConfiguration("rust-mod-generator").get("selectAccessModifier");
			if (allowSetModifier && allowAutoDeclare) {
				modifier = await vscode.window.showQuickPick(["private(default)", "pub"], { placeHolder: "Select an access modifier for your module." }).
					then(modifier => modifier === "pub" ? "pub " : "");
			}

			if (allowAutoDeclare) {
				let resourceUri = uri;
				const libUri = vscode.Uri.joinPath(rootUri, "lib.rs");
				const modUri = vscode.Uri.joinPath(rootUri, "mod.rs");
				if (await fileExists(libUri) && await fileExists(modUri)) {
					const err = `Both "lib.rs" and "mod.rs" are found. Please check your project structure.`;
					vscode.window.showErrorMessage(err);
					throw new Error(err);
				}
				else if (await fileExists(modUri)) {
					resourceUri = modUri;
				}
				else if (await fileExists(libUri)) {
					resourceUri = libUri;
				}
				await autoDeclare(resourceUri, mod.modName, modifier);
			}
			await focusOnFile(mod.modUri);
		});
}


// this method is called when your extension is deactivated
export function deactivate() { }
