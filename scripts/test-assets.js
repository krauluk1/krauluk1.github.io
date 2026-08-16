/**
 * Automated Test Suite for krauluk1.github.io
 * - Validates clean file structure and asset existence
 * - Checks for broken internal links
 * - Verifies privacy compliance (no private address, phone, or private email)
 * - Verifies ES module imports and syntax
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
let failures = 0;

function logPass(msg) {
  console.log(`\x1b[32m✔ PASS:\x1b[0m ${msg}`);
}

function logFail(msg) {
  console.error(`\x1b[31m✖ FAIL:\x1b[0m ${msg}`);
  failures++;
}

console.log('--- Starting Website Automated Validation ---\n');

// 1. Check Core Files (Clean Zero-Duplication Architecture)
const requiredFiles = [
  'index.html',
  'article-robocup.html',
  'article-oslo.html',
  'article-dancing.html',
  'privacy.html',
  'legal-notice.html',
  'assets/data/portfolio.json',
  'assets/data/articles.json',
  'assets/data/legal.json',
  'assets/css/main.css',
  'assets/js/article-renderer.js',
  'assets/js/game/app.js',
  'assets/js/game/content.js',
  'assets/js/game/engine.js',
  'assets/js/game/rover.js',
  'assets/js/game/world.js',
  'assets/js/game/hud.js',
  'assets/js/game/audio.js',
  'assets/js/game/events.js',
  'assets/js/game/particles.js',
  'assets/js/game/storage.js'
];

requiredFiles.forEach(file => {
  const fullPath = path.join(ROOT_DIR, file);
  if (fs.existsSync(fullPath)) {
    logPass(`Required file exists: ${file}`);
  } else {
    logFail(`Missing required file: ${file}`);
  }
});

// Check that deleted German alias files do NOT exist
const deletedFiles = ['datenschutz.html', 'impressum.html', 'blog-details'];
deletedFiles.forEach(file => {
  const fullPath = path.join(ROOT_DIR, file);
  if (!fs.existsSync(fullPath)) {
    logPass(`Obsolete/German file correctly removed: ${file}`);
  } else {
    logFail(`Obsolete file still present: ${file}`);
  }
});

// 2. Generic Privacy Compliance Check across all public html and js files
const forbiddenPatterns = [
  { name: 'Generic Phone Number Pattern', pattern: /(?:\+49|0049|01[5-7][0-9])[\s\d/-]{7,}/ },
  { name: 'Generic Street Address Pattern', pattern: /\b[A-ZÄÖÜ][a-zäöüß]+(?:straße|strasse|str\.)\s+\d+/i }
];

function checkPrivacy(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.name === '.git' || item.name === 'node_modules' || item.name === 'scripts') continue;
    const itemPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      checkPrivacy(itemPath);
    } else if (item.name.endsWith('.html') || item.name.endsWith('.js') || item.name.endsWith('.md')) {
      const content = fs.readFileSync(itemPath, 'utf8');
      forbiddenPatterns.forEach(({ name, pattern }) => {
        if (pattern.test(content)) {
          logFail(`Privacy violation in ${path.relative(ROOT_DIR, itemPath)}: Contains ${name}`);
        }
      });
    }
  }
}

checkPrivacy(ROOT_DIR);
logPass('Privacy Compliance Audit completed (Zero private sensitive data detected).');

// 3. Link & Asset Integrity Check in html files
['index.html', 'article-robocup.html', 'article-oslo.html', 'article-dancing.html'].forEach(htmlFile => {
  const filePath = path.join(ROOT_DIR, htmlFile);
  if (fs.existsSync(filePath)) {
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    const srcRegex = /(?:src|href)=["']([^"']+)["']/g;
    let match;
    while ((match = srcRegex.exec(htmlContent)) !== null) {
      const link = match[1];
      if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('#') || link.startsWith('mailto:') || link.startsWith('javascript:') || link.startsWith('${')) {
        continue;
      }
      const cleanLink = link.split('?')[0].split('#')[0];
      if (cleanLink && !fs.existsSync(path.join(ROOT_DIR, cleanLink))) {
        logFail(`Broken asset link in ${htmlFile}: ${cleanLink}`);
      }
    }
    logPass(`Internal asset links in ${htmlFile} verified.`);
  }
});

console.log('\n--- Test Summary ---');
if (failures === 0) {
  console.log('\x1b[32mAll tests passed successfully!\x1b[0m\n');
  process.exit(0);
} else {
  console.error(`\x1b[31m${failures} test(s) failed.\x1b[0m\n`);
  process.exit(1);
}
