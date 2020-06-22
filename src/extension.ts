// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import path = require('path');
import { getModName } from "./new/createModule";
import { autoDeclare } from './declare/autoDeclare';
import * as fs from "fs";

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

			const modName = await getModName(uri, rootUri);
			if (!modName) {
				return;
			}

			let modifier = "";

			const allowSetModifier = vscode.workspace.getConfiguration("rust-mod-generator").get("selectAccessModifier");
			if (allowSetModifier) {
				modifier = await vscode.window.showQuickPick(["private(default)", "pub"], { placeHolder: "pub" }).
					then(modifier => modifier === "pub" ? "pub " : "");
			}

			const allowAutooDeclare = vscode.workspace.getConfiguration("rust-mod-generator").get("addModDeclaration");
			if (allowAutooDeclare) {
				let resourceUri = uri;
				const libUri = vscode.Uri.joinPath(rootUri, "lib.rs");
				const modUri = vscode.Uri.joinPath(rootUri, "mod.rs");
				if (fs.existsSync(libUri.fsPath) && fs.existsSync(modUri.fsPath)) {
					const err = `Both "lib.rs" and "mod.rs" are found. Please check your project structure.`;
					vscode.window.showErrorMessage(err);
					throw new Error(err);
				}
				if (fs.existsSync(modUri.fsPath)) {
					resourceUri = modUri;
				}
				else if (fs.existsSync(libUri.fsPath)) {
					resourceUri = libUri;
				}
				await autoDeclare(resourceUri, modName, modifier);
			}
		});
}


// this method is called when your extension is deactivated
export function deactivate() { }
