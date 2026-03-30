import * as DOMPurify from 'dompurify';

/**
 * Sanitize HTML from SharePoint rich-text fields before rendering.
 * Strips scripts, event handlers, and dangerous tags while preserving
 * safe formatting (bold, italic, lists, links, line breaks, etc.).
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'b', 'i', 'u', 'em', 'strong', 'br', 'p', 'div', 'span',
      'ul', 'ol', 'li', 'a', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code',
      'sub', 'sup', 'hr',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style', 'colspan', 'rowspan'],
    ALLOW_DATA_ATTR: false,
  });
}
