// Night shift at a container terminal: ink-navy night, bone-white paint and paper, sodium-amber signal light.
// Three colours, used by what they are in the yard rather than as decoration:
//   ink    — the night itself (page, sky, fog) and dark enamel/glass
//   bone   — paint, paper and enamel: anything that carries words
//   amber  — light. Lamps, the lightbox, the live status. Copper is amber's dark shade, for use on bone.
export const theme = {
  colors: {
    ink: '#0B121C',
    inkRaised: '#172234', // dark enamel and steel boards
    bone: '#ECE4D2',
    boneMuted: '#B7B09F', // secondary text on ink (8:1)
    boneDim: '#8E8878', // labels on ink (5:1)
    amber: '#F0A13A',
    copper: '#8F4A14', // amber on bone paper (5:1)
    inkMuted: '#4F5563', // secondary text on bone (5.8:1)
    ruleOnInk: 'rgba(236, 228, 210, 0.18)',
    ruleOnBone: 'rgba(11, 18, 28, 0.22)',
  },

  fonts: {
    // Big Shoulders: condensed industrial capitals. Its stencil cut is used for paint on steel in the 3D scene.
    display: `'Big Shoulders Display', 'Arial Narrow', sans-serif`,
    body: `'Archivo', system-ui, -apple-system, 'Segoe UI', sans-serif`,
  },

  transitions: {
    fast: '0.18s ease-out',
  },

  layout: {
    navHeight: '3.5rem',
    gutter: 'clamp(1rem, 4vw, 3rem)',
    max: '1200px',
  },

  breakpoints: {
    sm: '560px',
    md: '900px',
  },
};
