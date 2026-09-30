import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { expertise } from '../data/profile';
import { placardBase } from './kit';

export const AI_BOARD = { width: 900, height: 540 };

const LED = '#FFB347';
const LED_DIM = '#B98542';
const LED_FAINT = 'rgba(255, 179, 71, 0.16)';

// The control tower's operations display: amber LED characters on a black dot-matrix panel, laid out
// like a terminal's departures board. It's a light source, so its characters carry a soft glow.
const Display = styled.section`
  ${placardBase}
  --fg: ${LED};
  --muted: ${LED_DIM};
  --rule: ${LED_FAINT};
  padding: 26px 30px 24px;
  color: var(--fg);
  background:
    radial-gradient(circle at 1px 1px, rgba(255, 179, 71, 0.07) 1px, transparent 1.4px) 0 0 / 5px 5px,
    linear-gradient(180deg, #0a0d12, #05070a);
  box-shadow: inset 0 0 0 6px #121821, inset 0 0 0 7px rgba(255, 179, 71, 0.18);
  text-shadow: 0 0 6px rgba(255, 179, 71, 0.45);

  @container (max-width: 720px) {
    padding: 24px 22px;
  }
`;

const Bar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--rule);
  font-family: ${theme.fonts.display};
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);

  b {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--fg);
    font-weight: 700;
  }

  b::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${LED};
    box-shadow: 0 0 8px ${LED};
  }
`;

const Title = styled.h2`
  margin-top: 14px;
  font-size: clamp(34px, 9vw, 46px);
  font-weight: 900;
  text-transform: uppercase;
`;

const Lead = styled.p`
  margin-top: 8px;
  max-width: 46em;
  font-size: 15.5px;
  line-height: 1.45;
  color: #f4d3a3;
  text-shadow: none;
`;

// Four modules, two by two
const Modules = styled.ul`
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 26px;

  li {
    padding-top: 10px;
    border-top: 1px solid var(--rule);
  }

  b {
    display: block;
    font-family: ${theme.fonts.display};
    font-weight: 800;
    font-size: 18px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  b small {
    margin-right: 8px;
    font-size: 13px;
    color: var(--muted);
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 13.5px;
    line-height: 1.4;
    color: #e2c49a;
    text-shadow: none;
  }

  @container (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

// Departures-board table of what's shipped
const Shipped = styled.table`
  width: 100%;
  margin-top: 18px;
  border-collapse: collapse;
  font-size: 13.5px;

  caption {
    padding-bottom: 6px;
    text-align: left;
    font-family: ${theme.fonts.display};
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }

  th,
  td {
    padding: 7px 10px 7px 0;
    text-align: left;
    border-top: 1px solid var(--rule);
    vertical-align: baseline;
  }

  th {
    font-family: ${theme.fonts.display};
    font-weight: 800;
    font-size: 17px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  td {
    color: #e2c49a;
    text-shadow: none;
  }

  td:last-of-type {
    text-align: right;
    padding-right: 0;
    color: var(--muted);
    font-family: ${theme.fonts.display};
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  @container (max-width: 620px) {
    td:last-of-type {
      display: none;
    }
  }
`;

const Stack = styled.p`
  margin-top: 12px;
  font-family: ${theme.fonts.display};
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
`;

export const AIBoard: React.FC = () => {
  const { ai } = expertise;
  return (
    <Display aria-labelledby="ai-title">
      <Bar>
        <span>Ops tower · {ai.label}</span>
        <b>Online</b>
      </Bar>
      <Title id="ai-title">{ai.title}</Title>
      <Lead>{ai.lead}</Lead>
      <Modules aria-label="How the AI is built">
        {ai.practices.map((p, i) => (
          <li key={p.title}>
            <b>
              <small aria-hidden="true">{String(i + 1).padStart(2, '0')}</small>
              {p.title}
            </b>
            <span>{p.detail}</span>
          </li>
        ))}
      </Modules>
      <Shipped>
        <caption>Shipped</caption>
        <tbody>
          {ai.shipped.map((s) => (
            <tr key={s.project}>
              <th scope="row">{s.project}</th>
              <td>{s.what}</td>
              <td>{s.via}</td>
            </tr>
          ))}
        </tbody>
      </Shipped>
      <Stack>Stack · {ai.stack.join(' · ')}</Stack>
    </Display>
  );
};
