/**
 * Helper utilities for formatting and normalizing keys, slugs, and strings.
 */

/**
 * Format recipe key into a standard slug--id or clean slug
 */
export const createRecipeKey = (name, id) => {
  const cleanName = String(name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (id) {
    return `${cleanName}--${id}`;
  }
  return cleanName;
};

/**
 * Parse a recipe key into { slug, id }
 * e.g. "resep-ayam-goreng-nasi-kuning--125001" => { slug: "resep-ayam-goreng-nasi-kuning", id: "125001" }
 * e.g. "125001" => { slug: null, id: "125001" }
 */
export const parseRecipeKey = (key = '') => {
  const str = decodeURIComponent(String(key)).trim();

  // Check if purely numeric ID
  if (/^\d+$/.test(str)) {
    return { slug: null, id: str };
  }

  // Check for slug--id pattern
  if (str.includes('--')) {
    const parts = str.split('--');
    const id = parts.pop();
    const slug = parts.join('--');
    if (/^\d+$/.test(id)) {
      return { slug, id };
    }
  }

  // Check for slug/id pattern
  if (str.includes('/')) {
    const parts = str.split('/');
    const id = parts.pop();
    const slug = parts.join('/');
    if (/^\d+$/.test(id)) {
      return { slug, id };
    }
  }

  return { slug: str, id: null };
};

/**
 * Clean ISO 8601 duration (e.g. PT30M, PT1H15M) into human readable "30 mnt" / "1 jam 15 mnt"
 */
export const formatDuration = (isoDuration, fallback = '') => {
  if (!isoDuration || typeof isoDuration !== 'string') {
    return fallback ? `${fallback} mnt` : '-';
  }

  if (/^\d+$/.test(isoDuration)) {
    return `${isoDuration} mnt`;
  }

  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/i);
  if (!match) return fallback ? `${fallback} mnt` : isoDuration;

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);

  if (hours > 0 && minutes > 0) return `${hours} jam ${minutes} mnt`;
  if (hours > 0) return `${hours} jam`;
  if (minutes > 0) return `${minutes} mnt`;
  return fallback ? `${fallback} mnt` : '-';
};

/**
 * Format servings number into string e.g. "4 porsi"
 */
export const formatServings = (yieldVal) => {
  if (!yieldVal) return '4 porsi';
  const num = String(yieldVal).replace(/[^0-9]/g, '');
  return num ? `${num} porsi` : String(yieldVal);
};

/**
 * Clean text from excessive whitespace, HTML entities, and formatting artifacts
 */
export const cleanText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
};
