import React, { ReactNode, useEffect, useLayoutEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { projects } from '../data/profile';
import { StopId } from '../site/stops';
import { setActiveStop, setScroller } from '../site/store';
import { GateSign } from '../content/GateSign';
import { OperatorBoard } from '../content/OperatorBoard';
import { CaseLightbox } from '../content/CaseLightbox';
import { Manifest } from '../content/Manifest';
import { SkillsBoard } from '../content/SkillsBoard';
import { DispatchWindow, EducationPlaque, OrderSlip } from '../content/Dispatch';

// The same yard as an ordinary vertical page: a still render of each location, then what stands there.
// For phones and tablets, reduced motion, low-end hardware, no WebGL — or anyone who picks "Plain view".
// Nothing here is scroll-driven; the page scrolls like any document.

const still = (id: StopId): string => `${process.env.PUBLIC_URL}/stills/${id}.jpg`;

const ALT: Record<string, string> = {
  gate: 'Night at the container terminal gate: "Jayprakash Behera" stencilled across two shipping containers under an amber floodlight, and the gate sign with its amber status lamp lit.',
  notice: 'A steel notice board beside the lane, lit by a hooded lamp, carrying the operator file.',
  bay: 'The loading bay: four containers labelled Inventory, Tasks, Vendors and Orders hang from one gantry beam marked "REST API · JWT + RBAC", piped into tanks marked Redis and MongoDB, beside an amber lightbox.',
  signals:
    'A signal gantry over the lane with six signal heads — Languages, Frontend, Backend, Mobile, Data, Cloud / DevOps — and an amber lamp lit for every skill.',
  dispatch: 'The dispatch office at the end of the quay, its window lettered with hire details, an order slip on a stand in front and cranes over the water behind.',
};
const fileAlt = (title: string): string =>
  `A two-high container stack with "${title}" painted along the top container and its manifest clipped to the one below.`;

const Main = styled.main`
  padding-top: ${theme.layout.navHeight};
`;

const Place = styled.section`
  max-width: ${theme.layout.max};
  margin: 0 auto;
  padding: clamp(2rem, 6vw, 4.5rem) ${theme.layout.gutter} 0;
  scroll-margin-top: ${theme.layout.navHeight};

  &:last-of-type {
    padding-bottom: clamp(3rem, 8vw, 6rem);
  }
`;

// Full-bleed establishing shot, then the placards set at a comfortable reading width
const Still = styled.img`
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  background: ${theme.colors.inkRaised};
`;

const Objects = styled.div`
  margin-top: clamp(-5rem, -8vw, -1.5rem);
  margin-inline: auto;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.25rem;

  /* each placard's wrapper is its size container (see content/kit.tsx) */
  > * {
    flex: 1 1 22rem;
    max-width: 46rem;
    container-type: inline-size;
  }
`;

const PlaceSection: React.FC<{ id: StopId; alt: string; children: ReactNode }> = ({ id, alt, children }) => (
  <Place id={id} data-stop={id}>
    <Still src={still(id)} alt={alt} loading={id === 'gate' ? 'eager' : 'lazy'} width={1600} height={1000} />
    <Objects>
      {React.Children.map(children, (child) => (
        <div>{child}</div>
      ))}
    </Objects>
  </Place>
);

const DocumentSite: React.FC = () => {
  useLayoutEffect(() => {
    setScroller((id, smooth) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (id === 'gate') window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
      else el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    });
    return () => setScroller(null);
  }, []);

  // The section crossing the middle of the viewport is the current one
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveStop((entry.target as HTMLElement).dataset.stop as StopId);
        }),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    document.querySelectorAll('[data-stop]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <Main>
      <PlaceSection id="gate" alt={ALT.gate}>
        <GateSign />
      </PlaceSection>
      <PlaceSection id="notice" alt={ALT.notice}>
        <OperatorBoard />
      </PlaceSection>
      <PlaceSection id="bay" alt={ALT.bay}>
        <CaseLightbox inScene={false} />
      </PlaceSection>
      {projects.map((project, i) => (
        <PlaceSection key={project.id} id={`file-${i + 1}` as StopId} alt={fileAlt(project.title)}>
          <Manifest project={project} index={i} />
        </PlaceSection>
      ))}
      <PlaceSection id="signals" alt={ALT.signals}>
        <SkillsBoard inScene={false} />
      </PlaceSection>
      <PlaceSection id="dispatch" alt={ALT.dispatch}>
        <DispatchWindow />
        <OrderSlip />
        <EducationPlaque />
      </PlaceSection>
    </Main>
  );
};

export default DocumentSite;
