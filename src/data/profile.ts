// Single source for portfolio content. Both presentations (the 3D yard and the plain page) read from here,
// and the yard lays itself out from it: add a project and a new container stack, camera stop, manifest and
// photograph appear; remove one and its place closes up. The same goes for loading-bay modules and skill groups.
//
// How to edit, field by field, with the limits each sign can hold: see CONTENT.md.
// `npm run check` (also run automatically before every build) validates this file against those limits.

export const person = {
  name: 'Jayprakash Behera',
  firstName: 'Jayprakash',
  lastName: 'Behera',
  role: 'Full Stack Developer · AI & Security',
  pitch:
    'Full stack developer for AI-powered products and secure systems — taking them from architecture to production.',
  summary:
    'I build AI-powered applications, secure multi-role backends and scalable SaaS platforms with React.js, Node.js, Python, Docker and AWS — and I own both the architecture and the delivery.',
  // Painted along the gate's top container
  specialties: ['Full stack', 'AI', 'Security'],
  coreStack: ['React.js', 'Node.js', 'Python', 'Docker', 'AWS'],
  security: ['JWT auth on every request', 'RBAC — least privilege by role', 'Activity logging & integrity checks', 'Multi-role workflows, designed in'],
  ai: ['LLM features via OpenRouter', 'AI grounded in product data', 'Python · FastAPI · Node.js services'],
};

// AI and security, told only through shipped work (projects and experience below). Each practice names
// the evidence behind it.
export const expertise = {
  ai: {
    label: 'AI in production',
    title: 'AI that ships inside the product',
    lead: "Model-powered features built into real products: fed by the product's own data, running behind its sign-in, and fast enough that people actually use them.",
    practices: [
      {
        title: 'Model-agnostic',
        detail: "LLMs reached through OpenRouter's single API, so models can be swapped without rewriting the product.",
      },
      {
        title: 'Grounded in real data',
        detail: "Devanta reads a GitHub profile's public work before it generates a word.",
      },
      {
        title: 'Behind the same locks',
        detail: "EduExamine's assistant lives inside its JWT + RBAC platform, behind the same sign-in as everything else.",
      },
      {
        title: 'Fast enough to matter',
        detail: 'Devanta goes from a GitHub profile to a deployable portfolio in under 60 seconds.',
      },
    ],
    shipped: [
      { project: 'EduExamine', what: 'AI academic assistant — contextual support and chat', via: 'OpenRouter APIs' },
      { project: 'Devanta', what: 'GitHub profile → deployable portfolio', via: 'Analysis + generation · < 60 s' },
    ],
    stack: ['Python', 'FastAPI', 'Node.js', 'OpenRouter LLM APIs'],
  },
  security: {
    label: 'Security',
    title: 'Designed in, not bolted on',
    lead: 'Every system starts from who can do what. Identity, roles and an audit trail are part of the first schema, not a patch added later.',
    practices: [
      { title: 'Identity on every request', detail: 'JWT-authenticated REST APIs across every Dukaan Dost module.' },
      {
        title: 'Least privilege, by role',
        detail: 'RBAC for multi-role workflows: students, faculty and admins each get only their own dashboard and permissions.',
      },
      {
        title: 'Integrity you can prove',
        detail: 'EduExamine logs activity and enforces fullscreen and tab-switch detection during live exams.',
      },
      { title: 'Contained delivery', detail: 'Services shipped as Docker containers on AWS: isolated and reproducible.' },
    ],
  },
};

// This site's own hardening, each item implemented in this repository (see SECURITY.md)
export const siteSecurity = [
  { title: 'Strict Content Security Policy', detail: 'Scripts only from this site. No inline code, no eval, no plugins.' },
  { title: 'Trusted Types', detail: 'The DOM’s injection points are locked; only reviewed script URLs load.' },
  { title: 'Zero third-party requests', detail: 'Fonts self-hosted. No analytics, no trackers, no cookies.' },
  { title: 'Refuses to be framed', detail: 'Won’t render inside another site, so it can’t be used for clickjacking.' },
  { title: 'Nothing leaves your browser', detail: 'The contact form hands off to your own mail app. Nothing is stored.' },
  { title: 'Supply chain checked', detail: 'CI actions pinned to commits, dependencies watched, CodeQL on every push.' },
];

export const contact = {
  email: 'jaypeebehera@gmail.com',
  github: 'https://github.com/Jaypee-2003',
  githubHandle: 'Jaypee-2003',
  linkedin: 'https://www.linkedin.com/in/jayprakash-behera-69a212252',
  linkedinHandle: 'in/jayprakash-behera',
};

export const availability = {
  status: 'Available for freelance work',
  engagements: 'Freelance · Contract',
  mode: 'Remote',
  responseTime: 'Within 24 hours',
  timeZone: 'Asia/Kolkata',
  timeZoneLabel: 'IST · UTC+5:30',
};

export const experience = {
  client: 'Dukaan Dost',
  // Short code stencilled on the module containers (DKD-01, DKD-02, …)
  code: 'DKD',
  company: 'Arkine Technologies',
  location: 'Mumbai · Remote',
  start: '09/2025',
  end: 'Present',
  brief: 'Scaling a multi-module SaaS platform spanning inventory, task, vendor and order systems.',
  // One container per module hangs from the API gantry in the loading bay
  modules: ['Inventory', 'Tasks', 'Vendors', 'Orders'],
  // The gantry beam every module hangs from, and the data stores it's piped into (one tank each)
  architecture: {
    gateway: 'REST API · JWT + RBAC',
    stores: ['Redis', 'MongoDB'],
  },
  headline: {
    value: '30–40%',
    label: 'API performance gain after introducing a Redis caching layer',
  },
  work: [
    { title: 'Secure REST APIs', detail: 'JWT + RBAC for multi-role workflows across every module.' },
    { title: 'Redis caching', detail: 'A caching layer that improved API performance by 30–40%.' },
    { title: 'MongoDB tuning', detail: 'Optimized for high-concurrency workloads.' },
    { title: 'Containerized delivery', detail: 'Services shipped with Docker & Docker Compose.' },
  ],
};

export type Instrument =
  | { kind: 'checklist'; title: string; items: string[]; state?: string }
  | { kind: 'pipeline'; title: string; steps: string[]; total: string }
  | { kind: 'keypad'; title: string; keys: string[]; display: string }
  | { kind: 'reader'; title: string; caption: string };

export interface ProjectLink {
  label: string;
  href: string;
  kind: 'live' | 'github';
}

// A project as you write it below. Only id, title, tagline, summary, stack and highlights are required.
export interface ProjectEntry {
  // Unique, lowercase, letters/numbers/hyphens: used for the page anchor and the photograph's file name
  id: string;
  // Container ID stencilled on the stack (e.g. EDX-01). Left out, it's made from the title and position.
  code?: string;
  title: string;
  tagline: string;
  summary: string;
  stack: string[];
  highlights: string[];
  // Only real numbers — leave it out rather than inventing one
  metrics?: { value: string; label: string }[];
  // The little diagram on the manifest's right-hand side. Left out, the manifest just shows stack and readings.
  instrument?: Instrument;
  // First link becomes the manifest's button. None: the button offers a live demo via the contact form.
  links?: ProjectLink[];
}

// What the site reads: every optional field filled in
export interface Project extends Required<Omit<ProjectEntry, 'instrument'>> {
  instrument?: Instrument;
}

// TODO: set the EduExamine live URL — until then its CTA routes visitors to the contact page.
const EDUEXAMINE_LIVE_URL = '';

const PROJECTS: ProjectEntry[] = [
  {
    id: 'eduexamine',
    code: 'EDX-01',
    title: 'EduExamine',
    tagline: 'Scalable academic exam platform',
    summary:
      'A full-stack exam platform with role-based dashboards for students, faculty and admins, cohort-driven workflows, and the whole exam lifecycle — from creation to analytics.',
    stack: ['React.js', 'TypeScript', 'Vite', 'Node.js', 'Express.js', 'MongoDB'],
    highlights: [
      'JWT + RBAC backend with concurrent-user handling for live exam sessions',
      'Online coding assessments executing C, C++, Java, Python and JavaScript',
      'AI academic assistant via OpenRouter APIs for contextual support and chat',
    ],
    metrics: [
      { value: '3', label: 'role dashboards' },
      { value: '5', label: 'runtime languages' },
      { value: '3', label: 'integrity checks' },
    ],
    instrument: {
      kind: 'checklist',
      title: 'Integrity monitor',
      items: ['Tab-switch detection', 'Fullscreen enforcement', 'Activity logging'],
    },
    links: EDUEXAMINE_LIVE_URL ? [{ label: 'Open live build', href: EDUEXAMINE_LIVE_URL, kind: 'live' }] : [],
  },
  {
    id: 'devanta',
    code: 'DVN-02',
    title: 'Devanta',
    tagline: 'AI portfolio generator',
    summary:
      'Point it at a GitHub profile and it analyzes the public work, then generates a deployable portfolio site in under 60 seconds.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Express.js', 'Node.js', 'TypeScript'],
    highlights: [
      'Analyzes public GitHub data to drive the generated content',
      'Outputs a deployable portfolio site in three visual themes',
      'Next.js + Tailwind CSS front end, Express.js / Node.js backend',
    ],
    metrics: [
      { value: '<60s', label: 'profile → portfolio' },
      { value: '3', label: 'visual themes' },
    ],
    instrument: {
      kind: 'pipeline',
      title: 'Generation pipeline',
      steps: ['GitHub profile', 'Analyze', 'Generate', 'Deploy'],
      total: '< 60 s',
    },
    links: [{ label: 'View source on GitHub', href: 'https://github.com/Jaypee-2003/Devanta', kind: 'github' }],
  },
  {
    id: 'smartfinancecalc',
    code: 'SFC-03',
    title: 'SmartFinanceCalc',
    tagline: 'Cross-platform financial planning app',
    summary:
      'A mobile-first React Native app that puts SIP, EMI, investment and loan planning tools in one place.',
    stack: ['React Native', 'React.js', 'TypeScript'],
    highlights: [
      'Cross-platform React Native — one codebase for iOS and Android',
      'SIP, EMI, investment and loan planning in a single app',
      'Mobile-first layouts, written in TypeScript',
    ],
    metrics: [
      { value: '4', label: 'planning tools' },
      { value: '2', label: 'platforms · iOS + Android' },
    ],
    instrument: {
      kind: 'keypad',
      title: 'Planner modules',
      keys: ['SIP', 'EMI', 'Invest', 'Loan'],
      display: 'PLAN · MOBILE-FIRST',
    },
    links: [{ label: 'View source on GitHub', href: 'https://github.com/Jaypee-2003/SmartFinanceCalc', kind: 'github' }],
  },
  // Earlier client work. The old GitHub URLs (github.com/jaypeebehera/…) return 404, so only the live site is linked.
  {
    id: 'khojpandit',
    code: 'KHP-04',
    title: 'KhojPandit',
    tagline: 'Ceremony & ritual services platform',
    summary: 'A dynamic platform connecting users with pandits for ceremonies and rituals.',
    stack: ['React', 'Node.js', 'MongoDB', 'Bootstrap'],
    highlights: [
      'Single admin panel for content management',
      'Responsive design across devices',
      'User-friendly interface',
    ],
    metrics: [],
    instrument: {
      kind: 'checklist',
      title: 'Surfaces',
      items: ['Public site', 'Admin panel', 'Mobile & desktop'],
      state: 'Built',
    },
    links: [{ label: 'Visit live site', href: 'https://khojpandit.com', kind: 'live' }],
  },
];

// Container code from the title's first letters and the position in the list: "Smart Finance Calc", 3 → SFC-03
const autoCode = (title: string, index: number): string => {
  const words = title.replace(/[^A-Za-z0-9 ]/g, ' ').trim().split(/\s+/);
  const letters = (words.length > 1 ? words.map((w) => w[0]).join('') : words[0].replace(/[aeiou]/gi, '')) || 'PRJ';
  return `${letters.slice(0, 3).toUpperCase().padEnd(3, 'X')}-${String(index + 1).padStart(2, '0')}`;
};

export const projects: Project[] = PROJECTS.map((p, i) => ({
  ...p,
  code: p.code ?? autoCode(p.title, i),
  metrics: p.metrics ?? [],
  links: p.links ?? [],
}));

export interface SkillGroup {
  name: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  { name: 'Languages', skills: ['JavaScript', 'TypeScript', 'Python', 'Go', 'Java', 'PHP'] },
  { name: 'Frontend', skills: ['React.js', 'Next.js', 'Tailwind CSS'] },
  { name: 'Backend', skills: ['Node.js', 'Express', 'FastAPI', 'Django', 'WebSockets', 'JWT', 'RBAC'] },
  { name: 'Mobile', skills: ['React Native'] },
  { name: 'Data', skills: ['MongoDB', 'MySQL', 'Redis'] },
  { name: 'Cloud / DevOps', skills: ['Docker', 'AWS EC2', 'S3', 'Lambda', 'CI/CD'] },
];

export const education = [
  { years: '2024 – 2026', degree: 'MCA', school: 'Ravenshaw University' },
  { years: '2021 – 2024', degree: 'B.Sc (Hons) Computer Science', school: 'Ravenshaw University' },
];
