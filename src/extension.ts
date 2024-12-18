import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('case-convertor.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Case Convertor!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
