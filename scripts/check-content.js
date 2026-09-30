// Checks src/data/profile.ts before every build (npm run check, and automatically before npm run build).
// Each sign in the yard has a fixed size, and the yard lays itself out from the content, so this catches the
// things that would break it: text too long for its sign, too many items for a list, a missing field, a
// duplicate project id, a link that isn't https. Every problem is reported with where it is and what to do.
// The limits are listed in CONTENT.md; keep the two in step.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');

const FILE = path.join(__dirname, '..', 'src', 'data', 'profile.ts');

// Load the TypeScript data file as plain JavaScript
const source = fs.readFileSync(FILE, 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});
const sandbox = { module: { exports: {} }, exports: {} };
sandbox.exports = sandbox.module.exports;
vm.runInNewContext(outputText, sandbox, { filename: 'profile.ts' });
const data = sandbox.module.exports;

const problems = [];
const fail = (where, message) => problems.push(`  ✗ ${where}: ${message}`);

const text = (where, value, max, { optional = false } = {}) => {
  if (value === undefined && optional) return;
  if (typeof value !== 'string' || !value.trim()) return fail(where, 'is required (text)');
  if (value.length > max) fail(where, `is ${value.length} characters; the sign fits ${max}. Shorten it.`);
};
const list = (where, value, min, max, each) => {
  if (!Array.isArray(value)) return fail(where, 'must be a list');
  if (value.length < min) fail(where, `needs at least ${min} item${min === 1 ? '' : 's'}`);
  if (value.length > max) fail(where, `has ${value.length} items; the sign fits ${max}. Remove some.`);
  if (each) value.forEach((item, i) => each(`${where}[${i}]`, item));
};
const url = (where, value) => {
  if (typeof value !== 'string' || !/^https:\/\/[^\s]+$/.test(value)) fail(where, 'must be a full https:// link');
};

/* ───────── person, contact, availability ───────── */

const { person, contact, availability, experience, expertise, siteSecurity, projects, skillGroups, education } = data;

text('person.name', person?.name, 28);
text('person.firstName', person?.firstName, 16);
text('person.lastName', person?.lastName, 16);
text('person.role', person?.role, 48);
text('person.pitch', person?.pitch, 150);
text('person.summary', person?.summary, 280);
list('person.specialties', person?.specialties, 1, 4, (w, v) => text(w, v, 14));
list('person.coreStack', person?.coreStack, 1, 6, (w, v) => text(w, v, 14));
list('person.security', person?.security, 1, 4, (w, v) => text(w, v, 40));
list('person.ai', person?.ai, 1, 4, (w, v) => text(w, v, 40));

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact?.email ?? '')) fail('contact.email', 'must be an email address');
url('contact.github', contact?.github);
url('contact.linkedin', contact?.linkedin);
text('contact.githubHandle', contact?.githubHandle, 28);
text('contact.linkedinHandle', contact?.linkedinHandle, 28);

text('availability.status', availability?.status, 32);
text('availability.engagements', availability?.engagements, 30);
text('availability.mode', availability?.mode, 20);
text('availability.responseTime', availability?.responseTime, 24);
text('availability.timeZoneLabel', availability?.timeZoneLabel, 20);
try {
  new Intl.DateTimeFormat('en', { timeZone: availability?.timeZone });
} catch {
  fail('availability.timeZone', 'must be an IANA time zone, like "Asia/Kolkata"');
}

/* ───────── experience (the loading bay) ───────── */

text('experience.client', experience?.client, 14);
if (!/^[A-Z]{2,4}$/.test(experience?.code ?? '')) fail('experience.code', 'must be 2–4 capital letters, like "DKD"');
text('experience.company', experience?.company, 30);
text('experience.location', experience?.location, 24);
text('experience.start', experience?.start, 10);
text('experience.end', experience?.end, 10);
text('experience.brief', experience?.brief, 110);
list('experience.modules', experience?.modules, 1, 6, (w, v) => text(w, v, 10));
text('experience.architecture.gateway', experience?.architecture?.gateway, 28);
{
  // Same geometry as BAY in src/scene/layout.ts: tanks stand 5.8 m apart along the API gantry
  const n = Math.max(experience?.modules?.length ?? 1, 1);
  const x0 = Math.min(0.6 - (n - 1) * 3.4 - 2.6, -12.2);
  const maxStores = Math.max(1, Math.floor((3.2 - 1.5 - (x0 + 2.8)) / 5.8) + 1);
  list('experience.architecture.stores', experience?.architecture?.stores, 1, maxStores, (w, v) => text(w, v, 10));
}
text('experience.headline.value', experience?.headline?.value, 7);
text('experience.headline.label', experience?.headline?.label, 70);
list('experience.work', experience?.work, 1, 4, (w, v) => {
  text(`${w}.title`, v?.title, 26);
  text(`${w}.detail`, v?.detail, 70);
});

/* ───────── AI & security ───────── */

text('expertise.ai.label', expertise?.ai?.label, 24);
text('expertise.ai.title', expertise?.ai?.title, 34);
text('expertise.ai.lead', expertise?.ai?.lead, 170);
list('expertise.ai.practices', expertise?.ai?.practices, 1, 4, (w, v) => {
  text(`${w}.title`, v?.title, 26);
  text(`${w}.detail`, v?.detail, 110);
});
list('expertise.ai.shipped', expertise?.ai?.shipped, 0, 3, (w, v) => {
  text(`${w}.project`, v?.project, 16);
  text(`${w}.what`, v?.what, 52);
  text(`${w}.via`, v?.via, 32);
});
list('expertise.ai.stack', expertise?.ai?.stack, 1, 6, (w, v) => text(w, v, 22));
text('expertise.security.label', expertise?.security?.label, 24);
text('expertise.security.title', expertise?.security?.title, 30);
text('expertise.security.lead', expertise?.security?.lead, 170);
list('expertise.security.practices', expertise?.security?.practices, 1, 4, (w, v) => {
  text(`${w}.title`, v?.title, 28);
  text(`${w}.detail`, v?.detail, 120);
});
list('siteSecurity', siteSecurity, 1, 6, (w, v) => {
  text(`${w}.title`, v?.title, 32);
  text(`${w}.detail`, v?.detail, 80);
});

/* ───────── projects (the project row) ───────── */

list('projects', projects, 1, 10, (w, p) => {
  const where = `${w} (${p?.title ?? p?.id ?? 'untitled'})`;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p?.id ?? '')) fail(`${where}.id`, 'must be lowercase letters, numbers and hyphens, like "my-project"');
  text(`${where}.code`, p?.code, 8);
  text(`${where}.title`, p?.title, 18);
  text(`${where}.tagline`, p?.tagline, 44);
  text(`${where}.summary`, p?.summary, 200);
  list(`${where}.highlights`, p?.highlights, 1, 3, (hw, h) => text(hw, h, 90));
  list(`${where}.stack`, p?.stack, 1, 7, (sw, s) => text(sw, s, 16));
  if (Array.isArray(p?.stack) && p.stack.join(' · ').length > 90) fail(`${where}.stack`, 'is too long for one line on the manifest; drop an item or two');
  list(`${where}.metrics`, p?.metrics, 0, 3, (mw, m) => {
    text(`${mw}.value`, m?.value, 6);
    text(`${mw}.label`, m?.label, 26);
  });
  list(`${where}.links`, p?.links, 0, 2, (lw, l) => {
    url(`${lw}.href`, l?.href);
    if (!['live', 'github'].includes(l?.kind)) fail(`${lw}.kind`, 'must be "live" or "github"');
  });
  const ins = p?.instrument;
  if (ins !== undefined) {
    const iw = `${where}.instrument`;
    text(`${iw}.title`, ins.title, 22);
    if (ins.kind === 'checklist') {
      list(`${iw}.items`, ins.items, 1, 4, (x, v) => text(x, v, 24));
      text(`${iw}.state`, ins.state, 8, { optional: true });
    } else if (ins.kind === 'pipeline') {
      list(`${iw}.steps`, ins.steps, 2, 5, (x, v) => text(x, v, 18));
      text(`${iw}.total`, ins.total, 8);
    } else if (ins.kind === 'keypad') {
      list(`${iw}.keys`, ins.keys, 2, 4, (x, v) => text(x, v, 8));
      text(`${iw}.display`, ins.display, 24);
    } else if (ins.kind === 'reader') {
      text(`${iw}.caption`, ins.caption, 24);
    } else {
      fail(`${iw}.kind`, 'must be "checklist", "pipeline", "keypad" or "reader"');
    }
  }
});
const ids = (projects ?? []).map((p) => p.id);
ids.filter((id, i) => ids.indexOf(id) !== i).forEach((id) => fail('projects', `the id "${id}" is used twice; ids must be unique`));

/* ───────── skills (the signal gantry) and education ───────── */

list('skillGroups', skillGroups, 1, 8, (w, g) => {
  text(`${w}.name`, g?.name, 16);
  list(`${w}.skills`, g?.skills, 1, 9, (x, v) => text(x, v, 14));
});
list('education', education, 1, 3, (w, e) => {
  text(`${w}.years`, e?.years, 13);
  text(`${w}.degree`, e?.degree, 36);
  text(`${w}.school`, e?.school, 28);
});

if (problems.length) {
  console.error(`\nsrc/data/profile.ts has ${problems.length} problem${problems.length === 1 ? '' : 's'}:\n`);
  console.error(problems.join('\n'));
  console.error('\nLimits and examples: CONTENT.md\n');
  process.exit(1);
}
console.log(
  `✓ content OK — ${projects.length} projects, ${experience.modules.length} bay modules, ${skillGroups.length} skill groups, ${education.length} education entries`,
);
