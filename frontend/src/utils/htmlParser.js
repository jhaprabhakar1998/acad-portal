/**
 * HTML Parser Utility
 * Parses HTML string from API response into React elements
 */

/**
 * Parses HTML string and extracts phone numbers with their masked values
 * @param {string} htmlString - HTML string from API
 * @returns {Array<{value: string, masked: string, checked: boolean}>}
 */
export function parsePhoneNumbers(htmlString) {
  if (!htmlString) return [];

  // Extract phone numbers using regex
  const phoneRegex = /value="(\d+)"[^>]*checked[^>]*>([^<]+)</g;
  const phoneRegexNoChecked = /value="(\d+)"[^>]*>([^<]+)</g;
  
  const phones = [];
  let match;

  // First, find checked items
  while ((match = phoneRegex.exec(htmlString)) !== null) {
    phones.push({
      value: match[1],
      masked: match[2].trim(),
      checked: true,
    });
  }

  // Then, find non-checked items
  while ((match = phoneRegexNoChecked.exec(htmlString)) !== null) {
    // Skip if already added (checked)
    if (!phones.find(p => p.value === match[1])) {
      phones.push({
        value: match[1],
        masked: match[2].trim(),
        checked: false,
      });
    }
  }

  return phones;
}

/**
 * Extracts text content from HTML string
 * @param {string} htmlString - HTML string
 * @returns {string}
 */
export function extractTextFromHtml(htmlString) {
  if (!htmlString) return '';
  return htmlString.replace(/<[^>]*>/g, '').trim();
}

