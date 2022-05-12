import React from 'react';
import {makeStyles} from "@material-ui/core";
const AUDIO_LEVEL_DOTS = 5;
const CENTER_DOT_INDEX = Math.floor(AUDIO_LEVEL_DOTS / 2);

const useStyles = makeStyles((theme) => ({
    root: {
        lineHeight: "1.4px",
        display: "inline-block",
        width: "40px",
        height: '25px',
        borderRadius: '25px',
        zIndex: 2,
        border: "none",
        background: '#44a5ff',
        marginLeft: '10px',
        "& .audiodot-top, .audiodot-bottom, .audiodot-middle ": {
            opacity: 0,
            display: "inline-block",
            width: "5px",
            lineHeight: "1px",
            height: "5px",
            background:  "#fff",
            borderRadius: "50%",
            margin: "1px 1px 1px 1px",
            transition: "opacity .25s ease-in-out",
            "-moz-transition": "opacity .25s ease-in-out"
        },
        "& span.audiodot-top::after, span.audiodot-bottom::after, span.audiodot-middle::after": {
            content: "",
            display: "inline-block",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            "-webkit-filter": "blur(.5px)",
            filter: "blur(.5px)",
            background: "#fff"
        }
    },
    audioindicator: {
        marginTop: '9px'
    }
}));

const MicIndicator = ({passedAudioLevel}) => {
    console.log('newaud', passedAudioLevel)
    const classes  = useStyles();
    const audioLevel = typeof passedAudioLevel === 'number' && !isNaN(passedAudioLevel)
        ? Math.min(passedAudioLevel * 1.2, 1) : 0; //0.6
    const stretchedAudioLevel = AUDIO_LEVEL_DOTS * audioLevel; //3
    const audioLevelDots = [];
    for (let i = 0; i < AUDIO_LEVEL_DOTS; i++) {
        const distanceFromCenter = CENTER_DOT_INDEX - i; //2 //1 //0 //-1 //-2, 
        const audioLevelFromCenter
            = stretchedAudioLevel - Math.abs(distanceFromCenter); //1 //2 //3 //2 //1
        const cappedOpacity = Math.min(
            1, Math.max(0, audioLevelFromCenter)); //1 //
        let className;

        if (distanceFromCenter === 0) {
            className = 'audiodot-middle';
        } else if (distanceFromCenter < 0) {
            className = 'audiodot-top';
        } else {
            className = 'audiodot-bottom';
        }

        audioLevelDots.push(
            <span
                className={className}
                key={i}
                style={{opacity: cappedOpacity}}/>
        );
    }

    return (
        <div className={classes.root}>
            <div className={classes.audioindicator}>
                {audioLevelDots} 
            </div>
        </div>
    );
}

export default MicIndicator;
