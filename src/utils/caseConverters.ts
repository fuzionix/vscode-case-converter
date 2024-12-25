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
 * Splits input text into convertible words and non-convertible delimiters
 * Preserves the structure of the original text while identifying parts to convert
 * 
 * @param text - Input text to be split
 * @returns Array of text parts, each marked as word or delimiter
 * 
 * @example
 * Input: "<div class="hello-world">"
 * Output: [
 *   { text: "<div ", isWord: false },
 *   { text: "class", isWord: true },
 *   { text: "=\"", isWord: false },
 *   { text: "hello-world", isWord: true },
 *   { text: "\">" isWord: false }
 * ]
 */
export function splitTextIntoParts(text: string): Array<{ text: string, isWord: boolean }> {
    const parts: Array<{ text: string, isWord: boolean }> = [];
    let lastIndex = 0;

    // Iterate through all matches of the word pattern
    for (const match of text.matchAll(WORD_REGEX)) {
        const word = match[0];
        const startIndex = match.index!;

        // If there's text between the last word and this one,
        // add it as a delimiter (non-word part)
        if (startIndex > lastIndex) {
            parts.push({
                text: text.slice(lastIndex, startIndex),
                isWord: false
            });
        }

        // Add the matched word as a convertible part
        parts.push({
            text: word,
            isWord: true
        });

        lastIndex = startIndex + word.length;
    }

    // Add any remaining text after the last word as a delimiter
    if (lastIndex < text.length) {
        parts.push({
            text: text.slice(lastIndex),
            isWord: false
        });
    }

    return parts;
}

/**
 * Converts text to specified case while preserving delimiters and structure
 * 
 * @param text - Input text to convert
 * @param caseType - Target case type for conversion
 * @returns Converted text with preserved structure
 * 
 * @example
 * convertToCase("hello-world", CaseType.SNAKE) => "hello_world"
 * convertToCase("hello_world", CaseType.KEBAB) => "hello-world"
 */
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

/**
 * Determines the next case type in the cycle based on current case and direction
 * Provides circular navigation through the case types
 * 
 * @param currentCase - Current case type
 * @param direction - Direction to move in the cycle ('next' or 'prev')
 * @returns Next case type in the specified direction
 * 
 * @example
 * getNextCaseType(CaseType.ORIGINAL, 'next') => CaseType.UPPER
 * getNextCaseType(CaseType.ORIGINAL, 'prev') => CaseType.KEBAB
 */
export function getNextCaseType(currentCase: CaseType, direction: 'next' | 'prev'): CaseType {
    const currentIndex = caseOrder.indexOf(currentCase);
    if (direction === 'next') {
        return caseOrder[(currentIndex + 1) % caseOrder.length];
    } else {
        return caseOrder[(currentIndex - 1 + caseOrder.length) % caseOrder.length];
    }
}