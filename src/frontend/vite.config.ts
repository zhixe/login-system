import { defineConfig } from 'vite'
import * as fs from 'fs';
import * as path from 'path';

// Helper to extract latest version and format date
function getChangelogInfo() {
  const changelogPath = path.resolve(__dirname, 'CHANGELOG.md');
  if (!fs.existsSync(changelogPath)) return { version: '0.0.0', date: 'unknown' };
  const content = fs.readFileSync(changelogPath, 'utf-8');
  // Example: ## [1.0.5] - 2025-06-04
  const match = content.match(/^##\s*\[?([0-9]+\.[0-9]+\.[0-9]+)\]?\s*-\s*([0-9-]+)/m);
  if (match) {
    const version = match[1];
    const dateRaw = match[2]; // "2025-06-04"
    let dateFormatted = 'unknown';
    try {
      const dateObj = new Date(dateRaw);
      // Format: "June 4, 2025"
      dateFormatted = dateObj.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      dateFormatted = dateRaw;
    }
    return { version, date: dateFormatted };
  }
  return { version: '0.0.0', date: 'unknown' };
}

const { version, date } = getChangelogInfo();

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __APP_DATE__: JSON.stringify(date),
  },
});