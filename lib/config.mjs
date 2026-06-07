import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export function repoRootFromImport(importMetaUrl) {
  const filePath = new URL(importMetaUrl).pathname;
  return path.resolve(path.dirname(filePath), '..');
}

export function getConfigDir(cwd = process.cwd()) {
  return process.env.LAURELINOS_CONFIG_DIR
    ? path.resolve(process.env.LAURELINOS_CONFIG_DIR)
    : path.join(cwd, '.laurelinos');
}

export function ensureLocalConfig(cwd = process.cwd()) {
  const configDir = getConfigDir(cwd);
  fs.mkdirSync(path.join(configDir, 'logs'), { recursive: true });
  fs.mkdirSync(path.join(configDir, 'state'), { recursive: true });

  const configPath = path.join(configDir, 'config.json');
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({
      version: 1,
      mode: 'local',
      createdAt: new Date().toISOString(),
      machine: {
        hostname: os.hostname(),
        platform: os.platform(),
        arch: os.arch()
      },
      safety: {
        externalActionsRequireApproval: true,
        indexDiscoveredPathsAutomatically: false,
        secretsAllowedInLogs: false
      }
    }, null, 2) + '\n');
  }

  const sourcesPath = path.join(configDir, 'sources.json');
  if (!fs.existsSync(sourcesPath)) {
    fs.writeFileSync(sourcesPath, JSON.stringify({ sources: [] }, null, 2) + '\n');
  }

  return { configDir, configPath, sourcesPath };
}

export function readSources(cwd = process.cwd()) {
  const { sourcesPath } = ensureLocalConfig(cwd);
  return JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
}

export function writeSources(data, cwd = process.cwd()) {
  const { sourcesPath } = ensureLocalConfig(cwd);
  fs.writeFileSync(sourcesPath, JSON.stringify(data, null, 2) + '\n');
}
