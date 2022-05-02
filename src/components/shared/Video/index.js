import React, {useEffect, useRef} from 'react';
import {makeStyles} from "@material-ui/core";
import { color } from '../../../assets/styles/_color';

const useStyles = makeStyles(() => ({
    video: {
        transform: "scaleX(-1)!important",
    }
}))

const Video = props => {
    const classes = useStyles();
    const {track, isPresenter, borderRadius, width, height} = props;
    const videoElementRef = useRef(null);
    useEffect(() => {
        track?.attach(videoElementRef.current);
    }, [track]);

    if (!track) {
        return null;
    }

    return (<video playsInline="1" 
                   autoPlay='1' 
                   className={ !isPresenter && classes.video } 
                   ref={videoElementRef}
                   style={{width: width ? width : "100%", height: height ? height : "100%", objectFit: 'contain', borderRadius: ( !borderRadius ? 0 : '5px' ), backgroundColor: color.secondaryDark}}/>);
}

export default Video;
