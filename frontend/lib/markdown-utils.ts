/**
 * Utility functions for converting markdown to text
 */

/**
 * Converts markdown text to plain text by removing markdown syntax
 * @param markdown - The markdown string to convert
 * @returns Clean text without markdown formatting
 */

/**
 * Converts markdown to HTML for rendering in React
 * Supports bold, italic, lists, headers, links, images, code, blockquotes
 * @param markdown - The markdown string to convert
 * @returns HTML string
 */

/**
 * Converts markdown to HTML with proper formatting
 * @param markdown - The markdown string to convert
 * @returns HTML string with proper formatting
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return "";

  let html = markdown;

  // Convert headers
  html = html.replace(
    /^### (.*?)$/gm,
    '<h3 class="font-semibold text-base mb-2 mt-4">$1</h3>'
  );
  html = html.replace(
    /^## (.*?)$/gm,
    '<h2 class="font-bold text-lg mb-2 mt-4">$1</h2>'
  );
  html = html.replace(
    /^# (.*?)$/gm,
    '<h1 class="font-bold text-xl mb-3 mt-4">$1</h1>'
  );

  // Convert bold and italic formatting
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/__(.*?)__/g, "<strong>$1</strong>");
  html = html.replace(/_(.*?)_/g, "<em>$1</em>");

  // Convert strikethrough
  html = html.replace(/~~(.*?)~~/g, "<del>$1</del>");

  // Convert inline code
  html = html.replace(
    /`(.*?)`/g,
    '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
  );

  // Convert code blocks
  html = html.replace(
    /```([\s\S]*?)```/g,
    '<pre class="bg-gray-100 p-3 rounded-md my-2 overflow-x-auto"><code>$1</code></pre>'
  );
  html = html.replace(
    /~~~([\s\S]*?)~~~/g,
    '<pre class="bg-gray-100 p-3 rounded-md my-2 overflow-x-auto"><code>$1</code></pre>'
  );

  // Convert links
  html = html.replace(
    /\[([^\]]*)\]\(([^)]*)\)/g,
    '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Convert images
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]*)\)/g,
    '<img src="$2" alt="$1" class="max-w-full h-auto rounded-md my-2" />'
  );

  // Convert unordered lists
  html = html.replace(/(?:^|\n)((?:\s*[-*+]\s+.*(?:\n|$))+)/g, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((line) => {
        const content = line.replace(/^\s*[-*+]\s+/, "");
        return `<li class="mb-1">${content}</li>`;
      })
      .join("");
    return `<ul class="list-disc list-inside my-2 ml-4">${items}</ul>`;
  });

  // Convert ordered lists - preserve original numbering
  html = html.replace(/(?:^|\n)((?:\s*\d+\.\s+.*(?:\n|$))+)/g, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((line) => {
        const numberMatch = line.match(/^\s*(\d+)\.\s+(.*)/);
        if (numberMatch) {
          const [, number, content] = numberMatch;
          return `<li class="mb-1" value="${number}">${content}</li>`;
        }
        return "";
      })
      .filter(Boolean)
      .join("");
    return `<ol class="list-decimal list-inside my-2 ml-4">${items}</ol>`;
  });

  // Convert blockquotes
  html = html.replace(
    /^>\s*(.*?)$/gm,
    '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-2 text-gray-700">$1</blockquote>'
  );

  // Convert horizontal rules
  html = html.replace(/^---+$/gm, '<hr class="border-gray-300 my-4" />');
  html = html.replace(/^\*\*\*+$/gm, '<hr class="border-gray-300 my-4" />');

  // Convert line breaks
  html = html.replace(/\n\n/g, "<br><br>");
  html = html.replace(/\n/g, "<br>");

  // Clean up extra breaks
  html = html.replace(/(<br>){3,}/g, "<br><br>");

  return html.trim();
}

/**
 * Converts markdown to formatted text with basic styling preserved
 * @param markdown - The markdown string to convert
 * @returns Text with basic formatting like bullet points
 */
export function markdownToFormattedText(markdown: string): string {
  if (!markdown) return "";

  let text = markdown;

  // Convert headers to plain text with emphasis
  text = text.replace(/^#{1,6}\s+(.*?)$/gm, (match, content) => {
    return content.toUpperCase();
  });

  // Remove bold and italic formatting but keep the text
  text = text.replace(/\*\*\*(.*?)\*\*\*/g, "$1");
  text = text.replace(/\*\*(.*?)\*\*/g, "$1");
  text = text.replace(/\*(.*?)\*/g, "$1");
  text = text.replace(/__(.*?)__/g, "$1");
  text = text.replace(/_(.*?)_/g, "$1");

  // Remove strikethrough
  text = text.replace(/~~(.*?)~~/g, "$1");

  // Remove inline code backticks
  text = text.replace(/`(.*?)`/g, "$1");

  // Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, "");

  // Convert links to just the text
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");

  // Remove images
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, "");

  // Convert unordered lists to bullet points
  text = text.replace(/^\s*[-*+]\s+/gm, "• ");

  // Convert ordered lists to numbers
  text = text.replace(/^\s*(\d+)\.\s+/gm, "$1. ");

  // Remove blockquotes
  text = text.replace(/^>\s*/gm, "");

  // Remove horizontal rules
  text = text.replace(/^---+$/gm, "");
  text = text.replace(/^\*\*\*+$/gm, "");

  // Clean up extra whitespace
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.trim();

  return text;
}
