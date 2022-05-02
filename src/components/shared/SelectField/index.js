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
    margin: theme.spacing(1, 0),
    minWidth: 320,
    "& .MuiFormLabel-root": {
      color: color.white
    },
    "& .MuiFormLabel-root.Mui-focused": {
        color: color.white
    },
    "& .MuiInput-underline:before": {
      borderBottom: `1px solid ${color.secondaryLight}`
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottom: `1px solid ${color.white}`
    },
    "& .MuiInput-underline:after": {
        borderBottom: `2px solid ${color.secondaryLight}`
    },
    "& .MuiInputBase-input": {
        fontSize: '0.8rem',
        color: color.white,
        fontWeight: '900'
    },
    "& svg": {
      color: color.secondaryLight
    }
    },
    select: {
      background: color.secondaryDark,
      "& li": {
        color: color.white,
        "&:hover": {
          background: color.secondary
        }
      }
    }
}));

export default function SelectField({data, minWidth}) {
  const classes = useStyles();

  return (
    <Box className={classes.button}>
      <FormControl className={classes.formControl} style={minWidth && {minWidth}}>
        <InputLabel id="demo-controlled-open-select-label">{data.label}</InputLabel>
        <Select
          labelId={data.label}
          id={data.label}
          open={data.open}
          onClose={data.handleClose}
          onOpen={data.handleOpen}
          value={data.value}
          onChange={data.handleChange}
          MenuProps={{
            classes: {
              paper: classes.select
             }
            }
          }
        >
            {data.list?.map((item, index)=>(
                <MenuItem value={item.value} key={index}>{item.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
