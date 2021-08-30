import React, {useEffect, useRef} from 'react';
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(() => ({
    video: {
        transform: "scaleX(-1)!important",
    }
}))

const Video = props => {
    const classes = useStyles();
    const {track, isTransform} = props;
    const videoElementRef = useRef(null);
    useEffect(() => {
        track?.attach(videoElementRef.current);
    }, [track]);

    if (!track) {
        return null;
    }

    return (<video playsInline="1" autoPlay='1' className={!isTransform && classes.video} ref={videoElementRef}
                               style={{width: '100%', height: '100%', objectFit: 'cover'}}/>);
}

export default Video;
