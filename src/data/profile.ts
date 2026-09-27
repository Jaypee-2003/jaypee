// Single source for portfolio content. Both presentations — the 3D yard and the plain document — read from here;
// anything about how it looks lives with the presentation, not in this file.

export const person = {
  name: 'Jayprakash Behera',
  firstName: 'Jayprakash',
  lastName: 'Behera',
  role: 'Full Stack Developer',
  pitch:
    'Full stack developer for SaaS platforms, backend systems and AI-powered products — taking them from architecture to production.',
  summary:
    'I build scalable SaaS platforms, high-performance backend systems and AI-powered applications with React.js, Node.js, Python, Docker and AWS — and I own both the architecture and the delivery.',
  coreStack: ['React.js', 'Node.js', 'Python', 'Docker', 'AWS'],
  architecture: ['Multi-role authentication', 'RBAC', 'API optimization', 'MongoDB tuning for high concurrency'],
  delivery: ['Docker & Docker Compose', 'AWS — EC2, S3, Lambda', 'CI/CD pipelines'],
};

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
  company: 'Arkine Technologies',
  location: 'Mumbai · Remote',
  start: '09/2025',
  end: 'Present',
  brief: 'Scaling a multi-module SaaS platform spanning inventory, task, vendor and order systems.',
  modules: ['Inventory', 'Tasks', 'Vendors', 'Orders'],
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

export interface Project {
  id: string;
  code: string;
  title: string;
  tagline: string;
  summary: string;
  stack: string[];
  highlights: string[];
  // Only real numbers — leave empty rather than inventing one
  metrics: { value: string; label: string }[];
  instrument: Instrument;
  links: ProjectLink[];
}

// TODO: set the EduExamine live URL — until then its CTA routes visitors to the contact page.
const EDUEXAMINE_LIVE_URL = '';

export const projects: Project[] = [
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
  // Earlier client work. The old GitHub URLs (github.com/jaypeebehera/…) return 404, so only live sites are linked.
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
  {
    id: 'cleandirty',
    code: 'CDA-05',
    title: 'CleanDirty.ai',
    tagline: 'Subscription storytelling platform',
    summary: 'A subscription-based storytelling platform with mobile-first design.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Node.js'],
    highlights: [
      'Personalized reading experience',
      'Engaging visuals for long-form content',
      'User-centric, mobile-first design',
    ],
    metrics: [],
    instrument: {
      kind: 'reader',
      title: 'Reading view',
      caption: 'Long-form · mobile',
    },
    // Currently redirects to moonkind.ai
    links: [{ label: 'Visit live site', href: 'https://cleandirty.ai', kind: 'live' }],
  },
];

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
