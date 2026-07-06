// Clone private obsidian_vault repo using GH_TOKEN from environment
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const token = process.env.GH_TOKEN;
const targetDir = path.resolve(__dirname, '..', 'content', 'obsidian');

if (!token) {
  console.error('Error: GH_TOKEN environment variable is not set');
  process.exit(1);
}

// Remove existing directory
fs.rmSync(targetDir, { recursive: true, force: true });

// Clone directly with token in URL (bypasses credential store issues)
const authUrl = `https://${token}@github.com/Yanch-ers/obsidian_vault.git`;
execSync(`git clone --depth 1 "${authUrl}" "${targetDir}"`, {
  stdio: 'inherit',
  env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
});

// Remove .git so Astro treats it as plain files (not submodule)
const gitDir = path.join(targetDir, '.git');
if (fs.existsSync(gitDir)) {
  fs.rmSync(gitDir, { recursive: true, force: true });
}

console.log('Content repository cloned successfully');
