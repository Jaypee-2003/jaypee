import React from 'react';
import styled from '@emotion/styled';
import { experience } from '../data/profile';
import { Label, material, placardBase, Rule } from './kit';

export const CASE_LIGHTBOX = { width: 520, height: 640 };

// The loading bay's lightbox: the one surface in the yard that is itself a light source
const Box = styled.section`
  ${placardBase}
  ${material('amber')}
  padding: 30px 32px;
`;

const Client = styled.h2`
  margin-top: 8px;
  font-size: clamp(52px, 15vw, 76px);
  font-weight: 900;
  text-transform: uppercase;
`;

const Meta = styled.p`
  margin-top: 8px;
  font-size: 14px;
  color: var(--muted);
`;

const Brief = styled.p`
  margin-top: 16px;
  font-size: 18px;
  line-height: 1.4;
`;

// A stat, set straight on the box: the number and what it measures. In a narrow box the label goes under it.
const Figure = styled.p`
  margin-top: 18px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: end;
  gap: 16px;

  strong {
    font-family: 'Big Shoulders Display', sans-serif;
    font-weight: 900;
    font-size: clamp(64px, 19cqi, 96px);
    line-height: 0.8;
    white-space: nowrap;
  }

  span {
    padding-bottom: 4px;
    font-size: 14px;
    line-height: 1.35;
  }

  @container (max-width: 500px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;

    span {
      max-width: 22rem;
    }
  }
`;

const Work = styled.ol`
  margin-top: 18px;

  li {
    display: grid;
    grid-template-columns: 28px minmax(0, 1fr);
    padding: 8px 0;
    border-top: 1px solid var(--rule);
    font-size: 14px;
    line-height: 1.4;
  }

  b {
    font-weight: 600;
  }

  span {
    font-family: 'Big Shoulders Display', sans-serif;
    font-weight: 800;
    font-size: 15px;
  }
`;

export const CaseLightbox: React.FC<{ inScene: boolean }> = ({ inScene }) => (
  <Box aria-labelledby="case-title">
    <Label>
      Freelance · {experience.start} → {experience.end}
    </Label>
    <Client id="case-title">{experience.client}</Client>
    <Meta>
      {experience.company} · {experience.location} · Freelance, full stack
    </Meta>
    <Brief>{experience.brief}</Brief>
    {inScene && (
      <p className="sr-only">
        Beside this sign, the system is built in the yard: inventory, task, vendor and order modules hang from a shared
        JWT + RBAC REST API gantry, backed by Redis and MongoDB tanks, all shipped with Docker Compose.
      </p>
    )}
    <Rule style={{ marginTop: 18 }} />
    <Figure>
      <strong>{experience.headline.value}</strong>
      <span>{experience.headline.label}</span>
    </Figure>
    <Work>
      {experience.work.map((item, i) => (
        <li key={item.title}>
          <span>{String(i + 1).padStart(2, '0')}</span>
          <div>
            <b>{item.title}</b> — {item.detail}
          </div>
        </li>
      ))}
    </Work>
  </Box>
);
