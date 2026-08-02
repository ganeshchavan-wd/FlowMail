/**
 * cleanAIResponse
 * ----------------
 * Strips common markdown syntax from an AI-generated chat reply so that
 * raw markdown symbols (**, __, #, ##, ###, `, ```, >, ---, [text](url))
 * never leak into the plain-text chat UI.
 *
 * What it removes:
 *  - Bold/emphasis markers: ** and __ (keeps the wrapped text)
 *  - Headings: #, ##, ### ... ######
 *  - Fenced code blocks: ```...``` (keeps the inner text, drops the fences)
 *  - Inline code backticks: `code` (keeps the inner text)
 *  - Blockquotes: > at the start of a line
 *  - Markdown links: [text](url) -> text
 *  - Horizontal rules: ---, ***, ___
 *  - Duplicate/extra blank lines
 *  - Trailing/leading whitespace
 *
 * What it keeps:
 *  - Emojis
 *  - Bullet points (-, *, •) and numbered lists (1., 2., ...)
 *  - Line breaks
 *  - Plain text content
 */
export function cleanAIResponse(text: string): string {
  if (!text || typeof text !== "string") return text ?? "";

  let cleaned = text;

  // 1. Fenced code blocks (```...```) - strip the fences, keep inner content
  cleaned = cleaned.replace(/```[a-zA-Z0-9]*\n?([\s\S]*?)```/g, (_match, inner) => inner);
  // Catch any stray/unclosed triple backticks
  cleaned = cleaned.replace(/```/g, "");

  // 2. Inline code backticks `code` -> code
  cleaned = cleaned.replace(/`([^`]+)`/g, "$1");
  cleaned = cleaned.replace(/`/g, "");

  // 3. Bold/strong emphasis: **text** or __text__ -> text
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, "$1");
  cleaned = cleaned.replace(/__(.*?)__/g, "$1");
  // Remove any leftover/unmatched ** or __ markers
  cleaned = cleaned.replace(/\*\*/g, "").replace(/__/g, "");

  // 4. Headings: #, ##, ### ... ###### at the start of a line
  cleaned = cleaned.replace(/^[ \t]{0,3}#{1,6}[ \t]+/gm, "");

  // 5. Blockquotes: > at the start of a line
  cleaned = cleaned.replace(/^[ \t]{0,3}>[ \t]?/gm, "");

  // 6. Markdown links: [text](url) -> text (keep the visible text only)
  cleaned = cleaned.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");

  // 7. Horizontal rules: ---, ***, ___ on their own line
  cleaned = cleaned.replace(/^[ \t]{0,3}(-{3,}|\*{3,}|_{3,})[ \t]*$/gm, "");

  // 8. Trim trailing spaces on each line
  cleaned = cleaned.replace(/[ \t]+$/gm, "");

  // 9. Collapse duplicate/extra blank lines into a single blank line
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  // 10. Trim unnecessary leading/trailing whitespace overall
  cleaned = cleaned.trim();

  return cleaned;
}
