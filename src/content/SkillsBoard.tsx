import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { skillGroups } from '../data/profile';
import { Label, material, placardBase } from './kit';

// In the 3D yard the skills are the signal gantry itself — one signal head per group, one lit lamp per
// skill — so this list is for assistive tech there. In the document view it's the visible board.
const Board = styled.section`
  ${placardBase}
  ${material('ink')}
  padding: 26px 28px;
`;

const Title = styled.h2`
  margin-top: 6px;
  font-size: clamp(38px, 10vw, 50px);
  text-transform: uppercase;
`;

const Groups = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 18px 26px;

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 0;
    border-top: 1px solid var(--rule);
    font-size: 15px;
  }

  li::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${theme.colors.amber};
  }
`;

export const SkillsBoard: React.FC<{ inScene: boolean }> = ({ inScene }) => {
  const groups = skillGroups.map((group) => (
    <div key={group.name}>
      <Label as="h3" style={{ marginBottom: 6 }}>
        {group.name}
      </Label>
      <ul>
        {group.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </div>
  ));

  if (inScene) {
    return (
      <section className="sr-only" aria-labelledby="skills-title">
        <h2 id="skills-title">Skills</h2>
        {groups}
      </section>
    );
  }
  return (
    <Board aria-labelledby="skills-title">
      <Label>Signal groups</Label>
      <Title id="skills-title">Skills</Title>
      <Groups>{groups}</Groups>
    </Board>
  );
};
