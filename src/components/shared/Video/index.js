import React, {useEffect, useRef} from 'react';
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(() => ({
    video: {
        transform: "scaleX(-1)!important",
    }
}))

const Video = props => {
    const classes = useStyles();
    const {track, isPresenter} = props;
    const videoElementRef = useRef(null);
    useEffect(() => {
        if (!track || !videoElementRef.current) {
            return;
        }
        track.attach(videoElementRef.current);
        return ()=>{
            track.detach(videoElementRef.current);
        }
    }, [track]);

    return (<video playsInline="1" autoPlay='1' className={ !isPresenter && classes.video } ref={videoElementRef}
                               style={{width: '100%', height: '100%', objectFit: 'contain'}}/>);
}

export default Video;
