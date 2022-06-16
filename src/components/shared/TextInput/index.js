import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { color } from '../../../assets/styles/_color';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: props => props.width || '25ch',
      "& input": {
        color: color.white,
        fontSize: '1.145vw'
      },
      "&:hover": {
        "& .MuiInput-underline:before": {
          borderBottom: `2px solid ${color.secondaryLight}`
        },
      }
    },
    "& .MuiFormLabel-root": {
      color: color.white,
      fontSize: '1.15vw'
    },
    '& .MuiFormLabel-root.Mui-focused': {
        color: color.white,
        fontWeight: '800'
    },
    "& MuiInputBase-input": {
      color: color.white
    },
    "& .MuiInput-underline:before": {
      borderBottom: `1px solid ${color.secondaryLight}`
    },
    '& .MuiInput-underline:after': {
        borderBottom: `2px solid ${color.secondaryLight}`
    },
    "&.MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottom: `1px solid ${color.white}`
  }
  },
}));

export default function TextInput({label, width, value, onChange, onKeyPress}) {
    const props = {width: width};
  const classes = useStyles(props);

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <TextField
          id={label}
          label={label}
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
        />
      </div>
    </form>
  );
}
