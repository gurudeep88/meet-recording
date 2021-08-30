import React from 'react';
import {makeStyles} from "@material-ui/core";
const AUDIO_LEVEL_DOTS = 5;
const CENTER_DOT_INDEX = Math.floor(AUDIO_LEVEL_DOTS / 2);

const useStyles = makeStyles((theme) => ({
    root: {
        position: "absolute",
        lineHeight: "1.4px",
        display: "inline-block",
        left: "6px",
        top: "50%",
        marginTop: "-17px",
        width: "6px",
        height: "35px",
        zIndex: 2,
        border: "none",
        "& .audiodot-top, .audiodot-bottom, .audiodot-middle ": {
            opacity: 0,
            display: "inline-block",
            width: "5px",
            lineHeight: "1px",
            height: "5px",
            borderRadius: "50%",
            background:  "#44a5ff",
            margin: "1px 0 1px 0",
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
            background: "#44a5ff"
        }
    }
}));

const AudioLevelIndicator = ({passedAudioLevel}) => {
    const classes  = useStyles();
    const audioLevel = typeof passedAudioLevel === 'number' && !isNaN(passedAudioLevel)
        ? Math.min(passedAudioLevel * 1.2, 1) : 0;
    const stretchedAudioLevel = AUDIO_LEVEL_DOTS * audioLevel;
    const audioLevelDots = [];
    for (let i = 0; i < AUDIO_LEVEL_DOTS; i++) {
        const distanceFromCenter = CENTER_DOT_INDEX - i;
        const audioLevelFromCenter
            = stretchedAudioLevel - Math.abs(distanceFromCenter);
        const cappedOpacity = Math.min(
            1, Math.max(0, audioLevelFromCenter));
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
            <div className="audioindicator in-react">
                {audioLevelDots}
            </div>
        </div>
    );
}

export default AudioLevelIndicator;
