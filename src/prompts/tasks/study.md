Study the directory at path: {{directory}}

Your goal is to provide a thorough understanding of this directory and its contents. This will be used to help the user understand the codebase and make decisions about how to contribute to it. This task is about understanding the current state and ways of working.

**IMPORTANT - Output File**:
- You MUST write your analysis to the output file at: {{outputFile}}
- FIRST, check if the output file already exists by reading it
- If the file exists, use Edit tool to update it with your new findings
- If the file doesn't exist, create it with Write tool, then use Edit tool for all subsequent updates
- Write your analysis progressively as you investigate - don't wait until the end
- For iterative updates, ALWAYS use the Edit tool to modify specific sections - DO NOT use Write to replace the entire file repeatedly

**IMPORTANT - Date**: Include the current date at the very beginning of your analysis output. This analysis is time-sensitive and the date provides crucial context for when this snapshot was taken.

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

Develop a comprehensive understanding of this directory and its contents by exploring recursively. You could analyze:

- **Purpose & Functionality**: What this directory/codebase does
- **Structure & Architecture**: How it's organized and designed
- **How to**: How to do the most common tasks in this directory
- **Ways of working**: How things are done in this directory
- **Dependencies**: What it depends on and how
- **Key Components**: Important files, modules, and their relationships
- **Testing**: How testing is done in this directory
- **Performance**: How performance is optimized in this directory
- **Security**: How security is implemented in this directory
- **Reliability**: How reliability is ensured in this directory
- **Scalability**: How scalability is ensured in this directory
- **Maintainability**: How maintainability is ensured in this directory
- **Error Handling**: How error handling is implemented in this directory
- **Observability**: How observability is ensured in this directory
- **Experiments**: How experiments are done in this directory
- **Vulnerabilities**: How vulnerabilities are identified and mitigated in this directory
- **History**: How the directory/codebase has evolved over time. What are the newer ways of doing things vs older ways of doing things if relevant.
- **Documentation**: How documentation is ensured in this directory
- **Community**: How community is ensured in this directory
- **Patterns & Conventions**: Coding patterns, architectural decisions

## Report Format

Here is a possible format for your analysis. You could adjust it to the task at hand. you could exclude any section and add any section you think is relevant:

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
[What it depends on and how it connects to other parts. This could include other services, notable dependencies, protocols of communication, tooling, etc.]

### Key Insights
[Important observations, notable implementation details]

### Open Questions & Uncertainties (ALWAYS INCLUDE THIS SECTION!)
[Parts you're uncertain about, ambiguities in the code, areas that need clarification, or aspects where you'd benefit from more context]

The "Open Questions & Uncertainties" section is important - be honest about what you don't fully understand or what seems ambiguous.
