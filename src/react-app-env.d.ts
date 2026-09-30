/// <reference types="react-scripts" />

declare module '*.woff' {
  const src: string;
  export default src;
}

// troika-three-text (drei's text engine) ships without types; only its builder config is used directly
declare module 'troika-three-text' {
  export function configureTextBuilder(config: { useWorker?: boolean; sdfGlyphSize?: number; defaultFontURL?: string }): void;
}
