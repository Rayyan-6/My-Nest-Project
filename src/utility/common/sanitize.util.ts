// common/sanitize.util.ts
import sanitizeHtml from 'sanitize-html';

export function sanitizeOutput(data: any) {
  if (typeof data === 'string') {
    return sanitizeHtml(data);
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeOutput);
  }
  if (typeof data === 'object' && data !== null) {
    const result = {};
    for (const key of Object.keys(data)) {
      result[key] = sanitizeOutput(data[key]);
    }
    return result;
  }
  return data;
}
