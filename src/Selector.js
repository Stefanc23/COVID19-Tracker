import React, { useState, useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";

function Selector({ data, value, label, ...props }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(data);
  }, [data]);

  return (
    <Autocomplete
      id="selector-combo-box"
      options={options}
      getOptionLabel={option => option.name}
      value={value}
      style={{ width: 300 }}
      onChange={(event, newValue) => {
        newValue !== null && props.onChange(newValue.name);
      }}
      renderInput={params => (
        <TextField {...params} label={value} variant="outlined" />
      )}
    />
  );
}

export default Selector;
