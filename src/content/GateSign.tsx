import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { availability, person } from '../data/profile';
import { Label, LocalTime, Lamp, material, placardBase, Rule, solidButton, textLink } from './kit';

// Size in the 3D scene, CSS px (the scene maps it onto a physical sign)
export const GATE_SIGN = { width: 470, height: 392 };

// A bone enamel gate sign: painted border stroke inset from the edge, bolts in the corners
const Sign = styled.section`
  ${placardBase}
  ${material('bone')}
  padding: 30px 32px 28px;
  box-shadow: inset 0 0 0 8px ${theme.colors.bone}, inset 0 0 0 11px ${theme.colors.ink};

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 14px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${theme.colors.inkMuted};
  }
  &::before {
    left: 14px;
  }
  &::after {
    right: 14px;
  }
`;

const Status = styled.p`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: ${theme.fonts.display};
  font-weight: 800;
  font-size: clamp(24px, 7vw, 30px);
  line-height: 1;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

const Terms = styled.p`
  margin-top: 10px;
  font-size: 14px;
  color: var(--muted);

  time {
    font-variant-numeric: tabular-nums;
    color: var(--fg);
  }
`;

const Name = styled.h1`
  margin-top: 18px;
  font-size: clamp(30px, 9vw, 38px);
  font-weight: 900;
  letter-spacing: 0.01em;
  text-transform: uppercase;
`;

const Pitch = styled.p`
  margin-top: 10px;
  font-size: 16px;
  line-height: 1.45;
`;

const Actions = styled.div`
  margin-top: 22px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px 22px;

  a:first-of-type {
    ${solidButton}
  }
  a:last-of-type {
    ${textLink}
  }
`;

export const GateSign: React.FC = () => (
  <Sign aria-labelledby="gate-name">
    <Status>
      <Lamp aria-hidden="true" />
      {availability.status}
    </Status>
    <Terms>
      {availability.engagements} · {availability.mode} · Replies {availability.responseTime.toLowerCase()}
      <br />
      Local <LocalTime /> · {availability.timeZoneLabel}
    </Terms>
    <Rule style={{ marginTop: 18 }} />
    <Name id="gate-name">{person.name}</Name>
    <Label as="p" style={{ marginTop: 6 }}>
      {person.role}
    </Label>
    <Pitch>{person.pitch}</Pitch>
    <Actions>
      <a href="#/contact">Start a project →</a>
      <a href="#/projects">See the work</a>
    </Actions>
  </Sign>
);
