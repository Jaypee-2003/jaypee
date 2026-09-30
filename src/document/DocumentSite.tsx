import React, { CSSProperties, ReactNode, useEffect, useLayoutEffect } from 'react';
import styled from '@emotion/styled';
import { theme } from '../styles/theme';
import { projects } from '../data/profile';
import { StopId } from '../site/stops';
import { setActiveStop, setScroller } from '../site/store';
import { TimeOfDay, useTimeOfDay } from '../site/timeOfDay';
import { GateSign } from '../content/GateSign';
import { OperatorBoard } from '../content/OperatorBoard';
import { CaseLightbox } from '../content/CaseLightbox';
import { Manifest } from '../content/Manifest';
import { AIBoard } from '../content/AIBoard';
import { SecurityBoard } from '../content/SecurityBoard';
import { SkillsBoard } from '../content/SkillsBoard';
import { DispatchWindow, EducationPlaque, OrderSlip } from '../content/Dispatch';

// The yard as an ordinary page, laid out like a photo essay: a photograph of each place (rendered from
// the 3D scene without its signs — see scripts/render-stills.js), and the same signs, manifests and
// forms set as the readable page around it. For phones and tablets, reduced motion, low-end hardware,
// no WebGL — or anyone who picks "Plain view". Nothing here is scroll-driven.

// Night photographs by default; the light theme shows the same places by day (scripts/render-stills.js)
const still = (id: StopId, time: TimeOfDay): string =>
  `${process.env.PUBLIC_URL}/stills/${time === 'day' ? 'day/' : ''}${id}.jpg`;

/* ───────────────────────── Layout ───────────────────────── */

const Main = styled.main`
  padding-top: ${theme.layout.navHeight};
  padding-bottom: clamp(4rem, 10vw, 8rem);
`;

const Wrap = styled.div`
  max-width: ${theme.layout.max};
  margin: 0 auto;
  padding: 0 ${theme.layout.gutter};
`;

const Chapter = styled.section`
  padding-top: clamp(4.5rem, 11vw, 8.5rem);
  scroll-margin-top: ${theme.layout.navHeight};
`;

// "02 — Experience", with a rule running to the margin. Decorative: each placard carries the real heading.
const Head = styled.p`
  display: flex;
  align-items: baseline;
  gap: 0.9rem;
  margin-bottom: clamp(1.5rem, 4vw, 2.5rem);
  font-family: ${theme.fonts.display};
  font-weight: 800;
  text-transform: uppercase;

  b {
    font-size: 1.1rem;
    letter-spacing: 0.12em;
    color: ${theme.ui.accentText};
  }

  span {
    font-size: clamp(1.9rem, 5vw, 2.9rem);
    line-height: 1;
    letter-spacing: 0.02em;
    color: ${theme.ui.text};
  }

  &::after {
    content: '';
    flex: 1;
    align-self: center;
    height: 1px;
    background: ${theme.ui.rule};
  }
`;

const ChapterHead: React.FC<{ n: number; label: string }> = ({ n, label }) => (
  <Head aria-hidden="true">
    <b>{String(n).padStart(2, '0')}</b>
    <span>{label}</span>
  </Head>
);

// A photograph of the place. Ratio and focal point are set per picture, with a squarer crop on phones.
const Photo = styled.figure`
  img {
    display: block;
    width: 100%;
    aspect-ratio: var(--ratio, 16 / 9);
    max-height: var(--max-height, none);
    object-fit: cover;
    object-position: var(--focus, 50% 50%);
    background: ${theme.ui.pageRaised};
  }

  figcaption {
    margin-top: 0.7rem;
    font-family: ${theme.fonts.display};
    font-weight: 700;
    font-size: 0.8rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${theme.ui.textDim};
  }

  /* where a placard overlaps the bottom of the picture, the caption goes above it instead */
  &[data-caption='top'] {
    display: flex;
    flex-direction: column-reverse;

    figcaption {
      margin: 0 0 0.7rem;
      text-align: right;
    }
  }

  @media (max-width: 700px) {
    img {
      aspect-ratio: var(--ratio-sm, 4 / 3);
    }
  }
`;

// Each placard's wrapper is its size container, so it lays itself out for the room it has (content/kit.tsx)
const Hold = styled.div`
  container-type: inline-size;
  position: relative;
  box-shadow: ${theme.ui.shadow};
`;

type PhotoProps = {
  id: StopId;
  alt: string;
  caption: ReactNode;
  ratio?: string;
  ratioSm?: string;
  focus?: string;
  maxHeight?: string;
  className?: string;
  eager?: boolean;
  captionTop?: boolean;
};

const Picture: React.FC<PhotoProps> = ({ id, alt, caption, ratio, ratioSm, focus, maxHeight, className, eager, captionTop }) => {
  const time = useTimeOfDay();
  return (
    <Photo
      className={className}
      data-caption={captionTop ? 'top' : undefined}
      style={
        {
          '--ratio': ratio,
          '--ratio-sm': ratioSm,
          '--focus': focus,
          '--max-height': maxHeight,
        } as CSSProperties
      }
    >
      <img src={still(id, time)} alt={alt} loading={eager ? 'eager' : 'lazy'} width={1600} height={900} />
      <figcaption>{caption}</figcaption>
    </Photo>
  );
};

/* ───────────────────────── Gate (hero) ───────────────────────── */

const Hero = styled.section`
  figure figcaption {
    max-width: ${theme.layout.max};
    margin-inline: auto;
    padding: 0 ${theme.layout.gutter};
    text-align: right;
  }
`;

// The gate sign stands over the bottom edge of the photograph, as it stands in front of the stack
const HeroSign = styled(Hold)`
  max-width: 31rem;
  margin-top: clamp(-11rem, -14vw, -2.5rem);
  z-index: 1;
`;

/* ───────────────────────── Experience ───────────────────────── */

// Photo and lightbox overlap like a collage: the lightbox sits across the photo's right edge
const Collage = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));

  > figure {
    grid-column: 1 / 9;
    grid-row: 1;
  }

  > div {
    grid-column: 8 / 13;
    grid-row: 1;
    align-self: start;
    margin-top: clamp(3rem, 9vw, 7rem);
  }

  @media (max-width: 900px) {
    display: block;

    > div {
      margin-top: 1.25rem;
    }
  }
`;

/* ───────────────────────── Projects ───────────────────────── */

const Project = styled('article', { shouldForwardProp: (prop) => prop !== 'flip' })<{ flip: boolean }>`
  display: grid;
  grid-template-columns: ${({ flip }) => (flip ? 'minmax(0, 7fr) minmax(0, 5fr)' : 'minmax(0, 5fr) minmax(0, 7fr)')};
  gap: clamp(1.5rem, 3vw, 2.5rem);
  align-items: center;
  scroll-margin-top: ${theme.layout.navHeight};

  &:not(:first-of-type) {
    margin-top: clamp(3.5rem, 8vw, 6rem);
  }

  > figure {
    order: ${({ flip }) => (flip ? 2 : 1)};
  }
  > div {
    order: ${({ flip }) => (flip ? 1 : 2)};
  }

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);

    > figure,
    > div {
      order: 0;
    }
  }
`;

/* ───────────────────────── Skills & contact ───────────────────────── */

/* ───────────────────────── AI & Security ───────────────────────── */

// Two places in one chapter: each a wide photograph with its board standing over the lower edge
const Part = styled.section`
  scroll-margin-top: ${theme.layout.navHeight};

  & + & {
    margin-top: clamp(3.5rem, 8vw, 6rem);
  }
`;

const OverPhoto = styled(Hold)`
  margin: clamp(-9rem, -11vw, -2rem) auto 0;
  max-width: 60rem;
  z-index: 1;
`;

const Band = styled(Picture)`
  figcaption {
    max-width: ${theme.layout.max};
    margin-inline: auto;
    padding: 0 ${theme.layout.gutter};
  }
`;

const OverBand = styled(Hold)`
  margin-top: clamp(-8rem, -10vw, -2rem);
  z-index: 1;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: 1.25rem;
  align-items: start;
  margin-top: clamp(-8rem, -10vw, -2rem);
  position: relative;
  z-index: 1;
  padding: 0 clamp(0rem, 3vw, 2.5rem);

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Plaque = styled(Hold)`
  max-width: 26rem;
  margin: 1.25rem clamp(0rem, 3vw, 2.5rem) 0 auto;
`;

/* ───────────────────────── Page ───────────────────────── */

const DocumentSite: React.FC = () => {
  const night = useTimeOfDay() === 'night';

  useLayoutEffect(() => {
    setScroller((id, smooth) => {
      const behavior = smooth ? 'smooth' : 'auto';
      if (id === 'gate') window.scrollTo({ top: 0, behavior });
      else document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' });
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
      <Hero id="gate" data-stop="gate">
        <Picture
          id="gate"
          eager
          ratio="21 / 9"
          ratioSm="4 / 3"
          focus="62% 50%"
          maxHeight={`calc(78vh - ${theme.layout.navHeight})`}
          alt={
            night
              ? 'Night at a container terminal: “Jayprakash” and “Behera” stencilled across a stack of shipping containers under an amber floodlight.'
              : 'A container terminal by day: “Jayprakash” and “Behera” stencilled across a stack of shipping containers.'
          }
          caption={night ? 'The gate · night shift' : 'The gate · day shift'}
        />
        <Wrap>
          <HeroSign>
            <GateSign />
          </HeroSign>
        </Wrap>
      </Hero>

      <Chapter id="notice" data-stop="notice">
        <Wrap>
          <ChapterHead n={1} label="About" />
          <Hold>
            <OperatorBoard />
          </Hold>
        </Wrap>
      </Chapter>

      <Chapter id="bay" data-stop="bay">
        <Wrap>
          <ChapterHead n={2} label="Experience" />
          <Collage>
            <Picture
              id="bay"
              ratio="16 / 10"
              focus="45% 55%"
              alt={`A loading bay ${night ? 'at night' : 'by day'}: four containers marked Inventory, Tasks, Vendors and Orders hang from one gantry beam marked “REST API · JWT + RBAC”, piped into tanks marked Redis and MongoDB.`}
              caption="The loading bay · four modules on one API gantry"
            />
            <Hold>
              <CaseLightbox inScene={false} />
            </Hold>
          </Collage>
        </Wrap>
      </Chapter>

      <Chapter as="div">
        <Wrap>
          <ChapterHead n={3} label="AI & Security" />
          <Part id="tower" data-stop="tower">
            <Picture
              id="tower"
              ratio="21 / 9"
              ratioSm="4 / 3"
              focus="62% 45%"
              captionTop
              alt={`The terminal's operations tower ${night ? 'at night, its glazed control cab lit amber by screens' : 'by day, its glazed control cab above a concrete shaft'}, with a radar and an antenna mast on the roof.`}
              caption="The ops tower · AI in production"
            />
            <OverPhoto>
              <AIBoard />
            </OverPhoto>
          </Part>
          <Part id="inspection" data-stop="inspection">
            <Picture
              id="inspection"
              ratio="21 / 9"
              ratioSm="4 / 3"
              focus="50% 45%"
              captionTop
              alt={`A container scanner portal spanning the lane ${night ? 'at night, scan lights glowing down its legs' : 'by day'}, its beam lettered “Security inspection · every request checked”.`}
              caption="The scanner portal · security checkpoint"
            />
            <OverPhoto>
              <SecurityBoard />
            </OverPhoto>
          </Part>
        </Wrap>
      </Chapter>

      <Chapter as="div">
        <Wrap>
          {projects.map((project, i) => (
            <React.Fragment key={project.id}>
              {i === 0 && <ChapterHead n={4} label="Projects" />}
              <Project id={`file-${i + 1}`} data-stop={`file-${i + 1}`} flip={i % 2 === 1}>
                <Picture
                  id={`file-${i + 1}` as StopId}
                  ratio="4 / 3"
                  focus="58% 45%"
                  alt={`“${project.title}” painted along a shipping container in the project row, the next stacks receding behind it.`}
                  caption={`Row ${String(i + 1).padStart(2, '0')} · ${project.code}`}
                />
                <Hold>
                  <Manifest project={project} index={i} />
                </Hold>
              </Project>
            </React.Fragment>
          ))}
        </Wrap>
      </Chapter>

      <Chapter id="signals" data-stop="signals">
        <Wrap>
          <ChapterHead n={5} label="Skills" />
        </Wrap>
        <Band
          id="signals"
          ratio="21 / 9"
          ratioSm="4 / 3"
          focus="50% 58%"
          maxHeight="64vh"
          captionTop
          alt="A signal gantry over the lane with six signal heads — Languages, Frontend, Backend, Mobile, Data, Cloud / DevOps — and an amber lamp lit for every skill."
          caption="The signal gantry · one lamp per skill"
        />
        <Wrap>
          <OverBand>
            <SkillsBoard inScene={false} />
          </OverBand>
        </Wrap>
      </Chapter>

      <Chapter id="dispatch" data-stop="dispatch">
        <Wrap>
          <ChapterHead n={6} label="Contact" />
          <Picture
            id="dispatch"
            ratio="21 / 9"
            ratioSm="4 / 3"
            focus="45% 50%"
            captionTop
            alt={
              night
                ? 'The dispatch office at the end of the quay at night, its window lit amber behind half-drawn blinds.'
                : 'The dispatch office at the end of the quay by day, cranes over the water behind it.'
            }
            caption="The dispatch office · end of the quay"
          />
          <ContactGrid>
            <Hold>
              <DispatchWindow />
            </Hold>
            <Hold>
              <OrderSlip />
            </Hold>
          </ContactGrid>
          <Plaque>
            <EducationPlaque />
          </Plaque>
        </Wrap>
      </Chapter>
    </Main>
  );
};

export default DocumentSite;
