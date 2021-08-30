import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { color } from "../../../assets/styles/_color";
import { InputAdornment } from "@material-ui/core";

const CssTextField = withStyles({
  root: {
    "& label": {
      color: color.white,
    },
    "& label.Mui-focused": {
      color: color.primary,
    },
    "& .MuiInput-underline:before": {
      borderBottom: `1px solid ${color.white}`
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: color.primary,
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "red",
      },
      "&:hover fieldset": {
        borderColor: "yellow",
      },
      "&.Mui-focused fieldset": {
        borderColor: "green",
      },
      "& .MuiInputBase-input:focus": {
        color: color.primary
      },
      "&.MuiInput-underline:hover:not(.Mui-disabled):before": {
        borderBottom: `1px solid ${color.primary} !important`
    }
    },
  },
})(TextField);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
    "&:hover": {
      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
        borderBottom: `2px solid ${color.primary} !important`
    },
    },
    "& .MuiInputAdornment-root": {
      color: color.white
    },
    "& .MuiInputBase-input": {
      color: color.white
    }
  },
}));

export default function CustomizedInputs({label, icon}) {
  const classes = useStyles();

  return (
      <CssTextField
        className={classes.margin}
        id={label}
        label={label}
        InputProps={{
          startAdornment: <InputAdornment position="start">{icon}</InputAdornment>
        }}
      />
  );
}
