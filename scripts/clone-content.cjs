const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const token = process.env.GH_TOKEN;
const giteeToken = process.env.GITEE_TOKEN;
const targetDir = path.resolve(__dirname, '..', 'content', 'obsidian');

fs.rmSync(targetDir, { recursive: true, force: true });

const cloneOptions = {
  stdio: 'inherit',
  env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
  timeout: 120000,
};

function tryClone(url) {
  try {
    console.log(`Attempting to clone: ${url.replace(/:\/\/[^@]+@/, '://***@')}`);
    execSync(`git clone --depth 1 "${url}" "${targetDir}"`, cloneOptions);
    return true;
  } catch (e) {
    console.error(`Clone failed: ${e.message}`);
    return false;
  }
}

let success = false;

if (token) {
  const githubUrl = `https://${token}@github.com/Yanch-ers/obsidian_vault.git`;
  success = tryClone(githubUrl);
}

if (!success && giteeToken) {
  const giteeUrl = `https://${giteeToken}@gitee.com/Yanch-ers/obsidian_vault.git`;
  success = tryClone(giteeUrl);
}

if (!success && token) {
  const githubMirrorUrl = `https://${token}@hub.fastgit.org/Yanch-ers/obsidian_vault.git`;
  success = tryClone(githubMirrorUrl);
}

if (!success) {
  console.error('Error: Failed to clone content repository from all sources');
  process.exit(1);
}

const gitDir = path.join(targetDir, '.git');
if (fs.existsSync(gitDir)) {
  fs.rmSync(gitDir, { recursive: true, force: true });
}

// Convert all .md files from CRLF to LF to prevent YAML parse errors on Linux
function convertLineEndings(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += convertLineEndings(fullPath);
    } else if (entry.name.endsWith('.md')) {
      const buf = fs.readFileSync(fullPath);
      if (buf.includes(Buffer.from('\r\n'))) {
        fs.writeFileSync(fullPath, buf.toString('utf8').replace(/\r\n/g, '\n'));
        count++;
      }
    }
  }
  return count;
}

const converted = convertLineEndings(targetDir);
console.log(`Content repository cloned successfully (${converted} md files converted to LF)`);
