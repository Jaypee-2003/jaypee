import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import profileImage from '../assets/images/profile linked in.jpeg';
import { experience, person } from '../data/profile';
import { Label, material, placardBase } from './kit';

export const OPERATOR_BOARD = { width: 900, height: 486 };

// A dark steel notice board by the lane: who runs this yard
const Board = styled.section`
  ${placardBase}
  ${material('ink')}
  padding: 28px;
  display: grid;
  grid-template-columns: 190px minmax(0, 1.25fr) minmax(0, 0.85fr);
  gap: 30px;

  @container (max-width: 760px) {
    grid-template-columns: 1fr;
    padding: 22px;
    gap: 24px;
  }
`;

// Sodium light turns everything one colour: the photo as a grayscale print multiplied onto amber
const Photo = styled.figure`
  figcaption {
    margin-top: 10px;
  }

  div {
    aspect-ratio: 4 / 5;
    background: ${theme.colors.amber};
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 28%;
    filter: grayscale(1) contrast(1.2) brightness(0.95);
    mix-blend-mode: multiply;
  }

  @container (max-width: 760px) {
    max-width: 220px;
  }
`;

const Title = styled.h2`
  margin-top: 8px;
  font-size: clamp(38px, 10vw, 50px);
  text-transform: uppercase;
`;

const Summary = styled.p`
  margin-top: 14px;
  font-size: 17px;
  line-height: 1.45;
`;

const Body = styled.p`
  margin-top: 10px;
  font-size: 14px;
  color: var(--muted);
`;

const Scope = styled.div`
  display: grid;
  align-content: start;
  gap: 18px;
  padding-left: 26px;
  border-left: 1px solid var(--rule);

  ul {
    margin-top: 6px;
  }

  li {
    font-size: 14px;
    line-height: 1.6;
  }

  @container (max-width: 760px) {
    padding-left: 0;
    border-left: none;
  }
`;

const Stack = styled.p`
  margin-top: 6px;
  font-family: ${theme.fonts.display};
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 0.04em;
  color: var(--accent);
`;

export const OperatorBoard: React.FC = () => (
  <Board aria-labelledby="about-title">
    <Photo>
      <div>
        <img src={profileImage} alt={`Portrait of ${person.name}`} />
      </div>
      <figcaption>
        <Label>Operator · {person.role}</Label>
      </figcaption>
    </Photo>

    <div>
      <Label>About</Label>
      <Title id="about-title">From the schema to the deploy</Title>
      <Summary>{person.summary}</Summary>
      <Body>
        Architecture means multi-role authentication, RBAC and API optimization designed in from the start. Delivery
        means Docker, AWS and CI/CD, so what gets built actually reaches production.
      </Body>
      <Body>
        Right now I'm freelancing with {experience.company} on {experience.client}, scaling a multi-module SaaS
        platform: secure multi-role APIs, Redis caching and containerized deployments.
      </Body>
    </div>

    <Scope>
      <div>
        <Label as="h3">Architecture</Label>
        <ul>
          {person.architecture.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <Label as="h3">Delivery</Label>
        <ul>
          {person.delivery.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <Label as="h3">Core stack</Label>
        <Stack>{person.coreStack.join(' · ')}</Stack>
      </div>
    </Scope>
  </Board>
);
