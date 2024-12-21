import { CaseType } from '../types';

export const caseOrder: CaseType[] = [
    CaseType.ORIGINAL,
    CaseType.UPPER,
    CaseType.LOWER,
    CaseType.CAMEL,
    CaseType.SNAKE,
    CaseType.KEBAB,
];

export function convertToCase(text: string, caseType: CaseType): string {
    switch (caseType) {
        case CaseType.ORIGINAL:
            return text;
        case CaseType.UPPER:
            return text.toUpperCase();
        case CaseType.LOWER:
            return text.toLowerCase();
        case CaseType.CAMEL:
            return text.toLowerCase()
                .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
        case CaseType.SNAKE:
            return text.toLowerCase()
                .replace(/[^a-zA-Z0-9]+/g, '_')
                .replace(/([a-z])([A-Z])/g, '$1_$2')
                .toLowerCase();
        case CaseType.KEBAB:
            return text.toLowerCase()
                .replace(/[^a-zA-Z0-9]+/g, '-')
                .replace(/([a-z])([A-Z])/g, '$1-$2')
                .toLowerCase();
        default:
            return text;
    }
}

// Circular navigation through case types
export function getNextCaseType(currentCase: CaseType, direction: 'next' | 'prev'): CaseType {
    const currentIndex = caseOrder.indexOf(currentCase);
    if (direction === 'next') {
        return caseOrder[(currentIndex + 1) % caseOrder.length];
    } else {
        return caseOrder[(currentIndex - 1 + caseOrder.length) % caseOrder.length];
    }
}