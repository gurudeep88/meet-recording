import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
        background: "black",
        opacity: ".6",
        color: "white",
        fontSize: "25px"
    }
}));

export default function SubTitle({subtitle}) {
  const classes = useStyles();  
  const text =  `${subtitle.name}: ${subtitle.text}`;

  return (
    <Box  className={classes.root}>
        {text}
    </Box>
  );
}
