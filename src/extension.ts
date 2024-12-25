import * as vscode from 'vscode';
import { convertToCase, getNextCaseType } from './utils/caseConverters';
import { SelectionStateManager } from './utils/stateManager';

// Flag to prevent state reset during conversion process
let isConverting = false;

/**
 * Handles case conversion for selected text(s)
 * Converts the case of selected text(s) based on the direction (previous or next case type)
 * Maintains original text and converted states for each selection
 * 
 * @param direction - Direction to cycle through cases ('prev' or 'next')
 */
function convertCase(direction: 'prev' | 'next') {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const stateManager = SelectionStateManager.getInstance();
    const currentCase = stateManager.getCurrentCase();
    const currentSelections = editor.selections.map(selection =>
        editor.document.getText(selection)
    );
    stateManager.updateSelectionInfos(currentSelections);

    const nextCaseType = getNextCaseType(currentCase, direction);
    const selectionInfos = stateManager.getSelectionInfos();

    isConverting = true;

    // Apply text conversions to all selections
    editor.edit(editBuilder => {
        editor.selections.forEach((selection, index) => {
            const originalText = selectionInfos[index].originalText;
            const convertedText = convertToCase(originalText, nextCaseType);
            editBuilder.replace(selection, convertedText);
            stateManager.addConvertedText(originalText, nextCaseType, convertedText);
        });
    }).then(() => {
        isConverting = false;
    });

    stateManager.setCurrentCase(nextCaseType);
}

/**
 * Determines if the state should be reset based on editor selection state
 * Returns true if there are no selections or all selections are empty (cursor positions)
 * 
 * @param editor - VS Code text editor instance
 * @returns boolean indicating if state should be reset
 */
function shouldResetState(editor: vscode.TextEditor): boolean {
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