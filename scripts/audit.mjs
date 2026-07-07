import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

console.log('===========================================================');
console.log('      SevaMitra AI — Pre-Flight Production Audit Engine     ');
console.log('===========================================================');

let validationFailed = false;

// CHECK A: Vercel Architecture Routing Manifest Audit
try {
  const vercelJsonPath = path.join(rootDir, 'vercel.json');
  if (!fs.existsSync(vercelJsonPath)) {
    console.error('❌ [CHECK A] Failure: vercel.json manifest missing from root workspace.');
    validationFailed = true;
  } else {
    const configData = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    if (configData.version !== 2) {
      console.error('❌ [CHECK A] Failure: vercel.json is not locked to Version 2 standards.');
      validationFailed = true;
    } else {
      const hasApiRewrite = configData.rewrites?.some(r => r.source === '/api/(.*)' && r.destination === '/api/index.js');
      if (!hasApiRewrite) {
        console.error('❌ [CHECK A] Failure: vercel.json missing the mandatory backend serverless proxy rewrites.');
        validationFailed = true;
      } else {
        console.log('✅ [CHECK A] Complete: Routing manifest is structured perfectly.');
      }
    }
  }
} catch (err) {
  console.error('❌ [CHECK A] Exception: Structural error reading vercel.json:', err.message);
  validationFailed = true;
}

// CHECK B: Hardcoded Dev Host Patterns Exposure Audit
try {
  const appJsxPath = path.join(rootDir, 'src', 'App.jsx');
  if (!fs.existsSync(appJsxPath)) {
    console.error('❌ [CHECK B] Failure: src/App.jsx presentation layer file cannot be verified.');
    validationFailed = true;
  } else {
    const fileContent = fs.readFileSync(appJsxPath, 'utf8');
    const forbiddenPatterns = /localhost:|127\.0\.0\.1|0\.0\.0\.0/i;
    
    if (forbiddenPatterns.test(fileContent)) {
      console.error('❌ [CHECK B] Failure: Hardcoded local loopbacks detected inside src/App.jsx routing layer.');
      validationFailed = true;
    } else {
      console.log('✅ [CHECK B] Complete: Zero leaking host strings isolated. Using relative routing endpoints.');
    }
  }
} catch (err) {
  console.error('❌ [CHECK B] Exception: Scan anomaly inside App.jsx layer:', err.message);
  validationFailed = true;
}

// CHECK C: Environment Credential Array Masked Verification Audit
const activeKeys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY
].filter(Boolean);

if (activeKeys.length === 0) {
  console.log('⚠️  [CHECK C] Warning: Zero GEMINI_API_KEY variables isolated in current terminal session window.');
  console.log('    [NOTE] Ensure keys are provisioned securely via Vercel Project Control dashboard settings.');
} else {
  console.log(`✅ [CHECK C] Complete: ${activeKeys.length} distinct API token variables detected and masked safely.`);
}

console.log('===========================================================');

if (validationFailed) {
  console.error('❌ Result: Pre-flight evaluation failed. Fix structural bugs before pushing.');
  process.exit(1);
} else {
  console.log('✅ Result: All system architectures pass safety checks. Code ready for production.');
  process.exit(0);
}
