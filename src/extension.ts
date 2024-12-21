import * as vscode from 'vscode';
import { convertToCase, getNextCaseType } from './utils/caseConverters';
import { SelectionStateManager } from './utils/stateManager';

// Flag to prevent state reset during conversion process
let isConverting = false;

function convertCase(direction: 'prev' | 'next') {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const stateManager = SelectionStateManager.getInstance();
    const currentCase = stateManager.getCurrentCase();
    const originalTexts = stateManager.getOriginalTexts();

    // Handle new selections by storing their current text as original
    if (editor.selections.length !== originalTexts.length) {
        const newOriginalTexts = editor.selections.map((selection, index) => {
            // Keep existing original texts, add new ones
            if (index < originalTexts.length) {
                return originalTexts[index];
            }
            return editor.document.getText(selection);
        });
        stateManager.setOriginalTexts(newOriginalTexts);
    }

    const nextCaseType = getNextCaseType(currentCase, direction);
    const textsToConvert = stateManager.getOriginalTexts();

    isConverting = true;

    // Perform text replacement for all selections
    editor.edit(editBuilder => {
        editor.selections.forEach((selection, index) => {
            const originalText = textsToConvert[index];
            const convertedText = convertToCase(originalText, nextCaseType);
            editBuilder.replace(selection, convertedText);
        });
    }).then(() => {
        isConverting = false;
    });

    stateManager.setCurrentCase(nextCaseType);
}

function shouldResetState(editor: vscode.TextEditor): boolean {
    // Reset if no selections or all selections are empty (no highlight)
    return !editor.selections.length ||
        editor.selections.every(selection => selection.isEmpty);
}

export function activate(context: vscode.ExtensionContext) {
    const stateManager = SelectionStateManager.getInstance();

    // Reset state when finished, but not during active conversion
    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection((event) => {
            if (!isConverting && event.textEditor) {
                if (shouldResetState(event.textEditor)) {
                    stateManager.reset();
                }
            }
        })
    );

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

export function deactivate() {
    SelectionStateManager.getInstance().reset();
    isConverting = false;
}