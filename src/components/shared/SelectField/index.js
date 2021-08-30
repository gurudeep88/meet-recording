import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { color } from '../../../assets/styles/_color';
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 320,
    "& .MuiFormLabel-root.Mui-focused": {
        color: color.primary
    },
    "& .MuiInput-underline:after": {
        borderBottom: `2px solid ${color.secondary}`
    },
    "& .MuiInputBase-input": {
        fontSize: '0.8rem',
        color: color.secondary,
        fontWeight: '900'
    },
    },
}));

export default function SelectField({data}) {
  const classes = useStyles();

  return (
    <Box className={classes.button}>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-controlled-open-select-label">{data.label}</InputLabel>
        <Select
          labelId={data.label}
          id={data.label}
          open={data.open}
          onClose={data.handleClose}
          onOpen={data.handleOpen}
          value={data.value}
          onChange={data.handleChange}
        >
            {data.list?.map((item, index)=>(
                <MenuItem value={item.value} key={index}>{item.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
