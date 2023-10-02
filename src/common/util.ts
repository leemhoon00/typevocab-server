export function isAlphabeticalString(input: string): boolean {
  const alphabetRegex = /^[a-zA-Z]+$/;
  return alphabetRegex.test(input);
}

export function hasNoWhitespace(input: string): boolean {
  const whitespaceRegex = /\s/;
  return !whitespaceRegex.test(input);
}
