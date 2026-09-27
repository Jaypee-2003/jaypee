import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { theme } from '../styles/theme';
import { availability } from '../data/profile';

// Every object that carries words in the yard is one of a few real materials. Each sets the same
// custom properties, so the shared pieces below (labels, rules, buttons) ink themselves correctly.
//   bone   — enamel signs and paper
//   ink    — dark enamel, steel boards, window glass
//   amber  — the lightbox
export type Material = 'bone' | 'ink' | 'amber';

export const material = (m: Material) => {
  switch (m) {
    case 'bone':
      return css`
        --fg: ${theme.colors.ink};
        --muted: ${theme.colors.inkMuted};
        --rule: ${theme.colors.ruleOnBone};
        --accent: ${theme.colors.copper};
        background: ${theme.colors.bone};
        color: var(--fg);
      `;
    case 'ink':
      return css`
        --fg: ${theme.colors.bone};
        --muted: ${theme.colors.boneMuted};
        --rule: ${theme.colors.ruleOnInk};
        --accent: ${theme.colors.amber};
        background: ${theme.colors.inkRaised};
        color: var(--fg);
      `;
    case 'amber':
      return css`
        --fg: ${theme.colors.ink};
        --muted: #4a3413;
        --rule: rgba(11, 18, 28, 0.3);
        --accent: ${theme.colors.ink};
        background: ${theme.colors.amber};
        color: var(--fg);
      `;
  }
};

// Placards size themselves: fixed in the 3D scene (the Placard wrapper sets width/height), fluid in the
// document. Each one's wrapper is a size container, so @container rules lay a placard out by the room it
// actually has in either view.
export const placardBase = css`
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 15px;
  line-height: 1.5;
`;

export const placardContainer = { containerType: 'inline-size' } as const;

export const Label = styled.span`
  display: block;
  font-family: ${theme.fonts.display};
  font-weight: 700;
  font-size: 13px;
  line-height: 1.2;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
`;

export const Rule = styled.hr`
  border: none;
  border-top: 1px solid var(--rule);
`;

// Solid button: the placard's own ink, reversed. One per placard, for the action that matters there.
export const solidButton = css`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.15rem;
  border: none;
  background: var(--fg);
  color: var(--solid-ink, ${theme.colors.bone});
  font-family: ${theme.fonts.display};
  font-weight: 800;
  font-size: 17px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background ${theme.transitions.fast};

  &:hover {
    background: var(--accent);
  }

  &:focus-visible {
    outline: 2px solid var(--fg);
    outline-offset: 3px;
  }
`;

export const textLink = css`
  font-family: ${theme.fonts.display};
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 0.3em;
  text-decoration-color: var(--accent);

  &:hover {
    color: var(--accent);
  }

  &:focus-visible {
    outline: 2px solid var(--fg);
    outline-offset: 3px;
  }
`;

// A signal lamp lens: flat amber with a dark bezel — the actual glow comes from the lamp in the 3D scene
export const Lamp = styled.span`
  display: inline-block;
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${theme.colors.amber};
  border: 3px solid ${theme.colors.ink};
`;

const formatTime = (date: Date): string =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: availability.timeZone,
  }).format(date);

// Isolated so its ticks re-render only this <time>
export const LocalTime: React.FC = () => {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(id);
  }, []);
  return <time dateTime={now.toISOString()}>{formatTime(now)}</time>;
};
