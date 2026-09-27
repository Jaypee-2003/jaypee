import { theme } from '../styles/theme';

// Colours for the 3D yard. Same three-colour system as the page — ink, bone, amber — expressed as
// paints and light rather than UI colours.
export const PAL = {
  night: theme.colors.ink, // sky, fog, and the page behind every placard
  asphalt: '#1A212C',
  concrete: '#3A3F47',
  water: '#070C13',

  // Container paint. Cargo is matte and dark so the lamps and the paint on it do the talking.
  paint: {
    steel: '#495262',
    ink: '#1F2B41',
    bone: '#CBC2AC',
    copper: '#7C4526',
    dark: '#161D29',
  },

  stencil: '#E6DDC8', // bone paint on steel
  stencilDark: '#151C28', // ink paint on bone containers
  lamp: '#FFA53D', // sodium amber, emissive
  warning: '#E4472C', // obstruction lights and barrier stripes: the one red, used sparingly
  moon: '#A9B8CF',
  wire: '#3A3D45', // steel lattice drawn as wireframe
};

export type Paint = keyof typeof PAL.paint;
