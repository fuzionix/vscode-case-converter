import { CaseType } from '../types';

// Regex for matching words (including hyphenated and underscore-connected words)
const WORD_REGEX = /[a-zA-Z0-9]+(?:[-_][a-zA-Z0-9]+)*/g;
const WORD_BOUNDARY_REGEX = /([a-z])([A-Z])/g;

export const caseOrder: CaseType[] = [
    CaseType.ORIGINAL,
    CaseType.UPPER,
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
                return toUpperCase(part.text);
            case CaseType.CAMEL:
                return toCamelCase(part.text);
            case CaseType.SNAKE:
                return toSnakeCase(part.text);
            case CaseType.KEBAB:
                return toKebabCase(part.text);
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

function toUpperCase(text: string): string {
    return text
        .replace(WORD_BOUNDARY_REGEX, '$1_$2')
        .replace(/[-]/g, '_')
        .toUpperCase();
}

function toCamelCase(text: string): string {
    const snakeCase = text
        .replace(WORD_BOUNDARY_REGEX, '$1_$2')
        .replace(/[-]/g, '_')
        .toLowerCase();

    return snakeCase
        .replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase());
}

function toSnakeCase(text: string): string {
    return text
        .replace(/[-]/g, '_')
        .replace(WORD_BOUNDARY_REGEX, '$1_$2')
        .toLowerCase();
}

function toKebabCase(text: string): string {
    return text
        .replace(/[_]/g, '-')
        .replace(WORD_BOUNDARY_REGEX, '$1-$2')
        .toLowerCase();
}