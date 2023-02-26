import React, { useEffect } from 'react';

import { Parser, Store } from 'n3';
// import { DataFactory, Parser } from 'n3';

// import hljs from 'highlight.js/lib/core';
// import json from 'highlight.js/lib/languages/json';
// import 'highlight.js/styles/github-dark-dimmed.css';

import { shacl2jsonschema } from './shacl2jsonschema'

// https://github.com/rjsf-team/react-jsonschema-form/tree/master/packages
// import Form from "@rjsf/core";
// Requires bootstrap css imported

// import Form from '@rjsf/material-ui/v5';
// Can't find module for mui v5

import Form from '@rjsf/fluent-ui';
import validator from "@rjsf/validator-ajv8";
// Works! But look like Microsoft UI, and subshapes not distinguishable from parent

// import Form from '@rjsf/material-ui';
// Not that nice style, and it breaks other components colors
// import Form from "@rjsf/chakra-ui";
// Import error in the framer-motion package
// import Form from '@rjsf/semantic-ui';
// Require to import dirty CSS that makes changes to font sizes
// import Form from '@rjsf/antd';
// Even when CSS imported it's not really nice
// import Form from '@rjsf/bootstrap-4';
// Completly broken styles

// Another library, not working "No renderer found"
// https://jsonforms.io/docs/integrations/react/
// yarn add @jsonforms/core @jsonforms/material-renderers @jsonforms/react
// import { JsonForms } from '@jsonforms/react';
// import { materialCells, materialRenderers } from '@jsonforms/material-renderers';


type Props = {
  shape: string;
  target: string;
}


export const JsonldForm = ({ shape, target }: Props) => {
  // const theme = useTheme();

  const parser = new Parser();
  const store = new Store();

  const [state, setState] = React.useState({
    // shape: shape,
    store: store,
    prefixes: {},
    jsonld: {},
    generatedJsonld: {},
    jsonschema: {},
    jsonErrors: {},
    jsonValid: false,
    showJsonld: false,
    showJsonSchema: false,
    targetClass: '',
    showJsonBtnHover: false,
  });

  const stateRef = React.useRef(state);
  // Avoid conflict when async calls
  const updateState = React.useCallback((update: any) => {
    stateRef.current = {...stateRef.current, ...update};
    setState(stateRef.current);
  }, [setState]);


  useEffect(() => {
    // hljs.registerLanguage('json', json);

    // const jsonForm: any = document.getElementById(target);
    // // const event = new CustomEvent('change');
    // jsonForm.addEventListener("change", (event: any) => {
    //   handleChange(event);
    // });
    // setTimeout(function() {
    //   jsonForm.dispatchEvent(event)
    // }, 2000);

    console.log('Parsing the SHACL shape to generate the JSON schema')
    parser.parse(
      shape,
      (error: any, quad: any, prefixes: any) => {
        if (quad) {
          store.add(quad)
        } else {
          console.log("Prefixes:", prefixes);

          const {jsonschema, jsonld, context} = shacl2jsonschema(store, target, prefixes)

          console.log('🏁 Final JSON Schema generated for the SHACL shape:', jsonschema)
          updateState({
            prefixes: context,
            jsonschema: jsonschema,
            jsonld: jsonld,
          })

        }
      });

  }, [shape, target])


  return(
    <div style={{display: 'inline-block'}}>

      <p>
        Form generated from the target shape <code>{target}</code>
        {/* https://stackoverflow.com/questions/56646500/add-hover-effect-to-react-div-using-inline-styling */}
        <button
          onClick={() => {
            updateState({showJsonSchema: !state.showJsonSchema})
          }}
          // style={styles.btn}
          style={{
            color:'#00251a',
            background: '#80cbc4', // Teal
            border: '0.1em solid #4f9a94',
            borderRadius: '0.30em',
            display: 'inline-block',
            padding: '0.35em 1.2em',
            marginLeft: '16px',
            textDecoration: 'none',
            transition: 'all 0.2s',
            ...(state.showJsonBtnHover && { cursor: 'pointer',background: "#4f9a94" }),
          }}
          onMouseEnter={() => {updateState({showJsonBtnHover: true})}}
          onMouseLeave={() => {updateState({showJsonBtnHover: false})}}
          // style={{ textTransform: 'none', margin: theme.spacing(2, 2) }}
        >
          {state.showJsonSchema ? '🥷 Hide' : '🔦 Show'} JSON Schema
        </button>
      </p>

      {/* Show JSON Schema */}
      { state.showJsonSchema &&
        <pre style={{whiteSpace: 'pre-wrap', background: '#22272e', border: '0.2em solid #80cbc4'}}>
          <code className="language-json" style={{background: '#22272e', color: '#b0bec5'}}>
            {JSON.stringify(state.jsonschema, null, 2)}
          </code>
        </pre>
      }

      {/* TODO: Check peer dependencies, etc
      Try React 17: https://github.com/rjsf-team/react-jsonschema-form/issues/2857 */}

      {/* More modern, react and mui based JSON schema form: https://github.com/rjsf-team/react-jsonschema-form/tree/master/packages/material-ui */}
      {/* But weird imports v4/v5 for mui not working properly */}

      <div style={{marginBottom: '16px'}}>
        <Form
          id='jsonld-form'
          schema={state.jsonschema}
          liveValidate
          validator={validator}
          onChange={(event: any) => {
            console.log("changed", event)
            // updateState({
            //   jsonld: data.formData
            // })
          }}
          onSubmit={(event: any) => {
            // event.
            console.log("submitted", event)
            updateState({
              jsonld: event.formData,
              showJsonld: true,
              jsonValid: true,
            })
          }}
          onError={(event: any) => {
            console.log("errors", event)
            // updateState({
            //   jsonErrors: event.errors,
            //   jsonValid: false,
            // })
          }}
        />
      </div>

      {/* https://github.com/eclipsesource/jsonforms-react-seed/blob/master/src/App.tsx */}
      {/* <JsonForms
        schema={state.jsonschema}
        // uischema={uischema}
        data={{}}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data, errors }) => {
          // console.log(errors)
          // updateState({
          //   jsonld: data,
          //   jsonErrors: errors,
          //   // showJsonld: true,
          //   // jsonValid: true,
          // })
        }}
      /> */}


      {/* Show JSON-LD generated */}
      { state.showJsonld && state.jsonValid &&
        <pre style={{whiteSpace: 'pre-wrap', background: '#22272e', border: '0.2em solid #66bb6a'}}>
          <code className="language-json" style={{background: '#22272e', color: '#b0bec5'}}>
            <>
              {JSON.stringify({
                "@graph": [ {...state.jsonld} ],
                '@context': state.prefixes
              }, null, 2)}
            </>
          </code>
        </pre>
      }


      {/* Show error JSON not useful with rjsf */}
      {/* { state.showJsonld && !state.jsonValid &&
        <pre style={{width: '100%', whiteSpace: 'pre-wrap', background: '#7f0000'}}>
          <code className="language-json" style={{background: '#7f0000'}}>
            {JSON.stringify(state.jsonErrors, null, 2)}
          </code>
        </pre>
      } */}

    </div>
  )
}
