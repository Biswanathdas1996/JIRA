import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const filterData = (tickets) => {
  let temp = [];
  if (tickets) {
    tickets?.map(async (data) => {
      temp.push({
        index: data?.index,
        id: data?.id,
      });
    });
  }
  return temp;
};

function CheckboxesTags({ tickets, onchangeEpicStoryHandler, defaultValue }) {
  const dataOption = filterData(tickets);
  const [values, setvalues] = useState(defaultValue ? defaultValue : []);

  const onchangeHandler = (newValue) => {
    onchangeEpicStoryHandler(newValue);
    setvalues(newValue);
  };

  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      value={values}
      options={dataOption}
      onChange={(event, newValue) => {
        onchangeHandler(newValue);
      }}
      disableCloseOnSelect
      getOptionLabel={(option) => option.id}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.id}
        </li>
      )}
      style={{ width: 500 }}
      renderInput={(params) => (
        <TextField {...params} label="Checkboxes" placeholder="Favorites" />
      )}
    />
  );
}

export default CheckboxesTags;
