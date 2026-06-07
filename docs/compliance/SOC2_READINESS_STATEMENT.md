# SOC 2 Readiness Statement Draft

Status: draft for future website. Do not claim SOC 2 compliance until an audit has been completed.

## Website-safe wording

LaurelinOS is not currently SOC 2 certified.

We are designing the product with SOC 2 readiness in mind, including controls around security, availability, confidentiality, processing integrity, and privacy. As the product matures and customer requirements justify it, Laurelin intends to pursue a formal SOC 2 readiness assessment and independent audit.

## Current security posture

LaurelinOS is designed to be:

- local-first;
- source-scoped;
- explicit about what data is connected;
- approval-gated for external actions;
- careful about secrets;
- compatible with customer-owned model accounts and infrastructure.

## Current controls to implement

### Security

- No secrets committed to GitHub.
- Empty `.env.example` only.
- Least-privilege source connections.
- Explicit approval for external actions.
- Authentication for hosted services later.

### Availability

- Local mode should continue to work without Laurelin-hosted inference.
- Hosted services later should include backups, monitoring, and incident response.

### Confidentiality

- Public repo uses synthetic data only.
- Customer Content should remain local by default.
- Hosted/managed mode requires explicit customer authorisation.

### Processing integrity

- Workflows should be testable.
- External actions should require approval.
- Generated outputs should include source references where available.

### Privacy

- Minimise data collection.
- Avoid content telemetry by default.
- Provide deletion instructions.

## Do not say

Do not say:

- "SOC 2 compliant";
- "SOC 2 certified";
- "audited";
- "enterprise-grade compliance".

Unless those claims are true and documented.
