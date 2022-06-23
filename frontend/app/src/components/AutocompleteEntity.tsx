import React from "react";
// import { useTheme } from "@mui/material/styles";
import { makeStyles, withStyles } from "@mui/styles";
import {
  Autocomplete,
  TextField,
} from "@mui/material";


const getAutocompleteLabel = (option: any, displayProp: string = "") => {
  // console.log('getAutocompleteLabel', option)
  if (displayProp) {
    return option[displayProp]
  }
  if (option.id_label && option.id_curie) {
    return option.id_label + " (" + option.id_curie + ")"
  }
  if (option.text && option.id_curie) {
    return option.text + " (" + option.id_curie + ")"
  }
  if (option.label && option.curie) {
    return option.label + " (" + option.curie + ")"
  }
  if (option.label && option.id) {
    return option.label + " (" + option.id + ")"
  }
  if (option.id_uri) return option.id_uri
  if (option.text) return option.text
  if (option.label) return option.label
  if (option.id) return option.id
  if (typeof option === "string") {
    return option
  } else {
    return ""
  }
};


const AutocompleteEntity = ({
  label,
  value,
  onChange,
  id,
  options,
  entity,
  getOptionLabel=(option: any) => getAutocompleteLabel(option),
  groupBy=(option: any) => (option.type ? option.type : null),
  ...args
}: any) => {

  // const theme = useTheme();
  const useStyles = makeStyles(() => ({
    input: {
      background: "white",
      fontSize: "11px",
      fontFamily: "monospace",
    },
  }));
  const classes = useStyles();

  return (
    <Autocomplete
      key={id}
      id={id}
      freeSolo
      value={value}
      options={options}
      onChange={onChange}
      onInputChange={onChange} 
      // Automatically update the state value, but cause issue with default values 
      // (using label as value instead of the fulle object)
      getOptionLabel={getOptionLabel}
      groupBy={groupBy}
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
      {...args}
    />
  );
}
export default AutocompleteEntity;