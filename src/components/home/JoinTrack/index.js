import { Avatar, Box, makeStyles } from "@material-ui/core";
import React, { useRef, useLayoutEffect, useState } from "react";
import { useDocumentSize } from "../../../hooks/useDocumentSize";
import Video from "../../shared/Video";


const JoinTrack = ({ tracks, name }) => {
  const videoTrack = tracks.find((track) => track && track.isVideoTrack());
  const {documentHeight, documentWidth} = useDocumentSize();

  const useStyles = makeStyles((theme) => ({
    localStream: {
      margin: "0px",
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      background: "black",
      "& .widthAuto  video" :  {
        width: "auto!important"
      },
      "& .heightAuto  video": {
        height: "auto!important"
      }
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
    }
  }));

  const classes = useStyles();

  let height;
  let width ;

  const streamWidth = documentHeight * 16/9;

  const extraStreamWidth = streamWidth - documentWidth;

  console.log("documentWidth", documentWidth, documentHeight);
  if (documentWidth*9/16 <  documentHeight ) {
     width = "auto"
  }  else {
     height =  "auto";
  }
  console.log("localtrack", extraStreamWidth/2);

  return (
    <div
      className={classes.localStream}
    >
      {videoTrack?.isMuted() ? (
        <Box className={classes.avatarBox} 
        style={{ width: documentWidth, height: documentHeight }}>
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
        <div style={{ width: documentWidth, height: documentHeight, overflow: "hidden", position: "relative"}} className={ documentWidth*9/16 <  documentHeight ? "widthAuto": "heightAuto"} >
          <Video left= {`-${extraStreamWidth/2}px`}  track={videoTrack}/>
        </div>
      )}
    </div>
  );
};

export default JoinTrack;