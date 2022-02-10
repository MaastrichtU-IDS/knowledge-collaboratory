import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import { Parser } from 'n3';
import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from 'cytoscape';

import fcose from 'cytoscape-fcose';
Cytoscape.use( fcose );
// import Cola from 'cytoscape-cola';
// Cytoscape.use(Cola);
// const $rdf = require('rdflib')

// Install dependencies:
// yarn add cytoscape cytoscape-cola react-cytoscapejs

// Add tooltip? https://www.npmjs.com/package/cytoscape-popper/v/1.0.3

const replacePrefix = (uri: string, prefixes: any) => {
  // const namespace = (uri.lastIndexOf('#') > 0) ? uri.lastIndexOf('#') : uri.lastIndexOf('/')
  for (let i = 0; i < Object.keys(prefixes).length; i++) {
    const prefix = Object.keys(prefixes)[i]
    if (uri.startsWith(prefixes[prefix])) {
      return uri.replace(prefixes[prefix], prefix + ':')
    }
  }
  return uri
}


export const rdfToCytoscape = (text: string) => {
  const parser = new Parser({ format: 'application/trig' })
  const cytoscapeElems: any = []
  const graphs: any = {}
  // console.log(text)
  parser.parse(
    text,
    (error, quad, prefixes) => {
      if (error) {
        console.log(error)
        return null
      }
      if (quad) { 
        console.log("quad", quad.object.termType)
        cytoscapeElems.push({ data: { 
          id: quad.subject.value, 
          label: quad.subject.value,
          shape: 'ellipse',
          color: '#90caf9',
          parent: 'graph-' + quad.graph.value,
          // https://stackoverflow.com/questions/58557196/group-nodes-together-in-cytoscape-js
        } })
        cytoscapeElems.push({ data: { 
          id: quad.object.value, 
          label: quad.object.value,
          shape: (quad.object.termType == 'NamedNode') ? 'ellipse' : 'round-rectangle',
          color: (quad.object.termType == 'NamedNode') ? '#90caf9' : '#80cbc4',
          parent: 'graph-' + quad.graph.value,
        } })
        cytoscapeElems.push({ data: { 
          source: quad.subject.value, 
          target: quad.object.value,
          label: quad.predicate.value,
        } })
        graphs[quad.graph.value] = quad.graph.value

      } else {
        Object.keys(graphs).map((g: string) => {
          let graphColor = '#eceff1'
          if (g.endsWith('assertion')) {
            graphColor = '#e3f2fd'
          } else if (g.endsWith('provenance')) {
            graphColor = '#ffebee'
          } else if (g.endsWith('pubInfo')) {
            graphColor = '#fffde7'
          }
          cytoscapeElems.push({ data: { 
            id: 'graph-' + g, 
            label: g,
            shape: 'round-rectangle',
            color: graphColor,
          } })
        })

        // Resolve prefixes
        cytoscapeElems.map((elem: any) => {
          if (elem.data.label) {
            elem.data.label = replacePrefix(elem.data.label, prefixes) 
          }
        })
      }
      
    },
  )
  
  // console.log('cytoscapeElems:', cytoscapeElems)
  return cytoscapeElems
}


// Component to display RDF as a graph with Cytoscape
// export default function CytoscapeRdfGraph(props: any) {
export function CytoscapeRdfGraph(props: any) {
  const rdf = props.rdf;
  const cytoscapeElems = (props.cytoscapeElems) ? props.cytoscapeElems : rdfToCytoscape(props.rdf);
  // const layout = 
  const layout = (props.layout) ? props.layout : defaultLayout;
  // TODO: for some reason the nodes/edges are not displayed when the cytoscapeElems are 
  // generated using rdfToCytoscape() directly at component initialization
  
  // const [state, setState] = React.useState({
  //   cytoscapeElems: [],
  //   rdf: '',
  // });
  // const stateRef = React.useRef(state);
  // // Avoid conflict when async calls
  // const updateState = React.useCallback((update) => {
  //   stateRef.current = {...stateRef.current, ...update};
  //   setState(stateRef.current);
  // }, [setState]);
  
  // React.useEffect(() => {
  // }, [])


  return(
    <>
      {cytoscapeElems.length > 0 &&
        <CytoscapeComponent 
          elements={cytoscapeElems} 
          layout={layout}
          style={{ width: '100%', height: '100%' }} 
          wheelSensitivity={0.1}
          // boxSelectionEnabled: false,
          // autounselectify: true,
          // infinite={false}
          stylesheet={[
            {
              selector: 'edge',
              style: {
                'label': 'data(label)',
                'color': '#546e7a', // Grey
                'text-wrap': 'wrap',
                'font-size': '25px',
                'text-opacity': 0.9,
                'target-arrow-shape': 'triangle',
                // 'line-color': '#ccc',
                // 'target-arrow-color': '#ccc',
                // Control multi edge on 2 nodes:
                'curve-style': 'bezier',
                'control-point-step-size': 300,
                // width: 15
              }
            },
            {
              selector: 'node',
              style: {
                'label': 'data(label)',
                'text-wrap': 'wrap',
                'word-break': 'break-all',
                'font-size': '30px',
                "text-valign" : "center",
                "text-halign" : "center",
                "width": 'label',
                // width: 20,
                "height": 'label',
                "padding": '25px',
                // https://js.cytoscape.org/#style/node-body
                "shape": 'data(shape)',
                "backgroundColor": 'data(color)',
                "text-max-width": '800px',
                // "color": 'data(color)',
              }
            }
          ]}
        />
      }
    </>
  )
}


// Change Cytoscape layout: https://js.cytoscape.org/#layouts

const defaultLayout = {
  name: 'fcose',
  // 'draft', 'default' or 'proof' 
  // - "draft" only applies spectral layout 
  // - "default" improves the quality with incremental layout (fast cooling rate)
  // - "proof" improves the quality with incremental layout (slow cooling rate) 
  quality: "default",
  // Use random node positions at beginning of layout
  // if this is set to false, then quality option must be "proof"
  randomize: true, 
  infinite: false,
  // Whether or not to animate the layout
  animate: false, 
  // Duration of animation in ms, if enabled
  animationDuration: 1000, 
  // Easing of animation, if enabled
  animationEasing: undefined, 
  // Fit the viewport to the repositioned nodes
  fit: true, 
  // Padding around layout
  padding: 30,
  // Whether to include labels in node dimensions. Valid in "proof" quality
  nodeDimensionsIncludeLabels: true,
  // Whether or not simple nodes (non-compound nodes) are of uniform dimensions
  uniformNodeDimensions: false,
  // Whether to pack disconnected components - cytoscape-layout-utilities extension should be registered and initialized
  packComponents: false,
  // Layout step - all, transformed, enforced, cose - for debug purpose only
  step: "all",
  // False for random, true for greedy sampling
  samplingType: true,
  // Sample size to construct distance matrix
  sampleSize: 25,
  // Separation amount between nodes
  nodeSeparation: 100,
  // Power iteration tolerance
  piTol: 0.0000001,
  /* incremental layout options */
  // Node repulsion (non overlapping) multiplier
  nodeRepulsion: node => 4500,
  // Ideal edge (non nested) length
  idealEdgeLength: edge => 100,
  // Divisor to compute edge forces
  edgeElasticity: edge => 0.45,
  // Nesting factor (multiplier) to compute ideal edge length for nested edges
  nestingFactor: 0.1,
  // Maximum number of iterations to perform - this is a suggested value and might be adjusted by the algorithm as required
  numIter: 2500,
  // For enabling tiling
  tile: true,  
  // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
  tilingPaddingVertical: 10,
  // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
  tilingPaddingHorizontal: 10,
  // Gravity force (constant)
  gravity: 0.25,
  // Gravity range (constant) for compounds
  gravityRangeCompound: 1.5,
  // Gravity force (constant) for compounds
  gravityCompound: 1.0,
  // Gravity range (constant)
  gravityRange: 3.8, 
  // Initial cooling factor for incremental layout  
  initialEnergyOnIncremental: 0.3,
  /* constraint options */
  // Fix desired nodes to predefined positions
  // [{nodeId: 'n1', position: {x: 100, y: 200}}, {...}]
  fixedNodeConstraint: undefined,
  // Align desired nodes in vertical/horizontal direction
  // {vertical: [['n1', 'n2'], [...]], horizontal: [['n2', 'n4'], [...]]}
  alignmentConstraint: undefined,
  // Place two nodes relatively in vertical/horizontal direction
  // [{top: 'n1', bottom: 'n2', gap: 100}, {left: 'n3', right: 'n4', gap: 75}, {...}]
  relativePlacementConstraint: undefined,
  /* layout event callbacks */
  ready: () => {}, // on layoutready
  stop: () => {} // on layoutstop
};

// const defaultLayout = {
//   name: 'cola',
//   nodeSpacing: 150,
//   // edgeLengthVal: 1000,
//   animate: false,
//   randomize: false,
//   maxSimulationTime: 1500
// }
// Spread: https://github.com/cytoscape/cytoscape.js-spread
// const defaultLayout = {
//   name: 'spread',
//   animate: true, // Whether to show the layout as it's running
//   ready: undefined, // Callback on layoutready
//   stop: undefined, // Callback on layoutstop
//   fit: true, // Reset viewport to fit default simulationBounds
//   minDist: 20, // Minimum distance between nodes
//   padding: 20, // Padding
//   expandingFactor: -1.0, // If the network does not satisfy the minDist
//   // criterium then it expands the network of this amount
//   // If it is set to -1.0 the amount of expansion is automatically
//   // calculated based on the minDist, the aspect ratio and the
//   // number of nodes
//   prelayout: { name: 'cose' }, // Layout options for the first phase
//   maxExpandIterations: 4, // Maximum number of expanding iterations
//   boundingBox: undefined, // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
//   randomize: false // Uses random initial node positions on true
// };

// const defaultLayout = { 
//   name: 'concentric',
//   minNodeSpacing: 20
// };
// const defaultLayout = { name: 'breadthfirst' };
// const defaultLayout = {
//   name: 'cose',
//   animate: 'end',
//   fit: true,
//   componentSpacing: 1000,
//   nodeOverlap: 10,
//   nodeRepulsion: function( node: any ){ return 4092; },
//   idealEdgeLength: function( edge: any ){ return 300; },
// };