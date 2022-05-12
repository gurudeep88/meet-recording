import { Avatar, Box, makeStyles } from "@material-ui/core";
import React, { useRef, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { color } from "../../../assets/styles/_color";
import { useDocumentSize } from "../../../hooks/useDocumentSize";
import VideoBox from "../../shared/VideoBox";

const JoinTrack = ({ tracks, name }) => {
  const videoTrack = tracks.find((track) => track && track.isVideoTrack());
  const {documentHeight, documentWidth} = useDocumentSize();
  const bgColor = useSelector(state=>state.profile?.color);

  const useStyles = makeStyles((theme) => ({
    localStream: {
      margin: "0px",
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      background: color.secondaryDark,
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
    },
    videoWrapper: {
       "& > div": { 
           borderRadius: 0
       },
       "& .rightControls": {
          display: "none"
       },
       "& .userDetails": {
          display: "none"
       },
       "& .audioBox": {
          display: "none"
       }
    }
  }));

  const classes = useStyles();

  return (
    <div
      className={classes.localStream}
    >
      {videoTrack?.isMuted() ? (
        <Box className={classes.avatarBox} 
        style={{ width: documentWidth, height: documentHeight }}>
          <Avatar className={classes.avatar} style={{fontSize: name && '125px' , fontWeight: name && '100', backgroundColor:bgColor}}>
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
        <div  className={classes.videoWrapper} style={{ width: documentWidth, height: documentHeight, overflow: "hidden", position: "relative"}} >
          <VideoBox width={documentWidth} height={documentHeight} participantTracks={tracks} />
        </div>
      )}
    </div>
  );
};

export default JoinTrack;