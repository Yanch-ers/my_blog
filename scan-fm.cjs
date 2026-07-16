const fs = require('fs');
const path = require('path');

const dirs = [
  'C:\\Users\\Aqaw\\Documents\\obsidian\\20-areas',
  'C:\\Users\\Aqaw\\Documents\\obsidian\\30-life\\essays'
];

let issues = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.md')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split(/\r?\n/);
      // Check frontmatter
      if (lines[0]?.trim() !== '---') continue;
      let fmEnd = -1;
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '---') { fmEnd = i; break; }
      }
      if (fmEnd === -1) { issues.push({ file: full, line: 1, issue: 'no closing ---' }); continue; }

      // Check each frontmatter line for common YAML issues
      for (let i = 1; i < fmEnd; i++) {
        const line = lines[i];
        // Check for unbalanced quotes in value
        const kvMatch = line.match(/^(\s*[\w_]+):\s*(.+)$/);
        if (kvMatch) {
          const val = kvMatch[2].trim();
          // Check for double quotes at end (like "" at end)
          if (val.endsWith('""') && !val.startsWith('"')) {
            issues.push({ file: path.relative('C:\\Users\\Aqaw\\Documents\\obsidian', full).replace(/\\/g, '/'), line: i + 1, issue: 'double quote at end: ' + val });
          }
          // Check for \r in line
          if (line.includes('\r')) {
            issues.push({ file: path.relative('C:\\Users\\Aqaw\\Documents\\obsidian', full).replace(/\\/g, '/'), line: i + 1, issue: 'has \\r (CRLF)' });
          }
        }
      }
    }
  }
}

for (const d of dirs) {
  if (fs.existsSync(d)) walk(d);
}

console.log(`Found ${issues.length} issues:`);
issues.forEach(i => console.log(`  ${i.file}:${i.line} - ${i.issue}`));
