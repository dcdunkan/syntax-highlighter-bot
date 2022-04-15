export interface PublicApi {
  highlight: (
    codeOrLanguageName: string,
    optionsOrCode: string | {
      language: string;
      ignoreIllegals?: boolean;
    },
    ignoreIllegals?: boolean,
  ) => HighlightResult;
  highlightAuto: (
    code: string,
    languageSubset?: string[],
  ) => HighlightResult;
  autoDetection: (languageName: string) => boolean;
  versionString: string;
}

interface HighlightResult {
  code?: string;
  relevance: number;
  value: string;
  language?: string;
  illegal: boolean;
  errorRaised?: Error;
  // * for auto-highlight
  secondBest?: Omit<HighlightResult, "second_best">;
}
