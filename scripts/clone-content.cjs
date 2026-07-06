// Clone private obsidian_vault repo using GH_TOKEN from environment
const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const token = process.env.GH_TOKEN;
const targetDir = path.resolve(__dirname, '..', 'content', 'obsidian');
const repoUrl = 'https://github.com/Yanch-ers/obsidian_vault.git';

if (!token) {
  console.error('Error: GH_TOKEN environment variable is not set');
  process.exit(1);
}

// Remove existing directory
fs.rmSync(targetDir, { recursive: true, force: true });

// Write git credentials
const credFile = path.join(os.homedir(), '.git-credentials');
fs.writeFileSync(credFile, `https://${token}@github.com\n`);

// Clone
execSync(`git clone --depth 1 ${repoUrl} "${targetDir}"`, { stdio: 'inherit' });

// Remove .git to avoid submodule confusion
const gitDir = path.join(targetDir, '.git');
if (fs.existsSync(gitDir)) {
  fs.rmSync(gitDir, { recursive: true, force: true });
}

console.log('Content repository cloned successfully');
