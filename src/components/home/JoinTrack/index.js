import { Avatar, Box, makeStyles } from "@material-ui/core";
import React, { useRef, useLayoutEffect, useState } from "react";
import Video from "../../shared/Video";


const JoinTrack = ({ tracks, name }) => {

  const videoTrack = tracks.find((track) => track && track.isVideoTrack());
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    function updateSize() {
      const width = document.documentElement.clientWidth * (100 / 100);
      const height =
        document.documentElement.clientWidth * (100 / 100) * (9 / 16);
      setDimensions({ width, height });
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const useStyles = makeStyles((theme) => ({
    localStream: {
      borderRadius: "8px",
      margin: "0px",
      overflow: "hidden",
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      background: "black",
    },
    avatarBox: {
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
        borderRadius: '5px',
    },
    avatar: {
      borderRadius: "50%",
      position: "absolute",
      left: "calc(70%/1.2)",
      top: `calc(50vh - 96px)`,
      transition: "box-shadow 0.3s ease",
      height: '200px',
      width: '200px',
      "& span": {
          fontSize: '150px'
      }
    },
  }));
  const classes = useStyles();

  return (
    <div
      className={classes.localStream}
    >
      {videoTrack?.isMuted() ? (
        <Box className={classes.avatarBox} 
        style={{ width: dimensions.width, height: dimensions.height }}>
          <Avatar className={classes.avatar} style={{fontSize: name && '125px' , fontWeight: name && '100'}}>
            {!name ? (
              <span class="material-icons material-icons-outlined">
                person_outline
              </span>
            ) : (
              name?.slice(0, 1).toUpperCase()
            )}
          </Avatar>
        </Box>
      ) : (
        <div
          style={{ width: dimensions.width, height: dimensions.height }}
        >
          <Video track={videoTrack} />
        </div>
      )}
    </div>
  );
};

export default JoinTrack;

// import {makeStyles} from '@material-ui/core'
// import React, {useRef, useLayoutEffect, useState} from 'react'
// import Video from '../../shared/Video';

// const useStyles = makeStyles(() => ({
//     localStream: {
//         borderRadius: "8px",
//         margin: "16px 16px 16px 16px",
//         overflow: "hidden",
//         position: "relative",
//         background: "black"
//     }
// }))

// const JoinTrack = ({tracks}) => {

//     const videoTrack = tracks.find(track => track && track.isVideoTrack());
//     const classes = useStyles();
//     const [dimensions, setDimensions] = useState({width: 0 , height: 0 });

//     useLayoutEffect(() => {
//             function updateSize() {
//                 const width  = (document.documentElement.clientWidth/2)*(70/100);
//                 const height  = width*9/16;
//                 setDimensions({width, height});
//             }
//             window.addEventListener('resize', updateSize);
//             updateSize();
//             return () => window.removeEventListener('resize', updateSize);
//     }, []);

//     return (
//         <div style={{width: dimensions.width, height: dimensions.height}} className={classes.localStream}>
//             { !videoTrack?.isMuted() && <Video track={videoTrack}/> }
//         </div>
//     )
// }

// export default JoinTrack
