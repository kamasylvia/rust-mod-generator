// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
const findParentDir = require('find-parent-dir');
const findupglob = require('find-up-glob');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "rust-mod-generator" is now active!');

	const documentSelector: vscode.DocumentSelector = {
		language: 'rust',
		scheme: 'file'
	};

	context.subscriptions.push(vscode.commands.registerCommand('rust-mod-generator.createModule', createModule));

	// const codeActionProvider = new CodeActionProvider();
	// let disposable = vscode.languages.registerCodeActionsProvider(documentSelector, codeActionProvider);

	// context.subscriptions.push(disposable);
}

function createModule(uri: vscode.Uri) {
	vscode.window.showInputBox({ ignoreFocusOut: true, prompt: 'Please enter the mod name', value: "<mod_dir> or <mod>.rs" })
		.then((modName) => {
			if (!modName || !uri) {
				return;
			}

			// Check if a Cargo project.
			let projectRootPath;
			findParentDir(uri.path, 'Cargo.toml', function (err: any, dir: any) {
				projectRootPath = dir;
			});
			if (!projectRootPath) {
				vscode.window.showErrorMessage("Unable to find a Cargo.toml.");
				return;
			}

			if (!uri.path.endsWith(".rs")) {
				vscode.window.showErrorMessage("Please right click a .rs file.");
				return;
			}

			// Check if the mod exists.
			let uriDir = path.dirname(uri.path);
			let modUri = vscode.Uri.joinPath(vscode.Uri.file(uriDir), modName);
			fs.exists(modUri.path, function (exists) {
				if (exists) {
					vscode.window.showErrorMessage("Mod ${modName} already exists");
					return;
				}
			});

			if (modUri.path.endsWith(".rs")) {

			} else {

			}
		});
}

// this method is called when your extension is deactivated
export function deactivate() { }
