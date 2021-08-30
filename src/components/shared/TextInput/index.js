import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { color } from '../../../assets/styles/_color';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: props => props.width || '25ch',
    },
    '& .MuiFormLabel-root.Mui-focused': {
        color: color.secondary,
        fontWeight: '600'
    },
    '& .MuiInput-underline:after': {
        borderBottom: `2px solid ${color.secondaryDark}`
    }
  },
}));

export default function TextInput({label, width, value, onChange}) {
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
        />
      </div>
    </form>
  );
}
