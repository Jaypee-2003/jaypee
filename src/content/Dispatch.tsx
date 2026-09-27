import React, { ChangeEvent, FormEvent, useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { availability, contact, education } from '../data/profile';
import { Label, Lamp, LocalTime, material, placardBase, solidButton } from './kit';

export const DISPATCH_WINDOW = { width: 560, height: 522 };
export const ORDER_SLIP = { width: 420, height: 500 };
export const EDUCATION_PLAQUE = { width: 330, height: 172 };

/* ───────────────────────── Dispatch window ───────────────────────── */

// The office window at the end of the quay: dark glass with bone lettering on it
const Window = styled.section`
  ${placardBase}
  ${material('ink')}
  background: ${theme.colors.ink};
  padding: 28px 30px;
  box-shadow: inset 0 0 0 1px ${theme.colors.ruleOnInk};
`;

const Headline = styled.h2`
  margin-top: 10px;
  font-size: clamp(40px, 12vw, 54px);
  font-weight: 900;
  text-transform: uppercase;

  em {
    display: block;
    font-style: normal;
    color: var(--accent);
  }
`;

const Lead = styled.p`
  margin-top: 12px;
  font-size: 15px;
  color: var(--muted);
`;

const Details = styled.dl`
  margin-top: 16px;

  div {
    display: grid;
    grid-template-columns: 76px minmax(0, 1fr);
    align-items: center;
    padding: 5px 0;
    border-top: 1px solid var(--rule);
  }

  dt {
    font-family: ${theme.fonts.display};
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
  }

  dd {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14.5px;
  }

  time {
    font-variant-numeric: tabular-nums;
  }
`;

const Comms = styled.ul`
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;

  a {
    font-family: ${theme.fonts.display};
    font-weight: 700;
    font-size: 17px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: underline;
    text-decoration-color: var(--accent);
    text-decoration-thickness: 2px;
    text-underline-offset: 0.3em;
  }

  a:hover {
    color: var(--accent);
  }
`;

export const DispatchWindow: React.FC = () => (
  <Window aria-labelledby="hire-title">
    <Label>Dispatch · Hire</Label>
    <Headline id="hire-title">
      Have a platform to build? <em>Let's scope it.</em>
    </Headline>
    <Lead>
      Freelance and contract work: new SaaS builds, backend and API performance, AI-powered features. Tell me what
      you're building and where it's stuck.
    </Lead>
    <Details>
      <div>
        <dt>Status</dt>
        <dd>
          <Lamp aria-hidden="true" />
          {availability.status}
        </dd>
      </div>
      <div>
        <dt>Terms</dt>
        <dd>{availability.engagements}</dd>
      </div>
      <div>
        <dt>Mode</dt>
        <dd>{availability.mode}</dd>
      </div>
      <div>
        <dt>Reply</dt>
        <dd>{availability.responseTime}</dd>
      </div>
      <div>
        <dt>Local</dt>
        <dd>
          <LocalTime /> {availability.timeZoneLabel}
        </dd>
      </div>
    </Details>
    <Comms aria-label="Other ways to reach me">
      <li>
        <a href={`mailto:${contact.email}`}>Email</a>
      </li>
      <li>
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </li>
      <li>
        <a href={contact.github} target="_blank" rel="noopener noreferrer">
          GitHub<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </li>
    </Comms>
  </Window>
);

/* ───────────────────────── Order slip (the contact form) ───────────────────────── */

const Slip = styled.form`
  ${placardBase}
  ${material('bone')}
  --solid-ink: ${theme.colors.bone};
  padding: 24px 26px;
  display: flex;
  flex-direction: column;
`;

const SlipHead = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 4px 12px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--fg);

  h3 {
    font-size: 30px;
    text-transform: uppercase;
  }

  span {
    font-size: 13px;
    color: var(--muted);
  }
`;

const Field = styled.div`
  margin-top: 14px;
  display: grid;
  gap: 2px;

  label {
    font-family: ${theme.fonts.display};
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
  }

  input,
  textarea {
    width: 100%;
    padding: 6px 0;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--fg);
    border-radius: 0;
    font-size: 16px;
    color: var(--fg);
  }

  textarea {
    height: 104px;
    resize: none;
    line-height: 1.45;
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--muted);
    opacity: 1;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-bottom-width: 2px;
    border-bottom-color: var(--accent);
    margin-bottom: -1px;
  }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px ${theme.colors.bone} inset;
    -webkit-text-fill-color: ${theme.colors.ink};
  }
`;

const Send = styled.button`
  ${solidButton}
  margin-top: 18px;
  align-self: flex-start;
`;

// Reserved height: the sign's backing in the scene is measured once, so the slip never grows
const StatusLine = styled.p`
  margin-top: 10px;
  min-height: 38px;
  font-size: 12.5px;
  line-height: 1.45;
  color: var(--muted);

  a {
    color: var(--fg);
    text-decoration: underline;
  }
`;

interface FormData {
  name: string;
  email: string;
  message: string;
}

export const OrderSlip: React.FC = () => {
  const [form, setForm] = useState<FormData>({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  // No backend on GitHub Pages: hand the brief to the visitor's mail client, pre-addressed and pre-filled.
  // The form keeps its contents so nothing is lost if no mail app opens.
  const submit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const subject = `Project enquiry — ${form.name}`;
    const body = `${form.message}\n\n— ${form.name}\n${form.email}`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const change = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Slip onSubmit={submit} aria-labelledby="order-title">
      <SlipHead>
        <h3 id="order-title">Dispatch order</h3>
        <span>to {contact.email}</span>
      </SlipHead>
      <Field>
        <label htmlFor="order-name">Name</label>
        <input id="order-name" name="name" autoComplete="name" placeholder="What should I call you?" value={form.name} onChange={change} required />
      </Field>
      <Field>
        <label htmlFor="order-email">Email</label>
        <input id="order-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" value={form.email} onChange={change} required />
      </Field>
      <Field>
        <label htmlFor="order-brief">Brief</label>
        <textarea
          id="order-brief"
          name="message"
          placeholder="What are you building, what's the timeline, and what's in the way?"
          value={form.message}
          onChange={change}
          required
        />
      </Field>
      <Send type="submit">Send brief →</Send>
      <StatusLine role="status">
        {sent && (
          <>
            Your mail app should open with this brief filled in. Nothing opened? Write to{' '}
            <a href={`mailto:${contact.email}`}>{contact.email}</a>.
          </>
        )}
      </StatusLine>
    </Slip>
  );
};

/* ───────────────────────── Education plaque ───────────────────────── */

const Plaque = styled.section`
  ${placardBase}
  ${material('bone')}
  padding: 18px 20px;
  box-shadow: inset 0 0 0 5px ${theme.colors.bone}, inset 0 0 0 7px ${theme.colors.inkMuted};

  li {
    display: grid;
    grid-template-columns: 94px minmax(0, 1fr);
    gap: 8px;
    padding: 6px 0;
    border-top: 1px solid var(--rule);
    font-size: 13px;
    line-height: 1.35;
  }

  li span:first-of-type {
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }
`;

export const EducationPlaque: React.FC = () => (
  <Plaque aria-labelledby="edu-title">
    <Label as="h2" id="edu-title" style={{ marginBottom: 8 }}>
      Education
    </Label>
    <ul>
      {education.map((entry) => (
        <li key={entry.degree}>
          <span>{entry.years}</span>
          <span>
            {entry.degree}, {entry.school}
          </span>
        </li>
      ))}
    </ul>
  </Plaque>
);
