import { CaseType } from '../types';

export interface SelectionInfo {
    originalText: string;
    convertedTexts: {
        const?: string;
        camel?: string;
        snake?: string;
        kebab?: string;
    }
}

/**
 * Manages the state of text selections and their conversions
 */
export class SelectionStateManager {
    private static instance: SelectionStateManager;
    private selectionInfos: SelectionInfo[];
    private currentCase: CaseType;

    private caseHistory: CaseType[]; // Stack for undo history
    private redoStack: CaseType[];   // Stack for redo history

    private constructor() {
        this.selectionInfos = [];
        this.currentCase = CaseType.ORIGINAL;
        this.caseHistory = [CaseType.ORIGINAL];
        this.redoStack = [];
    }

    public static getInstance(): SelectionStateManager {
        if (!SelectionStateManager.instance) {
            SelectionStateManager.instance = new SelectionStateManager();
        }
        return SelectionStateManager.instance;
    }

    public getCurrentCase(): CaseType {
        return this.currentCase;
    }

    public setCurrentCase(caseType: CaseType): void {
        this.currentCase = caseType;
    }

    public getSelectionInfos(): SelectionInfo[] {
        return this.selectionInfos;
    }

    /**
     * Updates selection information based on current editor selections
     * Removes deselected texts and adds new selections
     * @param currentSelections - Array of currently selected texts in editor
     */
    public updateSelectionInfos(currentSelections: string[]): void {
        // Remove entries for deselected texts
        // A text is considered deselected if it doesn't match any current selection in either its original or converted forms
        this.selectionInfos = this.selectionInfos.filter((info, index) => {
            return currentSelections[index] === info.originalText ||
                Object.values(info.convertedTexts).includes(currentSelections[index]);
        });

        // Add new selections that don't exist in current state
        currentSelections.forEach((selection, index) => {
            if (this.selectionInfos[index]) {
                const exists = selection === this.selectionInfos[index].originalText ||
                    Object.values(this.selectionInfos[index].convertedTexts).includes(selection);

                if (!exists) {
                    this.selectionInfos.push({
                        originalText: selection,
                        convertedTexts: {}
                    });
                }
            } else {
                this.selectionInfos.push({
                    originalText: selection,
                    convertedTexts: {}
                });
            }
        });
    }

    /**
     * Stores converted text for a specific selection and case type
     * @param originalText - Original text that was converted
     * @param caseType - Case type of the conversion
     * @param convertedText - Resulting converted text
     */
    public addConvertedText(originalText: string, caseType: CaseType, convertedText: string): void {
        this.selectionInfos.forEach(info => {
            if (info.originalText === originalText) {
                // Store converted text in appropriate property based on case type
                switch (caseType) {
                    case CaseType.CONST:
                        info.convertedTexts.const = convertedText;
                        break;
                    case CaseType.CAMEL:
                        info.convertedTexts.camel = convertedText;
                        break;
                    case CaseType.SNAKE:
                        info.convertedTexts.snake = convertedText;
                        break;
                    case CaseType.KEBAB:
                        info.convertedTexts.kebab = convertedText;
                        break;
                }
            }
        });
    }

    /**
     * Pushes a new case type to the history
     * Clears redo stack when new changes are made
     * @param caseType - Case type to add to history
     */
    public pushToHistory(caseType: CaseType): void {
        this.caseHistory.push(caseType);
        this.redoStack = [];
    }

    /**
     * Handles undo operation by reverting to previous case type
     * Moves current case to redo stack
     */
    public undoLastCase(): void {
        if (this.caseHistory.length > 1) {
            const currentCase = this.caseHistory.pop()!;
            this.redoStack.push(currentCase);
            this.currentCase = this.caseHistory[this.caseHistory.length - 1];
        }
    }

    /**
     * Handles redo operation by restoring previously undone case type
     * Moves redone case back to history
     */
    public redoLastCase(): void {
        if (this.redoStack.length > 0) {
            const nextCase = this.redoStack.pop()!;
            this.caseHistory.push(nextCase);
            this.currentCase = nextCase;
        }
    }

    /**
     * Resets the state manager to initial state
     * Clears all selection information and resets case type
     */
    public reset(): void {
        console.log('STATE RESET');
        this.selectionInfos = [];
        this.currentCase = CaseType.ORIGINAL;
        this.caseHistory = [CaseType.ORIGINAL];
        this.redoStack = [];
    }
}