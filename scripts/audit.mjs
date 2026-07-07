import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ---------------------------------------------------------------------------
// SevaMitra AI — Pre-Flight Deployment Audit
// ---------------------------------------------------------------------------

const ROOT = process.cwd();
let failures = 0;

function pass(msg) {
  console.log(`  \x1b[32m✓\x1b[0m ${msg}`);
}

function fail(msg) {
  console.error(`  \x1b[31m✗\x1b[0m ${msg}`);
  failures++;
}

function warn(msg) {
  console.log(`  \x1b[33m⚠\x1b[0m ${msg}`);
}

function heading(title) {
  console.log(`\n\x1b[36m[${title}]\x1b[0m`);
}

console.log('');
console.log('\x1b[1m═══════════════════════════════════════════════\x1b[0m');
console.log('\x1b[1m  SevaMitra AI — Pre-Flight Deployment Audit   \x1b[0m');
console.log('\x1b[1m═══════════════════════════════════════════════\x1b[0m');

// ---------------------------------------------------------------------------
// CHECK A: Vercel Manifest Structural Validation
// ---------------------------------------------------------------------------
heading('CHECK A — Vercel Manifest Validation');

const vercelPath = resolve(ROOT, 'vercel.json');

if (!existsSync(vercelPath)) {
  fail('vercel.json does not exist at project root');
} else {
  pass('vercel.json exists');

  let vercelConfig;
  try {
    const raw = readFileSync(vercelPath, 'utf-8');
    vercelConfig = JSON.parse(raw);
    pass('Valid JSON parsed successfully');
  } catch (err) {
    fail(`vercel.json contains invalid JSON: ${err.message}`);
  }

  if (vercelConfig) {
    // Version check
    if (vercelConfig.version === 2) {
      pass('Version: 2');
    } else {
      fail(`Expected version 2, found: ${vercelConfig.version}`);
    }

    // Rewrites check
    const rewrites = vercelConfig.rewrites;
    if (Array.isArray(rewrites)) {
      const apiRewrite = rewrites.find(
        (r) => r.source === '/api/(.*)' && r.destination === '/api/index.js'
      );
      if (apiRewrite) {
        pass('API rewrite: /api/(.*) → /api/index.js');
      } else {
        fail('Missing API rewrite rule: /api/(.*) → /api/index.js');
      }

      const spaRewrite = rewrites.find(
        (r) => r.source === '/(.*)' && r.destination === '/index.html'
      );
      if (spaRewrite) {
        pass('SPA fallback: /(.*) → /index.html');
      } else {
        fail('Missing SPA fallback rewrite rule: /(.*) → /index.html');
      }
    } else {
      fail('vercel.json is missing a "rewrites" array');
    }
  }
}

// ---------------------------------------------------------------------------
// CHECK B: Hardcoded Host Detection in src/App.jsx
// ---------------------------------------------------------------------------
heading('CHECK B — Hardcoded Host Detection (src/App.jsx)');

const appPath = resolve(ROOT, 'src', 'App.jsx');

if (!existsSync(appPath)) {
  fail('src/App.jsx does not exist');
} else {
  let appContent;
  try {
    appContent = readFileSync(appPath, 'utf-8');
    pass('src/App.jsx read successfully');
  } catch (err) {
    fail(`Failed to read src/App.jsx: ${err.message}`);
  }

  if (appContent) {
    const forbidden = /localhost|127\.0\.0\.1|0\.0\.0\.0/gi;
    const matches = appContent.match(forbidden);

    if (matches) {
      fail(`Found ${matches.length} forbidden hardcoded host pattern(s): ${[...new Set(matches)].join(', ')}`);
      // Show line numbers for each occurrence
      const lines = appContent.split('\n');
      lines.forEach((line, i) => {
        if (forbidden.test(line)) {
          console.error(`    → Line ${i + 1}: ${line.trim()}`);
        }
        // Reset regex lastIndex since we use /g flag
        forbidden.lastIndex = 0;
      });
    } else {
      pass('No forbidden localhost/IP patterns found');
    }

    // Verify relative fetch path exists
    if (appContent.includes("'/api/generate'") || appContent.includes('"/api/generate"')) {
      pass('Relative fetch path /api/generate confirmed');
    } else {
      warn('Could not confirm relative /api/generate fetch path');
    }
  }
}

// ---------------------------------------------------------------------------
// CHECK C: Environment Key Verification
// ---------------------------------------------------------------------------
heading('CHECK C — Environment Key Verification');

const keys = [
  { name: 'GEMINI_API_KEY_1', val: process.env.GEMINI_API_KEY_1 },
  { name: 'GEMINI_API_KEY_2', val: process.env.GEMINI_API_KEY_2 },
  { name: 'GEMINI_API_KEY_3', val: process.env.GEMINI_API_KEY_3 },
  { name: 'GEMINI_API_KEY', val: process.env.GEMINI_API_KEY }
].filter(k => k.val);

if (keys.length > 0) {
  keys.forEach(k => {
    const keyLen = k.val.length;
    const masked = k.val.slice(0, 4) + '•'.repeat(Math.max(0, keyLen - 4));
    pass(`${k.name} is configured (${keyLen} chars, masked: ${masked})`);
  });
} else {
  warn('No GEMINI_API_KEY environment variables are set — required for production deployment');
}

// ---------------------------------------------------------------------------
// Final Verdict
// ---------------------------------------------------------------------------
console.log('');
console.log('\x1b[1m═══════════════════════════════════════════════\x1b[0m');

if (failures === 0) {
  console.log('\x1b[1m\x1b[32m  ✅ All pre-flight checks passed. Ready for deployment.\x1b[0m');
  console.log('\x1b[1m═══════════════════════════════════════════════\x1b[0m');
  console.log('');
  process.exit(0);
} else {
  console.error(`\x1b[1m\x1b[31m  ❌ Pre-flight audit failed. ${failures} issue(s) found.\x1b[0m`);
  console.log('\x1b[1m═══════════════════════════════════════════════\x1b[0m');
  console.log('');
  process.exit(1);
}
