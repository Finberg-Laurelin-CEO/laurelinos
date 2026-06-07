import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { appendAuditEvent, ensureLocalConfig } from './config.mjs';

export const LICENSE_FEATURES = [
  'founder-brief',
  'open-loops',
  'meeting-prep',
  'mcp'
];

export function getLicensePath(cwd = process.cwd()) {
  const { configDir } = ensureLocalConfig(cwd);
  return path.join(configDir, 'license.json');
}

export function hashActivationToken(token) {
  return crypto.createHash('sha256').update(token, 'utf8').digest('hex');
}

export function readLicenseStatus(cwd = process.cwd()) {
  const licensePath = getLicensePath(cwd);
  if (!fs.existsSync(licensePath)) {
    return {
      status: 'demo',
      product: 'LaurelinOS',
      plan: 'free-demo',
      licensePath,
      paidFeaturesActive: false,
      demoCommandsAvailable: true,
      licenseRequiredForDemo: false,
      features: ['doctor', 'init-local', 'sources', 'audit', 'brief-demo', 'open-loops-demo', 'mcp-stdio'],
      notes: [
        'No local license file found.',
        'Synthetic demo commands remain available without a license.',
        'Paid FounderOS pilots should use a Laurelin-issued activation token later.'
      ]
    };
  }

  const license = JSON.parse(fs.readFileSync(licensePath, 'utf8'));
  return {
    status: license.status,
    product: license.product,
    plan: license.plan,
    subject: license.subject,
    licensePath,
    activatedAt: license.activatedAt,
    paidFeaturesActive: license.status === 'local-activated',
    demoCommandsAvailable: true,
    licenseRequiredForDemo: false,
    features: license.features ?? [],
    notes: license.notes ?? []
  };
}

export function activateLocalLicense(token, cwd = process.cwd()) {
  if (!token || token.length < 16) {
    throw new Error('Activation token is required and must be at least 16 characters.');
  }

  const tokenHash = hashActivationToken(token);
  const activatedAt = new Date().toISOString();
  const licensePath = getLicensePath(cwd);
  const license = {
    licenseVersion: 1,
    product: 'FounderOS',
    subject: 'local-pilot',
    plan: 'founderos-pilot',
    status: 'local-activated',
    activatedAt,
    entitlementSource: 'manual-local-token',
    tokenHash,
    features: LICENSE_FEATURES,
    notes: [
      'Local-only activation record for manual FounderOS pilots.',
      'This token was not validated against Stripe or a hosted entitlement service.',
      'The raw activation token is not stored.'
    ]
  };

  fs.writeFileSync(licensePath, JSON.stringify(license, null, 2) + '\n', { mode: 0o600 });
  const event = appendAuditEvent('license_activated_local', {
    product: license.product,
    plan: license.plan,
    status: license.status,
    tokenHash
  }, cwd);

  return { license, licensePath, auditEvent: event };
}
