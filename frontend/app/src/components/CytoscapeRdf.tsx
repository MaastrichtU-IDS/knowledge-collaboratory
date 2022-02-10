import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import { Parser } from 'n3';
import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from 'cytoscape';

import fcose from 'cytoscape-fcose';
import cola from 'cytoscape-cola';
import dagre from 'cytoscape-dagre';
import spread from 'cytoscape-spread';
// import euler from 'cytoscape-euler';

Cytoscape.use(fcose)
Cytoscape.use(dagre)
Cytoscape.use(cola)
spread(Cytoscape)
// Cytoscape.use(euler) // out of memory

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
        // Subject and Object nodes
        cytoscapeElems.push({ data: { 
          id: quad.subject.value, 
          label: quad.subject.value,
          shape: 'ellipse',
          backgroundColor: '#90caf9',
          parent: 'graph-' + quad.graph.value,
          valign : "center",
          fontSize: "30px", 
          fontWeight: "300",
          textColor: '#212121',
          // https://stackoverflow.com/questions/58557196/group-nodes-together-in-cytoscape-js
        } })
        cytoscapeElems.push({ data: { 
          id: quad.object.value, 
          label: quad.object.value,
          shape: (quad.object.termType == 'NamedNode') ? 'ellipse' : 'round-rectangle',
          backgroundColor: (quad.object.termType == 'NamedNode') ? '#90caf9' : '#80cbc4', // blue or green
          textColor: '#000000', // black
          parent: 'graph-' + quad.graph.value,
          valign : "center", 
          fontSize: "30px", 
          fontWeight: "300",
        } })
        // Add Predicate edge to cytoscape graph
        cytoscapeElems.push({ data: { 
          source: quad.subject.value, 
          target: quad.object.value,
          label: quad.predicate.value,
        } })
        graphs[quad.graph.value] = quad.graph.value

      } else {
        Object.keys(graphs).map((g: string) => {
          let graphColor = '#eceff1'
          let graphTextColor = '#000000'
          if (g.endsWith('assertion')) {
            // blue
            graphColor = '#e3f2fd'
            graphTextColor = '#0d47a1'
          } else if (g.endsWith('provenance')) {
            // Red
            graphColor = '#ffebee'
            graphTextColor = '#b71c1c'
          } else if (g.toLowerCase().endsWith('pubinfo')) {
            // Yellow
            graphColor = '#fffde7'
            graphTextColor = '#f57f17'
          }
          // Add Graph node to cytoscape graph
          cytoscapeElems.push({ data: { 
            id: 'graph-' + g, 
            label: g,
            shape: 'round-rectangle',
            backgroundColor: graphColor,
            textColor: graphTextColor,
            valign : "top",
            fontSize: "50px", 
            fontWeight: "700",
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
  const layout = (props.layout) ? props.layout : defaultLayout['fcose'];
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
                // 'word-break': 'break-all',
                'overflow-wrap': 'break-all',
                "text-max-width": '800px',
                'font-size': 'data(fontSize)',
                'font-weight': 'data(fontWeight)',
                "text-valign" : "data(valign)",
                "text-halign" : "center",
                "width": 'label',
                // width: 20,
                "height": 'label',
                "padding": '25px',
                // https://js.cytoscape.org/#style/node-body
                "shape": 'data(shape)',
                "backgroundColor": 'data(backgroundColor)',
                "color": 'data(textColor)',
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
// Layout options for dagre:
const defaultLayout = {
  'fcose': {
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
    idealEdgeLength: edge => 150,
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
  },
  'dagre': {
    name: 'dagre',
    // dagre algo options, uses default value on undefined
    nodeSep: undefined, // the separation between adjacent nodes in the same rank
    edgeSep: undefined, // the separation between adjacent edges in the same rank
    rankSep: undefined, // the separation between each rank in the layout
    rankDir: 'TB', // 'TB' for top to bottom flow, 'LR' for left to right,
    align: 'DR',  // alignment for rank nodes. Can be 'UL', 'UR', 'DL', or 'DR', where U = up, D = down, L = left, and R = right
    acyclicer: undefined, // If set to 'greedy', uses a greedy heuristic for finding a feedback arc set for a graph.
                          // A feedback arc set is a set of edges that can be removed to make a graph acyclic.
    ranker: 'network-simplex', // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
    minLen: function( edge ){ return 2; }, // number of ranks to keep between the source and target of the edge
    edgeWeight: function( edge ){ return 1; }, // higher weight edges are generally made shorter and straighter than lower weight edges

    // general layout options
    fit: true, // whether to fit to viewport
    padding: 30, // fit padding
    spacingFactor: 1, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
    nodeDimensionsIncludeLabels: true, // whether labels should be included in determining the space used by a node
    animate: false, // whether to transition the node positions
    animateFilter: function( node, i ){ return true; }, // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    transform: function( node, pos ){ return pos; }, // a function that applies a transform to the final node position
    ready: function(){}, // on layoutready
    stop: function(){} // on layoutstop
  },
  'cola': {
    name: 'cola',
    nodeSpacing: 150,
    // edgeLengthVal: 1000,
    animate: false,
    randomize: false,
    maxSimulationTime: 1500
  },
  // Spread: https://github.com/cytoscape/cytoscape.js-spread
  'spread': {
    name: 'spread',
    animate: true, // Whether to show the layout as it's running
    ready: undefined, // Callback on layoutready
    stop: undefined, // Callback on layoutstop
    fit: true, // Reset viewport to fit default simulationBounds
    minDist: 20, // Minimum distance between nodes
    padding: 20, // Padding
    expandingFactor: -1.0, // If the network does not satisfy the minDist
    // criterium then it expands the network of this amount
    // If it is set to -1.0 the amount of expansion is automatically
    // calculated based on the minDist, the aspect ratio and the
    // number of nodes
    prelayout: { name: 'cose' }, // Layout options for the first phase
    maxExpandIterations: 4, // Maximum number of expanding iterations
    boundingBox: undefined, // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    randomize: false // Uses random initial node positions on true
  }
}

