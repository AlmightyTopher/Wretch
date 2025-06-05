#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'TODO.md');
if (!fs.existsSync(filePath)) {
  process.exit(0);
}
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);
const placeholder = '{{AUTO_TIMESTAMP}}';
let updated = false;
const timestamp = new Date().toISOString();

const newLines = lines.map((line) => {
  if (line.includes(placeholder) && !line.includes('Auto-update Timestamp')) {
    updated = true;
    return line.replace(new RegExp(placeholder, 'g'), timestamp);
  }
  return line;
});

if (updated) {
  fs.writeFileSync(filePath, newLines.join('\n'));
  console.log(`Updated TODO.md timestamp to ${timestamp}`);
}


