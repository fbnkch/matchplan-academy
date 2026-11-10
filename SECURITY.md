# Security

Python runs on the learner's device in a Web Worker. The worker supports timeouts
and cancellation, but it is not a hardened sandbox for malicious code. Run code
you trust. The optional upstream demos may need external services and were not
executed or security-audited by this project.

Progress, code, and notes stay in the current browser's localStorage. Export a
backup before clearing site data, and review backups before sharing them. There
is no cloud synchronization. Runtime downloads, external media, and hosting can
contact their respective providers.

The repository is public; access to a hosted copy is a separate setting. Private
Vercel hosting requires Vercel Authentication on all deployments, configured in
the Vercel dashboard. `vercel.json` does not enable it. Keep credentials out of
frontend code, notebooks, and exports.

Report vulnerabilities through [GitHub private reporting](https://github.com/fbnkch/matchplan-academy/security/advisories/new)
if available. Otherwise, open an issue requesting a private contact without
publishing exploit details or personal data. Fixes target the current version;
there is no response-time guarantee or support schedule for older releases.
