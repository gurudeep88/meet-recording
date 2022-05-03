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

  let height;
  let width ;

  let diff = 0 ;
  if (height * 16 / 9  < width )  {
      diff = width - height*16/9;
  }
  const finalHeight  = height + diff*9/16;
  
  

  if (documentWidth*9/16 <  documentHeight ) {
    width = "auto"
    height = "100%"
  }  else {
    width = "100%";
    height =  "auto";
  }

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
        <div style={{ width: documentWidth, height: documentHeight, overflow: "hidden" }} >
          <Video track={videoTrack}/>
        </div>
      )}
    </div>
  );
};

export default JoinTrack;