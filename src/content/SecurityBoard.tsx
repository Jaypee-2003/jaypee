import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { contact, expertise, siteSecurity } from '../data/profile';
import { Label, material, placardBase } from './kit';

export const SECURITY_BOARD = { width: 900, height: 560 };

const POLICY_URL = `${contact.github}/jaypee/blob/main/SECURITY.md`;

// The checkpoint's enamel sign: a hazard band across the top, the practices on the left, and set into it
// a dark inspection certificate listing what this site itself does
const Sign = styled.section`
  ${placardBase}
  ${material('bone')}
  padding: 34px 32px 26px;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  grid-template-rows: auto 1fr;
  gap: 18px 28px;

  /* Hazard band: ink and amber diagonals */
  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 12px;
    background: repeating-linear-gradient(
      -45deg,
      ${theme.colors.ink} 0 12px,
      ${theme.colors.amber} 12px 24px
    );
  }

  @container (max-width: 720px) {
    grid-template-columns: 1fr;
    padding: 34px 22px 24px;
  }
`;

const Head = styled.header`
  grid-column: 1 / -1;
`;

const Title = styled.h2`
  margin-top: 6px;
  font-size: clamp(34px, 9vw, 46px);
  font-weight: 900;
  text-transform: uppercase;
`;

const Lead = styled.p`
  margin-top: 8px;
  max-width: 44em;
  font-size: 16px;
  line-height: 1.45;
`;

// Each practice with a stamped check and the work that proves it
const Practices = styled.ol`
  display: grid;
  align-content: start;
  gap: 12px;

  li {
    display: grid;
    grid-template-columns: 26px minmax(0, 1fr);
    gap: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--rule);
  }

  svg {
    width: 22px;
    height: 22px;
    margin-top: 1px;
  }

  b {
    display: block;
    font-family: ${theme.fonts.display};
    font-weight: 800;
    font-size: 18px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 14px;
    line-height: 1.4;
    color: var(--muted);
  }
`;

// The certificate: a dark plate screwed into the sign
const Certificate = styled.aside`
  ${material('ink')}
  align-self: start;
  padding: 18px 20px 16px;
  outline: 2px solid ${theme.colors.ink};
  outline-offset: 3px;

  h3 {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--rule);
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  h3 small {
    font-size: 12px;
    letter-spacing: 0.16em;
    color: ${theme.colors.amber};
  }

  ul {
    margin-top: 6px;
  }

  li {
    display: grid;
    grid-template-columns: 12px minmax(0, 1fr);
    gap: 10px;
    padding: 6px 0;
    font-size: 13px;
    line-height: 1.35;
    color: var(--muted);
  }

  li::before {
    content: '';
    width: 8px;
    height: 8px;
    margin-top: 4px;
    border-radius: 50%;
    background: ${theme.colors.amber};
  }

  li b {
    font-weight: 600;
    color: var(--fg);
  }

  a {
    display: inline-block;
    margin-top: 10px;
    font-family: ${theme.fonts.display};
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 0.3em;
    text-decoration-color: ${theme.colors.amber};

    &:hover {
      color: ${theme.colors.amber};
    }
  }
`;

export const SecurityBoard: React.FC = () => {
  const { security } = expertise;
  return (
    <Sign aria-labelledby="security-title">
      <Head>
        <Label>Checkpoint · {security.label}</Label>
        <Title id="security-title">{security.title}</Title>
        <Lead>{security.lead}</Lead>
      </Head>
      <Practices aria-label="Security practices">
        {security.practices.map((p) => (
          <li key={p.title}>
            <svg viewBox="0 0 22 22" aria-hidden="true">
              <rect x="1" y="1" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M6 11.5l3.4 3.4L16.5 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
            </svg>
            <div>
              <b>{p.title}</b>
              <span>{p.detail}</span>
            </div>
          </li>
        ))}
      </Practices>
      <Certificate aria-labelledby="site-security-title">
        <h3 id="site-security-title">
          This site <small>Inspected</small>
        </h3>
        <ul>
          {siteSecurity.map((item) => (
            <li key={item.title}>
              <span>
                <b>{item.title}.</b> {item.detail}
              </span>
            </li>
          ))}
        </ul>
        <a href={POLICY_URL} target="_blank" rel="noopener noreferrer">
          Security policy ↗
        </a>
      </Certificate>
    </Sign>
  );
};
