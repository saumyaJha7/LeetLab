/**
 * Lightweight regex tokenizer for the code editor.
 *
 * Zero-dependency, works in Expo Go (no native modules, no WebView).
 * It is not a full parser — just enough for pleasant, fast highlighting
 * of the judge languages (javascript / python / java) plus a generic
 * C-like fallback. Unknown languages fall back to the generic set.
 */

export type HighlightTokenType =
  | "keyword"
  | "string"
  | "comment"
  | "number"
  | "function"
  | "class"
  | "annotation"
  | "operator"
  | "plain";

export type HighlightToken = {
  text: string;
  type: HighlightTokenType;
};

/** Token colours tuned for the LeetLab dark theme. */
export const highlightColors: Record<HighlightTokenType, string> = {
  plain: "#F3F8FF",
  keyword: "#C792EA",
  string: "#9ECE6A",
  comment: "#6B7385",
  number: "#FF9E64",
  function: "#4DABF7",
  class: "#00D09E",
  annotation: "#FFB800",
  operator: "#8B95A5",
};

const JS_KEYWORDS = [
  "break", "case", "catch", "class", "const", "continue", "debugger",
  "default", "delete", "do", "else", "export", "extends", "finally",
  "for", "function", "if", "import", "in", "instanceof", "new",
  "return", "super", "switch", "this", "throw", "try", "typeof",
  "var", "void", "while", "with", "yield", "let", "static",
  "async", "await", "from", "of", "as",
];

const PYTHON_KEYWORDS = [
  "def", "return", "if", "elif", "else", "for", "while", "in",
  "not", "and", "or", "is", "None", "True", "False", "class",
  "import", "from", "as", "pass", "lambda", "with", "yield",
  "try", "except", "finally", "raise", "global", "nonlocal",
  "assert", "del", "await", "async", "print",
];

const JAVA_KEYWORDS = [
  "abstract", "assert", "boolean", "break", "byte", "case", "catch",
  "char", "class", "const", "continue", "default", "do", "double",
  "else", "enum", "extends", "final", "finally", "float", "for",
  "goto", "if", "implements", "import", "instanceof", "int",
  "interface", "long", "native", "new", "package", "private",
  "protected", "public", "return", "short", "static", "strictfp",
  "super", "switch", "synchronized", "this", "throw", "throws",
  "transient", "try", "void", "volatile", "while", "var",
  "true", "false", "null",
];

const JS_LIKE = new Set(["javascript", "typescript", "js", "ts", "jsx", "tsx"]);
const PYTHON_LIKE = new Set(["python", "py"]);
const JAVA_LIKE = new Set(["java", "c", "c++", "cpp", "c#", "go", "rust", "kotlin", "swift"]);

function keywordsFor(language: string): string[] {
  const lang = language.toLowerCase();
  if (PYTHON_LIKE.has(lang)) return PYTHON_KEYWORDS;
  if (JAVA_LIKE.has(lang)) return JAVA_KEYWORDS;
  if (JS_LIKE.has(lang)) return JS_KEYWORDS;
  // Generic C-like fallback: union of JS + Java keywords.
  return [...new Set([...JS_KEYWORDS, ...JAVA_KEYWORDS])];
}

function isPython(language: string): boolean {
  return PYTHON_LIKE.has(language.toLowerCase());
}

// Master pattern parts (ordered by priority).
const BLOCK_COMMENT = "/\\*[\\s\\S]*?(?:\\*/|$)";
const LINE_COMMENT_C = "//[^\\n]*";
const LINE_COMMENT_PY = "#[^\\n]*";
const TRIPLE_STRING = '"""[\\s\\S]*?(?:"""|$)' + "|" + "'''[\\s\\S]*?(?:'''|$)";
const DOUBLE_STRING = '"(?:\\\\.|[^"\\\\\\n])*(?:"|$)';
const SINGLE_STRING = "'(?:\\\\.|[^'\\\\\\n])*(?:'|$)";
const BACKTICK_STRING = "`(?:\\\\.|[^`\\\\])*(?:`|$)";
// Python f-string / decorator handling is covered generically:
// "@..." lines are matched as annotations below.
const NUMBER = "\\b\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?[lLfF]?(?=\\b|_)";
const FUNCTION_CALL = "[A-Za-z_]\\w*(?=\\s*\\()";
const CLASS_NAME = "\\b[A-Z][A-Za-z0-9_]*\\b";
const ANNOTATION = "@[A-Za-z_]\\w*";
const OPERATOR = "[\\{\\}\\(\\)\\[\\];,\\.\\:+\\-\\*\\/%=<>!&\\|\\?~\\^]+";

type CompiledPatterns = {
  comment: string;
  string: string;
};

function patternsFor(language: string): CompiledPatterns {
  if (isPython(language)) {
    return {
      comment: LINE_COMMENT_PY,
      string: [TRIPLE_STRING, DOUBLE_STRING, SINGLE_STRING].join("|"),
    };
  }
  return {
    comment: [BLOCK_COMMENT, LINE_COMMENT_C].join("|"),
    string: [BACKTICK_STRING, DOUBLE_STRING, SINGLE_STRING].join("|"),
  };
}

/**
 * Tokenize `code` for `language`. Runs in O(n) with a single pass;
 * consecutive plain characters are coalesced to keep the rendered
 * <Text> tree small.
 */
export function tokenizeCode(code: string, language: string): HighlightToken[] {
  if (!code) return [];

  const keywords = keywordsFor(language);
  const keywordPattern = `\\b(?:${keywords.join("|")})\\b`;
  const { comment, string } = patternsFor(language);

  const master = new RegExp(
    [
      `(?<comment>${comment})`,
      `(?<string>${string})`,
      `(?<number>${NUMBER})`,
      `(?<keyword>${keywordPattern})`,
      `(?<annotation>${ANNOTATION})`,
      `(?<function>${FUNCTION_CALL})`,
      `(?<class>${CLASS_NAME})`,
      `(?<operator>${OPERATOR})`,
    ].join("|"),
    "g"
  );

  const tokens: HighlightToken[] = [];
  let lastIndex = 0;
  let plainBuf = "";

  const flushPlain = () => {
    if (plainBuf) {
      tokens.push({ text: plainBuf, type: "plain" });
      plainBuf = "";
    }
  };

  const push = (text: string, type: HighlightTokenType) => {
    if (!text) return;
    if (type === "plain") {
      plainBuf += text;
      return;
    }
    flushPlain();
    tokens.push({ text, type });
  };

  let match: RegExpExecArray | null;
  master.lastIndex = 0;
  while ((match = master.exec(code)) !== null) {
    const index = match.index;
    // Anything skipped (identifiers, whitespace) is plain.
    if (index > lastIndex) {
      push(code.slice(lastIndex, index), "plain");
    }
    const text = match[0];
    if (!text) {
      master.lastIndex = index + 1;
      lastIndex = index + 1;
      continue;
    }
    const groups = match.groups ?? {};
    if (groups.comment !== undefined) push(text, "comment");
    else if (groups.string !== undefined) push(text, "string");
    else if (groups.number !== undefined) push(text, "number");
    else if (groups.keyword !== undefined) push(text, "keyword");
    else if (groups.annotation !== undefined) push(text, "annotation");
    else if (groups.function !== undefined) push(text, "function");
    else if (groups.class !== undefined) push(text, "class");
    else if (groups.operator !== undefined) push(text, "operator");
    else push(text, "plain");

    lastIndex = index + text.length;
    // Guard against zero-length matches looping forever.
    if (text.length === 0) {
      master.lastIndex += 1;
      lastIndex += 1;
    }
  }

  if (lastIndex < code.length) {
    push(code.slice(lastIndex), "plain");
  }
  flushPlain();
  return tokens;
}
