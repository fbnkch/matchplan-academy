# Private hosting on Vercel

The source repository is public. The owner's hosted instance requires Vercel
Authentication on **all deployments**, including the production domain. Anyone
can inspect or run the public code; learning records remain in each browser's
localStorage.

## Build configuration

Use Vercel Hobby for this personal application, Node.js 24, and the Vite preset:

| Setting           | Value                      |
| ----------------- | -------------------------- |
| Project           | `matchplan-academy`        |
| Repository        | `fbnkch/matchplan-academy` |
| Production branch | `main`                     |
| Install           | `npm ci`                   |
| Build             | `npm run build`            |
| Output            | `dist`                     |

The checked-in `vercel.json` supplies build settings and response headers. It
**does not** enable authentication. No server functions, database, application
secrets, or paid AI services are required. Package preparation downloads the
pinned Python runtime and verifies analysis-package hashes before building.
Only `dist` is served; IDE example folders are not public asset directories.

## Protect before deploying

1. Create the project in the intended personal Hobby account. Do not activate a
   paid trial, add-on, or separate team subscription for this application.
2. Set Security > Deployment Protection > Vercel Authentication to **All
   Deployments** before connecting or deploying the course. The REST API calls
   this setting `ssoProtection.deploymentType: "all"`.
3. Keep access limited to the owner. Do not create public share links, protection
   exceptions, or bypass tokens as part of setup.
4. Connect the repository through the Vercel GitHub integration. Future pushes
   to `main` can then build production; pull requests can create protected previews.
5. Verify the production alias, immutable deployment URL, and direct asset URLs
   without credentials. Each must require authentication. A local build or a
   successful API settings update alone does not verify the deployed boundary.

Since September 2026, Vercel documents production authentication as available
without an extra charge on all plans. Older articles describe different limits.
Check the actual account settings and current Hobby limits; free hosting is
subject to usage limits and is not unlimited availability.

## Administrative commands

These require the owner's own Vercel/GitHub authorization. Credentials belong
in the CLI's private storage, never this repository or frontend environment
variables.

```sh
npx vercel login
npx vercel link --project matchplan-academy
npx vercel git connect
```

Configure and verify protection before running `npx vercel --prod`. The optional
`npm run hosting:vercel` command prepares static upload folders locally; it does
not deploy, connect Git, or configure access control.

## Progress when moving addresses

Before leaving localhost, export a JSON backup in the application. Import it on
the hosted origin. Browser storage is specific to the exact origin and does not
sync between devices. Vercel authentication protects hosted assets; it does not
upload or back up learning records.

Default distribution uses original synthetic teaching data. Optional real
StatsBomb downloads remain in ignored `.local/`; they are not build inputs and
must not be added to public assets, Git, or deployment uploads.

## References

- [Free protection for production deployments](https://vercel.com/changelog/protect-production-deployments-for-free-on-every-plan)
- [Vercel Authentication](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication)
- [Hobby plan and limits](https://vercel.com/docs/plans/hobby)
- [GitHub integration](https://vercel.com/docs/git/vercel-for-github)
