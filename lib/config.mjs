import crypto from 'node:crypto';
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

  const auditPath = path.join(configDir, 'logs', 'audit.jsonl');
  if (!fs.existsSync(auditPath)) {
    fs.writeFileSync(auditPath, '');
  }

  return { configDir, configPath, sourcesPath, auditPath };
}

export function readSources(cwd = process.cwd()) {
  const { sourcesPath } = ensureLocalConfig(cwd);
  return JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
}

export function writeSources(data, cwd = process.cwd()) {
  const { sourcesPath } = ensureLocalConfig(cwd);
  fs.writeFileSync(sourcesPath, JSON.stringify(data, null, 2) + '\n');
}

export function appendAuditEvent(type, details = {}, cwd = process.cwd()) {
  const { auditPath } = ensureLocalConfig(cwd);
  const event = {
    id: crypto.randomUUID(),
    type,
    createdAt: new Date().toISOString(),
    actor: 'local-user',
    details
  };
  fs.appendFileSync(auditPath, JSON.stringify(event) + '\n');
  return event;
}

export function readAuditEvents(cwd = process.cwd()) {
  const { auditPath } = ensureLocalConfig(cwd);
  const content = fs.readFileSync(auditPath, 'utf8').trim();
  if (!content) return [];
  return content.split('\n').map((line) => JSON.parse(line));
}
