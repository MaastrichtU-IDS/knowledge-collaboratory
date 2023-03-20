// Declare modules with missing types here
declare module 'cytoscape-spread'
declare module 'cytoscape-cose-bilkent'
declare module 'cytoscape-cola'
// import type {JSX} from '@nanopub/display'
// declare namespace JSX {
//     LocalJSX
// }
// declare namespace JSX {JSX};

declare namespace JSX {
  interface NanopubDisplay {
    url?: string
    rdf?: string
  }
  interface IntrinsicElements {
    'nanopub-display': NanopubDisplay
  }
}
