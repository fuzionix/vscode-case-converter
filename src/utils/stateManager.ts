import { CaseType } from '../types';

export class SelectionStateManager {
    private static instance: SelectionStateManager;
    private originalTexts: string[];
    private currentCase: CaseType;

    private constructor() {
        this.originalTexts = [];
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

    public setOriginalTexts(texts: string[]): void {
        this.originalTexts = texts;
    }

    public getOriginalTexts(): string[] {
        return this.originalTexts;
    }

    public reset(): void {
        console.log('STATE RESET');
        this.originalTexts = [];
        this.currentCase = CaseType.ORIGINAL;
    }
}