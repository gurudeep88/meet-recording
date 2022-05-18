import React from 'react';
import {makeStyles} from "@material-ui/core";
import classNames from 'classnames';
import { color } from '../../../assets/styles/_color';
const AUDIO_LEVEL_DOTS = 5;
const CENTER_DOT_INDEX = Math.floor(AUDIO_LEVEL_DOTS / 2);

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        marginLeft: "10px"
    },
    activeBg: {
        height: "8px",
        width: "8px",
        borderRadius: "8px",
        backgroundColor: color.primaryDark,
        display: "inline-block"
    },
    passiveBg: { 
        height: "8x",
        width: "8px",
        borderRadius: "8px",
        backgroundColor: "#fff",
        display: "inline-block"
    }
}));

const MicIndicator = ({vol}) => {
    const classes  =  useStyles();
    const allPids = ["#718EFF", "#6a86f5", "#7d73ff", "#7268fa", "#685cf9", "#7b05f8","#2010f9"];
    const numberOfPidsToColor = Math.round(vol / 10);
    console.log("allPids", allPids, numberOfPidsToColor);

    return (
        <div className={classes.root}>
            {  allPids.map((item, index)=>{
                if ( index < numberOfPidsToColor  ) {
                    return  <div style={{backgroundColor: item}} className={classes.activeBg}></div>;
                } else {
                    return  <div style={{backgroundColor: "#272931"}} className={classes.activeBg}></div>;;
                }
            })} 
        </div>
    );
}

export default MicIndicator;
