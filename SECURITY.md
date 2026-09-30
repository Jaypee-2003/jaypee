# Security

This is the portfolio of Jayprakash Behera, a full stack developer for AI-powered products and secure systems. The site is static: there is no backend, no database, no account system, and it stores nothing about its visitors. It's still built as if it were a production system, and this page describes how.

## Reporting a vulnerability

Please report it privately. Don't open a public issue.

- **GitHub:** [open a private security advisory](https://github.com/Jaypee-2003/jaypee/security/advisories/new), or
- **Email:** [jaypeebehera@gmail.com](mailto:jaypeebehera@gmail.com), with "Security" in the subject.

Include what you found, where, and how to reproduce it. I'll acknowledge your report within 3 working days, keep you updated while it's fixed, and credit you in the fix if you'd like.

**In scope:** this repository, its GitHub Actions workflows, and the published site at <https://jaypee-2003.github.io/jaypee/>.

**Out of scope:** GitHub Pages itself, and findings that need a compromised browser or device.

## How the site is hardened

**In the browser**

| Measure | What it does | Where |
|---|---|---|
| Content Security Policy | Scripts load only from this site: no inline script, no `eval`, no workers, no plugins. Nothing can be framed, and forms can't post anywhere. | `public/index.html` |
| Trusted Types | The DOM's script-injection sinks are locked. Only webpack's own policy may create script URLs, for its code-split chunks. | `public/index.html`, `craco.config.js` |
| No third-party requests | Fonts are self-hosted, with no CDNs, analytics, trackers or cookies. The site only ever talks to itself. | `src/index.tsx` |
| Frame protection | GitHub Pages can't send `frame-ancestors` or `X-Frame-Options` headers, so the page refuses to show inside another site's frame. | `public/boot.js` |
| No referrer leakage | `Referrer-Policy: no-referrer`, and every external link opens with `noopener noreferrer`. | `public/index.html` |
| Contact form | There's no server to send to. The form hands a pre-filled message to the visitor's own mail app, after stripping control characters and capping lengths. The recipient is a constant. | `src/content/Dispatch.tsx` |
| No source maps | Production builds don't publish source maps. | `.env` |

**In the pipeline**

| Measure | What it does | Where |
|---|---|---|
| Pinned actions | Every GitHub Action is pinned to a full commit SHA, not a movable tag. | `.github/workflows/` |
| Least-privilege tokens | Workflows start with no permissions. Only the deploy job can write, and only repository contents. Checkout doesn't persist credentials. | `.github/workflows/` |
| Dependency gate | A high- or critical-severity advisory in any dependency the site ships stops the deploy. | `deploy.yml` |
| Code scanning | CodeQL (`security-extended` queries) runs on every push, pull request, and weekly. | `codeql.yml` |
| Dependency updates | Dependabot raises weekly updates for npm and for the pinned actions, and security updates as soon as advisories land. | `.github/dependabot.yml` |
| Reproducible installs | CI installs exact versions from the lockfile with `npm ci`. | `deploy.yml` |

## Limits, stated plainly

- **Policies set in the page, not as headers.** GitHub Pages doesn't allow custom response headers, so the Content Security Policy is delivered with a `<meta>` tag. The directives a `<meta>` policy can't carry (`frame-ancestors`, reporting) are covered by `boot.js` or not available.
- **Inline styles are allowed.** The styling library (Emotion) and the 3D sign renderer set styles at runtime, so styles permit `'unsafe-inline'`. Scripts don't: no script can be injected that way.
- **The build toolchain has advisories that don't ship.** Create React App's build tooling carries known advisories in dev-only packages. None of that code reaches the browser. The deploy gate audits only what ships.
