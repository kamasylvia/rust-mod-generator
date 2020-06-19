// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
const parentfinder = require('find-parent-dir');
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
	let inComingPath = uri ? uri : vscode.workspace.workspaceFile;

	vscode.window.showInputBox({ ignoreFocusOut: true, prompt: 'Please enter the mod name', value: "<mod_dir> or <mod>.rs" })
		.then((modName) => {
			if (!modName) {
				return;
			}
			if (!inComingPath) {
				vscode.window.showErrorMessage("Unable to find a workspace.");
				return;
			}

			// Get the project root directory.
			let projectRootPath: string = parentfinder.sync(inComingPath.path, 'Cargo.toml');
			if (!projectRootPath) {
				vscode.window.showErrorMessage("Unable to find a Cargo.toml.");
				return;
			}

			// Check if the file or directory exists.
			let modUri = vscode.Uri.joinPath(inComingPath, modName);
			if (fs.existsSync(modUri.path)) {
				vscode.window.showErrorMessage("Mod ${modName} already exists");
				return;
			}

			if (modUri.path.endsWith(".rs")) {

			} else {

			}

		});
}

// this method is called when your extension is deactivated
export function deactivate() { }
