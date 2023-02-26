"use client";

import React, { useEffect, useRef } from 'react';
import { Card, Typography } from "@mui/material";
import { renderToStaticMarkup } from "react-dom/server"
import { Parser } from 'n3';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import cola from 'cytoscape-cola';
import dagre from 'cytoscape-dagre';
import spread from 'cytoscape-spread';
import COSEBilkent from 'cytoscape-cose-bilkent';
import popper from 'cytoscape-popper';
// import euler from 'cytoscape-euler';

cytoscape.use(fcose)
cytoscape.use(dagre)
cytoscape.use(cola)
spread(cytoscape)
cytoscape.use(COSEBilkent);
cytoscape.use( popper );
// Cytoscape.use(euler) // out of memory

// Install dependencies:
// yarn add cytoscape cytoscape-cola

// Add tooltip? https://www.npmjs.com/package/cytoscape-popper/v/1.0.3
// Edit graph? https://github.com/iVis-at-Bilkent/cytoscape.js-expand-collapse

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
  parser.parse(
    text,
    (error, quad, prefixes) => {
      if (error) {
        console.log(error)
        return null
      }
      if (quad && quad.subject.value && quad.object.value) {
        // console.log("quad", quad.object.termType)
        // Subject and Object nodes
        cytoscapeElems.push({ data: {
          id: quad.subject.value,
          label: quad.subject.value,
          shape: 'ellipse',
          backgroundColor: '#90caf9',
          // parent: 'graph-' + quad.graph.value,
          parent: quad.graph.value,
          valign : "center",
          fontSize: "30px",
          fontWeight: "300",
          textColor: '#212121',
          // https://stackoverflow.com/questions/58557196/group-nodes-together-in-cytoscape-js
        } })
        // For literal that are too long without spaces, like public keys
        const cutLongObject = (!quad.object.value.includes(' ') && quad.object.value.length > 100) ? quad.object.value.replace(/(.{60})/g,"$1\n") : quad.object.value
        cytoscapeElems.push({ data: {
          id: quad.object.value,
          label: cutLongObject,
          shape: (quad.object.termType == 'NamedNode') ? 'ellipse' : 'round-rectangle',
          backgroundColor: (quad.object.termType == 'NamedNode') ? '#90caf9' : '#80cbc4', // blue or green
          textColor: '#000000', // black
          // parent: 'graph-' + quad.graph.value,
          parent: quad.graph.value,
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
        // Add the graph to the list of graphs
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
          // Add Graph node at start of cytoscape graph
          cytoscapeElems.unshift({ data: {
            // id: 'graph-' + g,
            id: g,
            label: g,
            shape: 'round-rectangle',
            backgroundColor: graphColor,
            textColor: graphTextColor,
            valign : "top",
            fontSize: "50px",
            fontWeight: "700",
          } })
        })

        const allPrefixes = {...prefixes, 'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'}
        // Resolve prefixes
        cytoscapeElems.map((elem: any) => {
          if (elem.data.label) {
            elem.data.label = replacePrefix(elem.data.label, allPrefixes)
          }
        })
      }

    },
  )

  // console.log('cytoscapeElems:', cytoscapeElems)
  return cytoscapeElems
}


const displayLink = (urlString: string) => {
  if(/^(?:node[0-9]+)|((https?|ftp):.*)$/.test(urlString)) {
    return <a href={urlString} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
      {urlString}
      </a>
  } else {
    return urlString
  }
}


// Component to display RDF as a graph with Cytoscape
// export default function CytoscapeRdfGraph(props: any) {
export function CytoscapeRdfGraph({
  rdf,
  cytoscapeElems = rdfToCytoscape(rdf),
  layout = defaultLayout['cose-bilkent'],
}: any) {
  const containerRef: any = useRef();

  useEffect(() => {
    const config = {
      container: containerRef.current,
      style: cytoStyles,
      elements: cytoscapeElems,
      layout: layout,
      boxSelectionEnabled: true,
      autounselectify: true,
      autoungrabify: false,
      wheelSensitivity: 0.1,
      showOverlay: true,
    };

    // @ts-ignore
    const cy = cytoscape(config);

    // Add on click actions to show cards with more details on an object
    cy.$('node').on('tap', function (e: any) {
      cy.edges().style({
        'line-color': '#263238', 'color': '#263238',
        'width': 2, 'target-arrow-color': '#263238',
        'font-size': '30px'
      }); // Grey
      var ele = e.target;
      ele.connectedEdges().style({
        'line-color': '#c62828', 'color': '#c62828', // red
        'width': 4, 'target-arrow-color': '#c62828',
        'font-size': '40px',
      });
    });
    // Show a card with the value of the node (e.g. clickable link for URI)
    cy.$('node').on('tap', function (e: any) {
      const oldEle = document.getElementById("cytoPop");
      if (oldEle) oldEle.remove();
      var ele = e.target;
      // const elementLabel = (ele.id().startsWith('graph-http')) ? ele.id().replace('graph-http', '') : ele.id()
      ele.popper({
        content: () => {
          // console.log(ele)
          let div = document.createElement('div');
          // Replace the start "graph-http" for graphs nodes URIs
          const elementLabel = (ele.id().startsWith('graph-http')) ? ele.id().replace('graph-http', 'http') : ele.id()

          // const staticElement = renderToStaticMarkup(
          const staticElement = renderToStaticMarkup(
            <Card className='paper'>
              {/* <CardHeader
                action={<IconButton aria-label="hide" onClick={removePopper}>
                  <CloseIcon />
                </IconButton>}
                style={{paddingBottom: '0px'}}/> */}
              {/* <CardContent> */}
              <Typography variant='body2'>
                {displayLink(elementLabel)}
              </Typography>
              {/* </CardContent> */}
            </Card>)
          div.innerHTML = `<div id="cytoPop">${staticElement}</div>`
          document.body.appendChild( div );
          // ReactDOM.render(staticElement, document.getElementById('root'));
          return div;
        }
      });
    });
    // Remove Card when click on the canvas
    cy.on('tap', function(event: any){
      if( event.target === cy ){
        // tap on background
        const oldEle = document.getElementById("cytoPop");
        if (oldEle) oldEle.remove();
      }
    });

  }, []);


  const cytoStyles = [
    {
      selector: 'edge',
      style: {
        'label': 'data(label)',
        'color': '#263238', // Grey
        'line-color': '#263238',
        'width': 2,
        'arrow-scale': 2,
        'target-arrow-color': '#263238',
        // 'target-arrow-color': '#ccc',
        'text-wrap': 'wrap' as const,
        'font-size': '30px',
        'text-opacity': 0.9,
        'target-arrow-shape': 'triangle' as const,
        // Control multi edge on 2 nodes:
        'curve-style': 'bezier' as const,
        'control-point-step-size': 300,
        // width: 15
      }
    },
    {
      selector: 'edge:parent',
      style: {
        'color': '#c62828', // red
        'line-color': '#c62828',
        'width': 2,
        'arrow-scale': 2,
        'target-arrow-color': '#c62828',
        // 'target-arrow-color': '#ccc',
      }
    },
    // {
    //   selector: 'edge.highlighted',
    //   style: {
    //     'color': '#0d47a1', // blue
    //   }
    // },
    {
      selector: 'node',
      style: {
        'label': 'data(label)',
        'text-wrap': 'wrap' as const,
        // 'word-break': 'break-all',
        'overflow-wrap': 'break-word',
        // 'white-space': 'pre-wrap',
        "text-max-width": '800px',
        'font-size': 'data(fontSize)',
        // 'font-weight': 'data(fontWeight)',
        // @ts-ignore
        "text-valign" : "data(valign)" as const,
        "text-halign" : "center" as const,
        "width": 'label',
        // width: 20,
        "height": 'label',
        "padding": '25px',
        // https://js.cytoscape.org/#style/node-body
        "shape": 'data(shape)',
        "background-color": 'data(backgroundColor)',
        "color": 'data(textColor)',
        // "color": 'data(color)',
      }
    }
  ]

  return(
    <>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
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
    nodeSeparation: 200,
    // Power iteration tolerance
    piTol: 0.0000001,
    /* incremental layout options */
    // Node repulsion (non overlapping) multiplier
    nodeRepulsion: (node: any) => 4500,
    // Ideal edge (non nested) length
    idealEdgeLength: (edge: any) => 300,
    // Divisor to compute edge forces
    edgeElasticity: (edge: any) => 0.45,
    // Nesting factor (multiplier) to compute ideal edge length for nested edges
    nestingFactor: 0.4,
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
    gravityRangeCompound: 2,
    // Gravity force (constant) for compounds
    gravityCompound: 0.5,
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
    // ready: () => {}, // on layoutready
    // stop: () => {} // on layoutstop
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
    minLen: function( edge: any ){ return 2; }, // number of ranks to keep between the source and target of the edge
    edgeWeight: function( edge: any ){ return 1; }, // higher weight edges are generally made shorter and straighter than lower weight edges

    // general layout options
    fit: true, // whether to fit to viewport
    padding: 30, // fit padding
    spacingFactor: 1, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
    nodeDimensionsIncludeLabels: true, // whether labels should be included in determining the space used by a node
    animate: false, // whether to transition the node positions
    animateFilter: function( node: any, i: any ){ return true; }, // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    transform: function( node: any, pos: any ){ return pos; }, // a function that applies a transform to the final node position
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
  },
  'cose-bilkent': {
    name: 'cose-bilkent',
    // Called on `layoutready`
    ready: function () {
    },
    // Called on `layoutstop`
    stop: function () {
    },
    // 'draft', 'default' or 'proof"
    // - 'draft' fast cooling rate
    // - 'default' moderate cooling rate
    // - "proof" slow cooling rate
    quality: 'default',
    // Whether to include labels in node dimensions. Useful for avoiding label overlap
    nodeDimensionsIncludeLabels: false,
    // number of ticks per frame; higher is faster but more jerky
    refresh: 30,
    // Whether to fit the network view after when done
    fit: true,
    // Padding on fit
    padding: 10,
    // Whether to enable incremental mode
    randomize: true,
    // Node repulsion (non overlapping) multiplier
    nodeRepulsion: 4500,
    // Ideal (intra-graph) edge length
    idealEdgeLength: 200,
    // Divisor to compute edge forces
    edgeElasticity: 0.45,
    // Nesting factor (multiplier) to compute ideal edge length for inter-graph edges
    nestingFactor: 0.1,
    // Gravity force (constant)
    gravity: 0.25,
    // Maximum number of iterations to perform
    numIter: 2500,
    // Whether to tile disconnected nodes
    tile: true,
    // Type of layout animation. The option set is {'during', 'end', false}
    animate: false,
    // Duration for animate:end
    animationDuration: 500,
    // Amount of vertical space to put between degree zero nodes during tiling (can also be a function)
    tilingPaddingVertical: 10,
    // Amount of horizontal space to put between degree zero nodes during tiling (can also be a function)
    tilingPaddingHorizontal: 10,
    // Gravity range (constant) for compounds
    gravityRangeCompound: 1.5,
    // Gravity force (constant) for compounds
    gravityCompound: 1.0,
    // Gravity range (constant)
    gravityRange: 3.8,
    // Initial cooling factor for incremental layout
    initialEnergyOnIncremental: 0.5
  }
}

