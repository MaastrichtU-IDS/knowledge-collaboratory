// import React from "react";
// import { useTheme } from '@mui/material/styles';
// // const $rdf = require('rdflib')
// import $rdf from 'rdflib';
// // const $rdf = require('rdflib')
// import { genericContext } from './settings';

export const dummy = "dummy"

// export const rdfToRdf = (data: any, output: string = 'text/turtle', input: string = 'application/ld+json') => {
//   // Convert RDF to JSON-LD using rdflib
//   // let rdf_format = 'application/rdf+xml';
//   // if (uri.endsWith('.ttl')) rdf_format = 'text/turtle'
//   // if (uri.endsWith('.nq')) rdf_format = 'application/n-quads'
//   // // Or text/x-nquads
//   // if (uri.endsWith('.nt')) rdf_format = 'application/n-triples'
//   // if (uri.endsWith('.n3')) rdf_format = 'text/n3'
//   // if (uri.endsWith('.trig')) rdf_format = 'application/trig'
//   const baseUri = 'http://w3id.org/collaboratory/'
//   return new Promise((resolve, reject) => {
//       let store = $rdf.graph()
//       // let doc = $rdf.sym(base_uri);
//       $rdf.parse(JSON.stringify(data), store, baseUri, input)
//       // console.log(store)
//       $rdf.serialize(genericContext, store, baseUri, output, (err: any, rdfOutput: any) => {
//         return resolve(rdfOutput)
//       })
//   })
// }


// export const toJSONLD = (data: any, uri: any) => {
//   // Convert RDF to JSON-LD using rdflib
//   let rdf_format = 'application/rdf+xml';
//   if (uri.endsWith('.ttl')) rdf_format = 'text/turtle'
//   if (uri.endsWith('.nq')) rdf_format = 'application/n-quads'
//   // Or text/x-nquads
//   if (uri.endsWith('.nt')) rdf_format = 'application/n-triples'
//   if (uri.endsWith('.n3')) rdf_format = 'text/n3'
//   if (uri.endsWith('.trig')) rdf_format = 'application/trig'
//   return new Promise((resolve, reject) => {
//       let store = $rdf.graph()
//       let doc = $rdf.sym(uri);
//       $rdf.parse(data, store, uri, rdf_format)
//       // console.log(store)
//       $rdf.serialize(doc, store, uri, 'application/ld+json', (err: any, jsonldData: any) => {
//         return resolve(JSON.parse(jsonldData)
//           .sort((a: any, b: any) => {
//             if (a['@type'] && b['@type'] && Array.isArray(a['@type']) && Array.isArray(b['@type'])){
//               // Handle when array of types provided (e.g. SIO via rdflib)
//               return a['@type'][0] < b['@type'][0] ? 1 : -1
//             } else {
//               return a['@type'] < b['@type'] ? 1 : -1
//             }
//           })
//       )
//     })
//   })
// }