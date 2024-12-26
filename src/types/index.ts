export enum CaseType {
    ORIGINAL = 'original',
    CONST = 'const',
    CAMEL = 'camel',
    SNAKE = 'snake',
    KEBAB = 'kebab',
}

export type ConvertibleCaseType = Exclude<CaseType, CaseType.ORIGINAL>;

export type ConvertedTexts = {
    [key in ConvertibleCaseType]?: string;
};