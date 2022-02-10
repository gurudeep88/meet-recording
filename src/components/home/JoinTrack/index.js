import {makeStyles} from '@material-ui/core'
import React, {useRef, useLayoutEffect, useState} from 'react'
import Video from '../../shared/Video';

const useStyles = makeStyles(() => ({
    localStream: {
        borderRadius: "8px",
        margin: "16px 16px 16px 16px",
        overflow: "hidden",
        position: "relative",
        background: "black"
    }
}))

const JoinTrack = ({tracks}) => {
    
    const videoTrack = tracks.find(track => track && track.isVideoTrack());
    const classes = useStyles();
    const [dimensions, setDimensions] = useState({width: 0 , height: 0 });

    useLayoutEffect(() => {
            function updateSize() {
                const width  = (document.documentElement.clientWidth/2)*(70/100);
                const height  = width*9/16;
                setDimensions({width, height});
            }
            window.addEventListener('resize', updateSize);
            updateSize();
            return () => window.removeEventListener('resize', updateSize);
    }, []);

    return (
        <div style={{width: dimensions.width, height: dimensions.height}} className={classes.localStream}>
            { !videoTrack?.isMuted() && <Video track={videoTrack}/> }
        </div>
    )
}

export default JoinTrack
