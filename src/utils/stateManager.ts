import { CaseType } from '../types';

export interface SelectionInfo {
    originalText: string;
    convertedTexts: {
        upper?: string;
        lower?: string;
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

    private constructor() {
        this.selectionInfos = [];
        this.currentCase = CaseType.ORIGINAL;
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
        this.selectionInfos = this.selectionInfos.filter(info =>
            currentSelections.some(selection => {
                return selection === info.originalText ||
                    Object.values(info.convertedTexts).includes(selection);
            })
        );

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
                    case CaseType.UPPER:
                        info.convertedTexts.upper = convertedText;
                        break;
                    case CaseType.LOWER:
                        info.convertedTexts.lower = convertedText;
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
     * Resets the state manager to initial state
     * Clears all selection information and resets case type
     */
    public reset(): void {
        console.log('STATE RESET');
        this.selectionInfos = [];
        this.currentCase = CaseType.ORIGINAL;
    }
}