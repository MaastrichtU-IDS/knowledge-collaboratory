import React from 'react';
import {
  IconButton,
  Typography,
  Button,
  FormControl,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Snackbar,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText
} from '@mui/material';
// QuestionAnswer
import MuiAlert from '@mui/material/Alert';

import {FormSettings} from '../StyledComponents';
import Icon from '../Icon';

export default function ShapeUploader({renderObject, shapeTarget, onChange}: any) {
  const [state, setState] = React.useState({
    show_info_card: false,
    json_error_open: false,
    json_loaded_open: false,
    shapeFile: renderObject,
    shapeTarget: shapeTarget
    // shapeFile: JSON.stringify(renderObject, null, 4)
  });
  const stateRef = React.useRef(state);
  // Avoid conflict when async calls
  const updateState = React.useCallback(
    (update: any) => {
      stateRef.current = {...stateRef.current, ...update};
      setState(stateRef.current);
    },
    [setState]
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Call onChange function given by parent
      onChange(state.shapeFile, state.shapeTarget);
      updateState({...state, json_loaded_open: true});
    } catch (e) {
      console.log('Invalid shape');
      updateState({...state, json_error_open: true});
    }
  };

  // Close Snackbar
  const closeJsonError = () => {
    updateState({...state, json_error_open: false});
  };
  const closeJsonLoaded = () => {
    updateState({...state, json_loaded_open: false});
  };

  return (
    <Card style={{margin: '32px 0px'}}>
      <CardHeader
        style={{textAlign: 'center'}}
        action={
          <IconButton
            style={{fontSize: '16px'}}
            onClick={() => {
              updateState({show_info_card: !state.show_info_card});
            }}
            name="show_info_card"
            aria-expanded={state.show_info_card}
            aria-label="show about"
          >
            Import&nbsp;
            {!state.show_info_card && <Icon name="expand_more" />}
            {state.show_info_card && <Icon name="expand_less" />}
          </IconButton>
        }
        title="Import your shape"
        subheader={'Paste your SHACL shape file content in the box, and submit it to generate a form for this shape.'}
      />

      <Collapse in={state.show_info_card} timeout="auto" unmountOnExit>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormSettings>
              <TextField
                id="uploadJsonldInput"
                label="Shape to upload"
                placeholder="Shape to upload"
                value={state.shapeFile}
                required
                multiline
                style={{width: '100%'}}
                variant="outlined"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  updateState({shapeFile: event.target.value});
                }}
                size="small"
                InputProps={{
                  className: 'input'
                }}
                InputLabelProps={{required: false}}
              />

              <TextField
                id="inputShapeTarget"
                label="Shape target"
                placeholder="Shape target"
                value={state.shapeTarget}
                required
                multiline
                style={{width: '100%'}}
                variant="outlined"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  updateState({shapeTarget: event.target.value});
                }}
                size="small"
                InputProps={{
                  className: 'input'
                }}
                InputLabelProps={{required: false}}
              />

              <div style={{width: '100%', textAlign: 'center'}}>
                <Button
                  type="submit"
                  variant="contained"
                  className="button"
                  startIcon={<Icon name="cloud_upload" />}
                  style={{textTransform: 'none'}}
                  color="primary"
                >
                  Use this shape
                </Button>
              </div>
              <Snackbar open={state.json_error_open} onClose={closeJsonError} autoHideDuration={10000}>
                <MuiAlert elevation={6} variant="filled" severity="error">
                  The shape provided is not valid ❌️
                </MuiAlert>
              </Snackbar>
              <Snackbar open={state.json_loaded_open} onClose={closeJsonLoaded} autoHideDuration={10000}>
                <MuiAlert elevation={6} variant="filled" severity="info">
                  The shape has been loaded.
                </MuiAlert>
              </Snackbar>
            </FormSettings>
          </form>
        </CardContent>
      </Collapse>
    </Card>
  );
}
