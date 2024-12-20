import * as vscode from 'vscode';
import { convertCase } from './convert';

export function activate(context: vscode.ExtensionContext) {
	const commands = [
        {
            command: 'case-converter.toPrevCase',
            handler: () => convertCase('prev'),
            key: 'alt+a'
        },
		{
            command: 'case-converter.toNextCase',
            handler: () => convertCase('next'),
            key: 'alt+d'
        },
    ];

	commands.forEach(cmd => {
		const disposable = vscode.commands.registerCommand(cmd.command, cmd.handler);
		context.subscriptions.push(disposable);
	});
}

export function deactivate() {}
