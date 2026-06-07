# Licence Decision

## Current decision

LaurelinOS is proprietary evaluation software going forward.

It is not MIT licensed, not open source, and not licensed for production, redistribution, hosting, public forks/mirrors, AI training datasets, competitive use, or commercial use without a separate written agreement with Laurelin.

Repository protections now include:

```json
{
  "private": true,
  "license": "UNLICENSED"
}
```

and a blocking npm `prepublishOnly` script to reduce accidental publication.

## What the licence is intended to prevent

The current `LICENSE` is intended to prohibit, unless Laurelin gives written permission:

- copying, redistributing, mirroring, repackaging, sublicensing, or selling LaurelinOS;
- public forks, public mirrors, package distributions, container images, hosted demos, or derivative repositories;
- production use, internal business use beyond evaluation, paid customer use, hosted/managed services, consulting/service-bureau use, or resale;
- using LaurelinOS to build, benchmark, train, evaluate, support, or improve a competing product;
- using repository contents for AI/ML training, fine-tuning, distillation, embeddings, retrieval corpora, benchmark datasets, synthetic-data generation, model evaluation, or automated code-generation datasets;
- bypassing or misrepresenting licence, entitlement, approval, audit, safety, or source-scoping mechanisms.

## Important caveat

A licence change applies going forward. It does not retroactively revoke rights that may have been validly granted for earlier versions under a previous licence.

Also, a stronger licence is not the same as technical copy protection. Public visibility still creates practical copying risk. For material that must never be copied, keep it out of the public repo.

## Commercial direction

Commercial use, production use, redistribution, hosted/managed services, paid pilots, and customer deployments require a separate written agreement with Laurelin.

## Follow-up before major launch

Have an attorney review the licence before broad external promotion, npm publication, paid pilots at scale, enterprise sales, or enforcement.
