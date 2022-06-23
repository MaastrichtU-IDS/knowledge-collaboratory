import React from "react";
import { useTheme } from "@mui/material/styles";
import { makeStyles, withStyles } from "@mui/styles";
import {
  Autocomplete,
  IconButton,
  Typography,
  Button,
  FormControl,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Snackbar,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/CloudUpload";
import EditParamIcon from "@mui/icons-material/Link";
import LockFormParamIcon from "@mui/icons-material/Lock";
import WizardQuestionsIcon from "@mui/icons-material/LiveHelp";
// QuestionAnswer
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

export default function AutocompleteEntity({
  label,
  value,
  onChange,
  id,
  options,
  entity,
}: any) {
  const theme = useTheme();

  const useStyles = makeStyles(() => ({
    link: {
      textDecoration: "none",
      color: theme.palette.primary.main,
      "&:hover": {
        color: theme.palette.secondary.main,
        textDecoration: "none",
      },
    },
    input: {
      background: "white",
      fontSize: "11px",
      fontFamily: "monospace",
    },
    settingsForm: {
      width: "100%",
      // textAlign: 'center',
      "& .MuiFormControl-root": {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
      "& .MuiFormHelperText-root": {
        marginTop: theme.spacing(0),
        marginBottom: theme.spacing(1),
      },
    },
    saveButton: {
      textTransform: "none",
      margin: theme.spacing(2, 2),
    },
    fullWidth: {
      width: "100%",
    },
  }));
  const classes = useStyles();

  // const [state, setState] = React.useState({
  //   show_info_card: false,
  //   json_error_open: false,
  //   json_loaded_open: false,
  //   // upload_jsonld: JSON.stringify(renderObject, null, 4)
  // });
  // const stateRef = React.useRef(state);
  // // Avoid conflict when async calls
  // const updateState = React.useCallback(
  //   (update) => {
  //     stateRef.current = { ...stateRef.current, ...update };
  //     setState(stateRef.current);
  //   },
  //   [setState]
  // );

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   updateState({ upload_jsonld: event.target.value})
  // }

  const getAutocompleteLabel = (option: any, displayProp: string = "") => {
    // console.log('getAutocompleteLabel', option)
    if (displayProp) {
      return option[displayProp];
    }
    if (option.id_label && option.id_curie) {
      return option.id_label + " (" + option.id_curie + ")";
    }
    if (option.text && option.id_curie) {
      return option.text + " (" + option.id_curie + ")";
    }
    if (option.label && option.curie) {
      return option.label + " (" + option.curie + ")";
    }
    if (option.id_uri) {
      return option.id_uri;
    }
    if (option.text) {
      return option.text;
    }
    if (option.label) {
      return option.label;
    }
    if (option.id) {
      return option.id;
    }
    if (typeof option === "string") {
      return option;
    } else {
      return "";
    }
  };

  return (
    <Autocomplete
      key={id}
      id={id}
      freeSolo
      value={value}
      options={options}
      // onChange={(event: any, newInputValue: any) => onChange(event, newInputValue, {'type': 'entityProp', 'editObj': state.tagSelected, index: pindex, prop: 'o'})}
      onChange={onChange}
      onInputChange={onChange}
      getOptionLabel={(option: any) => getAutocompleteLabel(option)}
      groupBy={(option) => (option.type ? option.type : null)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          size="small"
          className={classes.input}
          label={label}
          placeholder={label}
        />
      )}
    />
  );
}
