import { CaseType } from '../types';

// Regex for matching words (including hyphenated and underscore-connected words)
const WORD_REGEX = /[a-zA-Z0-9]+(?:[-_][a-zA-Z0-9]+)*/g;

export const caseOrder: CaseType[] = [
    CaseType.ORIGINAL,
    CaseType.UPPER,
    CaseType.LOWER,
    CaseType.CAMEL,
    CaseType.SNAKE,
    CaseType.KEBAB,
];

/**
 * Splits text into parts: words that should be converted and delimiters that should be preserved
 * @param text
 * @returns Array of parts with type indication
 */
export function splitTextIntoParts(text: string): Array<{ text: string, isWord: boolean }> {
    const parts: Array<{ text: string, isWord: boolean }> = [];
    let lastIndex = 0;

    // Find all word matches in the text
    for (const match of text.matchAll(WORD_REGEX)) {
        const word = match[0];
        const startIndex = match.index!;

        // Add delimiter before the word if exists
        if (startIndex > lastIndex) {
            parts.push({
                text: text.slice(lastIndex, startIndex),
                isWord: false
            });
        }

        parts.push({
            text: word,
            isWord: true
        });

        lastIndex = startIndex + word.length;
    }

    // Add remaining delimiter after last word if exists
    if (lastIndex < text.length) {
        parts.push({
            text: text.slice(lastIndex),
            isWord: false
        });
    }

    return parts;
}

export function convertToCase(text: string, caseType: CaseType): string {
    const parts = splitTextIntoParts(text);
    return parts.map(part => {
        if (!part.isWord) {
            return part.text;
        }

        switch (caseType) {
            case CaseType.ORIGINAL:
                return part.text;
            case CaseType.UPPER:
                return part.text.toUpperCase();
            case CaseType.LOWER:
                return part.text.toLowerCase();
            case CaseType.CAMEL:
                return part.text
                    .toLowerCase()
                    .replace(/[-_](.)/g, (_, char) => char.toUpperCase());
            case CaseType.SNAKE:
                return part.text
                    .replace(/[-]/g, '_') // Convert hyphens to underscores
                    .replace(/([a-z])([A-Z])/g, '$1_$2')
                    .toLowerCase();
            case CaseType.KEBAB:
                return part.text
                    .replace(/[_]/g, '-') // Convert underscores to hyphens
                    .replace(/([a-z])([A-Z])/g, '$1-$2')
                    .toLowerCase();
            default:
                return part.text;
        }
    }).join('');
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