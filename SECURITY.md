# Security policy

## Scope and reporting

Security fixes target the current development version. There is no published
support schedule for older releases.

If this repository's GitHub Security tab offers **Report a vulnerability**, use
[private vulnerability reporting](https://github.com/fbnkch/matchplan-academy/security/advisories/new).
That option depends on private reporting being enabled for the repository.
Do not post exploit details, credentials, private backups, or personal data in a
public issue. If private reporting is unavailable, open a minimal issue requesting
a private reporting channel without disclosing the vulnerability. No response-time
guarantee or separate security email is currently published.

A useful private report includes affected files/version, a minimal reproduction,
expected impact, and any suggested fix. Use synthetic data where possible.

## Execution boundary

Python and SQL run in a Pyodide Web Worker on the learner's device. The worker
keeps normal analysis away from the UI thread and supports timeouts/cancellation.
It is not a hardened environment for malicious code, a multi-user execution
service, or a tamper-resistant examination system. Fresh variable namespaces and
worker termination are lifecycle controls, not a security isolation guarantee.
Only run code you understand and trust in this personal learning environment.

The main application needs no API credentials. Copied upstream AI/RAG demos are
separate study material and may contact external services when run. They were
not executed or security-audited by this project. Review their code, dependencies,
provider terms, and credential handling before independently running them.

## Progress and privacy

Learning progress, entered code, notes, and reports are stored in localStorage
for the current browser origin. There is no application account database or
cloud synchronization. JSON backups and portfolio ZIPs include user-entered
content. Review them before sharing, and export a backup before removing browser
site data. Anyone with access to the browser profile can potentially read it.

Local execution does not imply that all browser activity is offline. Initial
runtime preparation downloads pinned packages; external links and explicitly
loaded media can contact their providers. A hosted deployment also involves its
hosting provider's own infrastructure and access logs.

Public repository access does not determine access to a hosted app. Private
hosting requires deployment-level access protection, as described in
[deployment](docs/deployment.md); localStorage is not authentication. Keep secrets
out of source code, notebooks, exports, build output, and environment variables
exposed to the browser. Frontend bundles are readable by anyone who can access them.

## Dependencies and provenance

The runtime preparation script checks downloaded Python package hashes against
the pinned Pyodide manifest. Example manifests detect changes to copied source
files. These checks help reproducibility and integrity; they do not prove that
an upstream package is free from vulnerabilities. Preserve license notices and
review dependency/provenance changes separately from course exercises.
