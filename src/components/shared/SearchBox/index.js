import { alpha, InputBase, makeStyles } from "@material-ui/core";
import React from "react";
import SearchIcon from "@material-ui/icons/Search";
import { color } from "../../../assets/styles/_color";

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    borderRadius: '15px',
    border: `1px solid ${color.search}`,
    backgroundColor: color.secondary,
    transition: '0.15s all ease',
    "&:hover": {
      backgroundColor: 'transparent',
      border: `1px solid ${color.searchFocus}`,
      color: color.searchFocus
    },
    marginLeft: 0,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "auto",
    },
  },
  inputRoot: {
    color: color.white,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(0.7em)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    height: '32px',
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const SearchBox = ({placeholder, value, id, name, handleChange}) => {
  const classes = useStyles();

  return (
    <div style={{height: '52px'}}>
    <div className={classes.search}>
      <InputBase
        placeholder={placeholder}
        id={id}
        type='text'
        name={name}
        value={value}
        onChange={handleChange}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ "aria-label": "search" }}
      />
    </div>
    </div>
  );
};

export default SearchBox;
