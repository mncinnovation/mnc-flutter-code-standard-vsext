// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { createNewWidget } from './module/createnewwidget';
import { generateModule } from './module/generatemodule';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const genModule = vscode.commands.registerCommand('mnc-flutter-code-standard-vsext.genmodule', (inUri: vscode.Uri) => generateModule(inUri));
	const genWidget = vscode.commands.registerCommand('mnc-flutter-code-standard-vsext.genwidget', (inUri: vscode.Uri) => createNewWidget(inUri));



	context.subscriptions.push(genModule, genWidget);
}

// this method is called when your extension is deactivated
export function deactivate() { }
