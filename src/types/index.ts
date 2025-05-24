export enum CaseType {
    ORIGINAL = 'original',
    CONST = 'const',
    CAMEL = 'camel',
    PASCAL = 'pascal',
    SNAKE = 'snake',
    KEBAB = 'kebab',
}

export type ConvertibleCaseType = Exclude<CaseType, CaseType.ORIGINAL>;

export type ConvertedTexts = {
    [key in ConvertibleCaseType]?: string;
};

export type CaseTypeString = 'original' | 'const' | 'camel' | 'pascal' | 'snake' | 'kebab';