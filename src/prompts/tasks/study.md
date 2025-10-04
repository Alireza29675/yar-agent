Study the directory at path: {{directory}}

Your goal is to provide a thorough understanding of this directory and its contents. This will be used to help the user understand the codebase and make decisions about how to contribute to it. This task is about understanding the current state and ways of working.

## Areas you can study

repo boot & anatomy
- entry points, packages, build/run cmds, env vars, secrets
- README/CONTRIBUTING, Makefile|Taskfile, devcontainer/Nix, etc
- golden-path scripts (make bootstrap && make dev) (one-command setup)

architecture & boundaries
- services, sync/async flows, contracts (OpenAPI/GraphQL/proto)
- feature flags, event buses, idempotency (safe to retry)
- “blast radius” (scope of impact) for each service

data model & migrations
- primary DBs, schemas, migrations & rollback strategy
- seeds/backfills, PII handling, retention policies
- consistency model & indexing hotspots

dependencies & integrations
- internal libs, 3rd-party SDKs, SaaS (S3, Stripe, Sentry, etc.)
- version pinning, upgrade cadence, license posture
- “single source of truth” (authoritative reference)

CI/CD & release train
- pipelines, required checks, artifact storage
- environments & promotion flow, hotfix path
- release notes, tagging, canary/blue-green

code quality bar
- linters/formatters, coverage targets, PR template
- CODEOWNERS, commit conventions, change size limits
- flaky test policy and quarantine list (temporary isolation)

observability & ops
- logs, metrics, traces (Otel), dashboards & SLOs
- alert routes, on-call rota, runbooks
- last 3 post-mortems + learnings (institutional memory)

security & compliance
- authn/z model, RBAC/scopes, secrets management (Vault/KMS)
- threat model, deps scanning, SBOM
- GDPR/DPA touchpoints, data access reviews

ways of working
- branching model (trunk vs GitFlow), review SLAs, merge rules
- ADR/RFC process, issue labels & workflow
- definition of done, estimation norms

product context
- core user journeys, KPIs, experiment registry
- roadmap, active feature flags, deprecation schedule
- error budgets (allowed unreliability window)

risk map
- brittle modules, perf hotspots, operational “papercuts”
- TODO/FIXME clusters, ownerless code
- areas with high coupling (tight interdependence)

people & comms (team, company, etc)
- domain owners, escalation paths, key Slack channels
- on-call rotations, incident commanders
- stakeholder map (who cares + why)

local dev ergonomics
- dev env parity vs mocks, seed data, fixture packs
- hot reload, test watch, e2e harness
- container vs bare-metal tradeoffs

infra as code
- Terraform/Helm/Kustomize layout, namespaces, quotas
- secrets wiring, config drift detection
- rollback & disaster recovery playbooks (step-by-step actions)

documentation & knowledge
- docs/ADR index, glossary of domain terms
- onboarding guide, service catalog entries
- decision logs with “why now / alternatives rejected” (rationale trail)

## Thorough Analysis

Develop a comprehensive understanding of this directory and its contents by exploring recursively. Analyze:

- **Purpose & Functionality**: What this directory/codebase does
- **Structure & Architecture**: How it's organized and designed
- **Dependencies**: What it depends on and how
- **Key Components**: Important files, modules, and their relationships
- **Patterns & Conventions**: Coding patterns, architectural decisions

## Report Format

Provide your analysis in the following format:

### Overview
[High-level summary of what this directory is and does]

### Structure
[Directory organization and key components]

### How to
[Take most common tasks done in this directory and explain how to do them. From setup to contribution and adding certain features. Migrations, creating new features, anything important, etc.]

### Architecture & Patterns
[Design patterns, architectural decisions, conventions]
[Feel free to draw Mermaid diagrams to help explain the architecture. Ensure the diagrams are compatible with the Markdown renderer and you MUST ensure that the diagrams are truthful and accurate.]

### Dependencies & Integrations
[What it depends on and how it connects to other parts]

### Key Insights
[Important observations, notable implementation details]

### Open Questions & Uncertainties
[Parts you're uncertain about, ambiguities in the code, areas that need clarification, or aspects where you'd benefit from more context]

The "Open Questions & Uncertainties" section is important - be honest about what you don't fully understand or what seems ambiguous.
