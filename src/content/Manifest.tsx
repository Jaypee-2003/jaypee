import React from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { Instrument, Project } from '../data/profile';
import { Label, material, placardBase, solidButton } from './kit';

export const MANIFEST = { width: 740, height: 372 };

// A paper cargo manifest clipped to each project's container
const Sheet = styled.article`
  ${placardBase}
  ${material('bone')}
  padding: 18px 24px 20px;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  grid-template-rows: auto 1fr;
  gap: 12px 26px;

  @container (max-width: 620px) {
    grid-template-columns: 1fr;
    padding: 22px;
  }
`;

const Head = styled.header`
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--fg);
`;

const Title = styled.h3`
  font-size: clamp(32px, 10vw, 40px);
  font-weight: 900;
  text-transform: uppercase;
`;

const Tagline = styled.p`
  margin-top: 4px;
  font-family: ${theme.fonts.display};
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent);
`;

const Summary = styled.p`
  margin-top: 8px;
  font-size: 14.5px;
  line-height: 1.42;
`;

const Highlights = styled.ul`
  margin-top: 8px;

  li {
    position: relative;
    padding: 4px 0 4px 18px;
    border-top: 1px solid var(--rule);
    font-size: 13px;
    line-height: 1.35;
    color: var(--muted);
  }

  li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 11px;
    width: 8px;
    height: 2px;
    background: var(--fg);
  }
`;

const Side = styled.div`
  display: grid;
  align-content: start;
  gap: 10px;
  padding-left: 22px;
  border-left: 1px solid var(--rule);

  @container (max-width: 620px) {
    padding-left: 0;
    border-left: none;
  }
`;

const Lines = styled.ul`
  margin-top: 4px;

  li {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 13px;
    line-height: 1.5;
  }

  small {
    font-family: ${theme.fonts.display};
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent);
  }
`;

const StackLine = styled.p`
  margin-top: 2px;
  font-size: 13px;
  line-height: 1.45;
`;

const Readings = styled.dl`
  margin-top: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 18px;

  div {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  dt {
    font-family: ${theme.fonts.display};
    font-weight: 900;
    font-size: 26px;
    line-height: 1;
  }

  dd {
    font-size: 12.5px;
    color: var(--muted);
  }
`;

const Cta = styled.a`
  ${solidButton}
  justify-self: start;
  font-size: 15px;
  padding: 0.7rem 1rem;
`;

const InstrumentLines: React.FC<{ instrument: Instrument }> = ({ instrument }) => {
  switch (instrument.kind) {
    case 'checklist':
      return (
        <Lines>
          {instrument.items.map((item) => (
            <li key={item}>
              {item}
              <small>{instrument.state ?? 'On'}</small>
            </li>
          ))}
        </Lines>
      );
    case 'pipeline':
      return (
        <Lines as="ol">
          {instrument.steps.map((step, i) => (
            <li key={step}>
              {step}
              <small>{i === instrument.steps.length - 1 ? instrument.total : `0${i + 1}`}</small>
            </li>
          ))}
        </Lines>
      );
    case 'keypad':
      return (
        <Lines>
          {instrument.keys.map((key) => (
            <li key={key}>
              {key}
              <small>Tool</small>
            </li>
          ))}
        </Lines>
      );
    case 'reader':
      return (
        <Lines>
          <li>
            {instrument.caption}
            <small>Reader</small>
          </li>
        </Lines>
      );
  }
};

export const Manifest: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const live = project.links.find((l) => l.kind === 'live');
  const status = live ? 'Live' : project.links.length ? 'Source open' : 'Demo on request';
  const link = project.links[0];

  return (
    <Sheet aria-labelledby={`${project.id}-title`}>
      <Head>
        <Label>
          Manifest {String(index + 1).padStart(2, '0')} · {project.code}
        </Label>
        <Label>{status}</Label>
      </Head>

      <div>
        <Title id={`${project.id}-title`}>{project.title}</Title>
        <Tagline>{project.tagline}</Tagline>
        <Summary>{project.summary}</Summary>
        <Highlights>
          {project.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </Highlights>
      </div>

      <Side>
        <div>
          <Label as="h4">{project.instrument.title}</Label>
          <InstrumentLines instrument={project.instrument} />
        </div>
        <div>
          <Label as="h4">Stack</Label>
          <StackLine>{project.stack.join(' · ')}</StackLine>
        </div>
        {project.metrics.length > 0 && (
          <div>
            <Label as="h4">Readings</Label>
            <Readings>
              {project.metrics.map((m) => (
                <div key={m.label}>
                  <dt>{m.value}</dt>
                  <dd>{m.label}</dd>
                </div>
              ))}
            </Readings>
          </div>
        )}
        {link ? (
          <Cta href={link.href} target="_blank" rel="noopener noreferrer">
            {link.kind === 'github' ? 'View source' : 'Visit live site'} ↗
            <span className="sr-only"> for {project.title} (opens in a new tab)</span>
          </Cta>
        ) : (
          <Cta href="#/contact">
            Request a live demo →<span className="sr-only"> of {project.title}</span>
          </Cta>
        )}
      </Side>
    </Sheet>
  );
};
