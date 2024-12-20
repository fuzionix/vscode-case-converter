import * as vscode from 'vscode';

export function convertCase(direction: 'next' | 'prev'): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const selections = editor.selections;

    editor.edit(editBuilder => {
        selections.forEach(selection => {
            const text = editor.document.getText(selection);
            const convertedText = convertText(text, direction);
            editBuilder.replace(selection, convertedText);
        });
    });
}

export function convertText(text: string, direction: 'next' | 'prev'): string {
    return '';
}