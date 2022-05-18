import {
  Badge,
  Box,
  Drawer,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import SariskaMediaTransport from "sariska-media-transport";
import { color } from "../../../assets/styles/_color";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import {
  addLocalTrack,
  localTrackMutedChanged,
  removeLocalTrack,
} from "../../../store/actions/track";
import {
  ENTER_FULL_SCREEN_MODE,
  EXIT_FULL_SCREEN_MODE,
  GRID,
  PRESENTATION,
  SHARED_DOCUMENT,
  SPEAKER,
  RECORDING_ERROR_CONSTANTS,
  WHITEBOARD,
  GET_PRESENTATION_STATUS,
  RECEIVED_PRESENTATION_STATUS
} from "../../../constants";
import { setFullScreen, setLayout, setPresenter, setPresentationtType } from "../../../store/actions/layout";
import { clearAllReducers } from "../../../store/actions/conference";
import { exitFullscreen, formatAMPM, isFullscreen, requestFullscreen } from "../../../utils";
import classNames from "classnames";
import ParticipantDetails from "../../shared/ParticipantDetails";
import { unreadMessage } from "../../../store/actions/chat";
import { withStyles } from "@material-ui/styles";
import ChatPanel from "../../shared/Chat";
import MoreAction from "../../shared/MoreAction";
import DrawerBox from "../../shared/DrawerBox";
import { addSubtitle } from "../../../store/actions/subtitle";
import { showSnackbar } from "../../../store/actions/snackbar";

const StyledBadge = withStyles((theme) => ({
  badge: {
    background: color.primary,
    top: 6,
    right: 10
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
  root: {
    height: "44px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    bottom: "16px",
    width: "100%",
    position: "fixed",
    color: color.white,
    "& span.material-icons": {
      padding: "8px",
      borderRadius: "8px",
      marginRight: "2px",
      "&:hover": {
        opacity: "0.8",
        cursor: "pointer",
        color: color.primaryLight,
      },
    },
  },
  active: {
    opacity: "0.8",
    cursor: "pointer",
    color: color.red,
  },
  panTool: {
    fontSize: '18px',
    padding: '12px !important',
    marginRight: "12px",
  },
  infoContainer: {
    marginLeft: "20px",
    display: "flex",
    width: "350px",
  },
  separator: {
    marginLeft: "10px",
    marginRight: "10px",
  },
  permissions: {
    display: "flex",
    alignItems: "center",
    padding: "0px 5px",
    backgroundColor: color.secondary,
    borderRadius: "7.5px",
    marginRight: "24px",
  },
  end: {
    background: `${color.red} !important`,
    borderColor: `${color.red} !important`,
    padding: "2px 12px !important",
    textAlign: "center",
    borderRadius: "30px !important",
    width: "42px",
    fontSize: "36px",
    marginRight: 0,
    "&:hover": {
      opacity: "0.8",
      background: `${color.red} !important`,
      cursor: "pointer",
      color: `${color.white} !important`,
    },
  },
  subIcon: {
    border: "none !important",
    marginRight: "0px !important",
    marginLeft: "4px !important",
  },
  more: {
    marginRight: "0px !important",
  },
  drawer: {
    "& .MuiDrawer-paper": {
      overflowX: "hidden",
      top: "16px",
      bottom: '80px',
      right: "16px",
      borderRadius: "10px",
      height: '85%',
      width: '360px',
      backgroundColor: color.secondary,
      overflowY: 'auto'
    },
  },
  list: {
    padding: theme.spacing(3, 3, 0, 3),
    height: '100%'
  },
  title: {
    color: color.white,
    fontWeight: "400",
    marginLeft: '8px',
    fontSize: '28px',
    lineHeight: '1'
  },
  chatList: {
    height: "100%",
    padding: theme.spacing(3, 3, 0, 3),
  },
  chat: {
    marginRight: '0px !important',
    fontSize: '20px',
    padding: '10px !important'
  },
  moreActionList: {
    height: "100%",
    width: '260px',
    padding: theme.spacing(1, 0, 0, 0),
    backgroundColor: color.secondary,
  },
}));

const ActionButtons = ({ dominantSpeakerId }) => {
  const history = useHistory();
  const audioTrack = useSelector((state) => state.localTrack).find(track => track.isAudioTrack());
  const videoTrack = useSelector((state) => state.localTrack).find(track => track.isVideoTrack());
  const classes = useStyles();
  const dispatch = useDispatch();
  const conference = useSelector((state) => state.conference);
  const localTracks = useSelector((state) => state.localTrack);
  const [presenting, setPresenting] = useState(false);
  const [time, setTime] = useState(formatAMPM(new Date()));
  const profile = useSelector((state) => state.profile);
  const layout = useSelector((state) => state.layout);
  const unread = useSelector((state) => state.chat.unreadMessage);
  const [raiseHand, setRaiseHand] = useState(false);
  const [featureStates, setFeatureStates] = useState({});
  const [chatState, setChatState] = React.useState({
    right: false,
  });
  const [participantState, setParticipantState] = React.useState({
    right: false,
  });
  const [moreActionState, setMoreActionState] = React.useState({
    right: false,
  });

  const skipResize = false;

  const action = (actionData) => {
    featureStates[actionData.key] = actionData.value;
    setFeatureStates({ ...featureStates });
  }

  const muteAudio = async () => {
    await audioTrack?.mute();
    dispatch(localTrackMutedChanged());
  };

  const unmuteAudio = async () => {
    await audioTrack?.unmute();
    dispatch(localTrackMutedChanged());
  };

  const muteVideo = async () => {
    await videoTrack?.mute();
    dispatch(localTrackMutedChanged());
  };

  const unmuteVideo = async () => {
    await videoTrack?.unmute();
    dispatch(localTrackMutedChanged());
  };

  const shareScreen = async () => {
    const videoTrack = localTracks.find(
      (track) => track.videoType === "camera"
    );
    const [desktopTrack] = await SariskaMediaTransport.createLocalTracks({
      resolution: 720,
      devices: ["desktop"],
    });

    await conference.replaceTrack(videoTrack, desktopTrack);
    desktopTrack.addEventListener(
      SariskaMediaTransport.events.track.LOCAL_TRACK_STOPPED,
      async () => {
        stopPresenting();
      }
    );
    setPresenting(true);
    conference.setLocalParticipantProperty("presenting", "start");
    dispatch(addLocalTrack(desktopTrack));
    dispatch(setPresenter({ participantId: conference.myUserId(), presenter: true }));
  };

  const stopPresenting = async () => {
    const videoTrack = localTracks.find(
      (track) => track.videoType === "camera"
    );
    const desktopTrack = localTracks.find(
      (track) => track.videoType === "desktop"
    );
    await conference.replaceTrack(desktopTrack, videoTrack);
    dispatch(
      setPresenter({ participantId: conference.myUserId(), presenter: false })
    );
    dispatch(removeLocalTrack(desktopTrack));
    conference.setLocalParticipantProperty("presenting", "stop");
    setPresenting(false);
  };

  const startRaiseHand = () => {
    conference.setLocalParticipantProperty("handraise", "start");
    setRaiseHand(true);
  }; 

  const stopRaiseHand = () => {
    conference.setLocalParticipantProperty("handraise", "stop");
    setRaiseHand(false);
  };

  const toggleParticipantDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setParticipantState({ ...participantState, [anchor]: open });
  };

  const participantList = (anchor) => (
    <>
      <Typography
        variant="h6"
        className={classes.title}
      >
        Participants
      </Typography>
      <ParticipantDetails />
    </>
  );

  const toggleChatDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setChatState({ ...chatState, [anchor]: open });
    dispatch(unreadMessage(0));
  };

  const chatList = (anchor) => (
    <>
      <Typography variant="h6" className={classes.title}>Messages</Typography>
      <ChatPanel />
    </>
  );

  const toggleFullscreen = () => {
    if (isFullscreen()) {
        exitFullscreen();
    } else {
        requestFullscreen();
    }
  };

  const AddFShandler = () => {
    if (isFullscreen()) {
      dispatch(setFullScreen(ENTER_FULL_SCREEN_MODE));
    } else {
      dispatch(setFullScreen(EXIT_FULL_SCREEN_MODE));
    }
  };

  const addFullscreenListeners = () => {
    document.addEventListener("fullscreenchange", AddFShandler);
    document.addEventListener("webkitfullscreenchange", AddFShandler);
    document.addEventListener("mozfullscreenchange", AddFShandler);
    document.addEventListener("MSFullscreenChange", AddFShandler);
  };

  const removeFullscreenListeners = () => {
    document.removeEventListener("fullscreenchange", AddFShandler);
    document.removeEventListener("webkitfullscreenchange", AddFShandler);
    document.removeEventListener("mozfullscreenchange", AddFShandler);
    document.removeEventListener("MSFullscreenChange", AddFShandler);
  };


  const resize = ()=>{
    if (skipResize) {
      return;
    }
    if( window.innerHeight == window.screen.height) {
      dispatch(setFullScreen(ENTER_FULL_SCREEN_MODE));
    } else {
      dispatch(setFullScreen(EXIT_FULL_SCREEN_MODE));
    }
  }

  const toggleView = () => {
    if (layout.type === PRESENTATION || layout.type === SPEAKER) {
      dispatch(setLayout(GRID));
    } else if (featureStates.whiteboard || featureStates.sharedDocument) {
      dispatch(setLayout(PRESENTATION));
    } else {
      dispatch(setLayout(SPEAKER));
    }
  };

  const toggleMoreActionDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setMoreActionState({ ...moreActionState, [anchor]: open });
  };

  const moreActionList = (anchor) => (
    <>
      <MoreAction dominantSpeakerId={dominantSpeakerId} action={action} featureStates={featureStates} setLayoutAndFeature={setLayoutAndFeature} />
    </>
  );

  const setLayoutAndFeature = (layoutType, presentationType, actionData) => {
    dispatch(setLayout(layoutType));
    dispatch(setPresentationtType({ presentationType }));
    action(actionData);
  }

  useEffect(() => {
    let doit;
    // document.documentElement.addEventListener('mouseleave', () => skipResize = false);
    // document.documentElement.addEventListener('mouseenter', () => skipResize = true)

    const interval = setInterval(() => {
      setTime(formatAMPM(new Date()));
    }, 1000);
    document.addEventListener("dblclick",  toggleFullscreen);
    // window.addEventListener("resize", ()=> {
    //   clearTimeout(doit);
    //   doit = setTimeout(resize, 250);
    // });
    addFullscreenListeners();
    return () => {
      document.removeEventListener("dblclick",  toggleFullscreen);
      clearInterval(interval);
      removeFullscreenListeners();
       // window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (conference.getParticipantsWithoutHidden()[0]?._id) {
      setTimeout(() => conference.sendEndpointMessage(conference.getParticipantsWithoutHidden()[0]._id, { action: GET_PRESENTATION_STATUS }), 1000);
    }
    const checkPresentationStatus = (participant, payload) => {
      if (payload?.action === GET_PRESENTATION_STATUS) {
        conference.sendEndpointMessage(participant._id, {
          action: RECEIVED_PRESENTATION_STATUS,
          status: featureStates.whiteboard ? "whiteboard" : (featureStates.sharedDocument ? "sharedDocument" : 'none')
        })
      }

      if (payload?.action === RECEIVED_PRESENTATION_STATUS) {
        if (payload.status === "whiteboard") {
          setLayoutAndFeature(PRESENTATION, WHITEBOARD, { key: "whiteboard", value: true })
          action({ key: "sharedDocument", value: false })
        }

        if (payload.status === "sharedDocument") {
          setLayoutAndFeature(PRESENTATION, SHARED_DOCUMENT, { key: "sharedDocument", value: true })
          action({ key: "whiteboard", value: false });
        }
      }
    }
    conference.addEventListener(SariskaMediaTransport.events.conference.ENDPOINT_MESSAGE_RECEIVED, checkPresentationStatus);
    return () => {
      conference.removeEventListener(SariskaMediaTransport.events.conference.ENDPOINT_MESSAGE_RECEIVED, checkPresentationStatus);
    }
  }, [featureStates.whiteboard, featureStates.sharedDocument]);

  useEffect(() => {
    conference.getParticipantsWithoutHidden().forEach((item) => {
      if (item._properties?.transcribing) {
        action({ key: "caption", value: true })
      }

      if (item._properties?.recording) {
        action({ key: "recording", value: true })
      }

      if (item._properties?.streaming) {
        action({ key: "streaming", value: true })
      }

      if (item._properties?.whiteboard === "start") {
        setLayoutAndFeature(PRESENTATION, WHITEBOARD, { key: "whiteboard", value: true })
      }

      if (item._properties?.sharedDocument === "start") {
        setLayoutAndFeature(PRESENTATION, SHARED_DOCUMENT, { key: "sharedDocument", value: true })
      }
    });

    conference.addEventListener(SariskaMediaTransport.events.conference.PARTICIPANT_PROPERTY_CHANGED, (participant, key, oldValue, newValue) => {
      if (key === "whiteboard" && newValue === "start") {
        setLayoutAndFeature(PRESENTATION, WHITEBOARD, { key: "whiteboard", value: true })
      }

      if (key === "whiteboard" && newValue === "stop") {
        setLayoutAndFeature(SPEAKER, null, { key: "whiteboard", value: false })
      }

      if (key === "sharedDocument" && newValue === "stop") {
        setLayoutAndFeature(SPEAKER, null, { key: "sharedDocument", value: false })
      }

      if (key === "sharedDocument" && newValue === "start") {
        setLayoutAndFeature(PRESENTATION, SHARED_DOCUMENT, { key: "sharedDocument", value: true })
      }
    });

    conference.addEventListener(SariskaMediaTransport.events.conference.TRANSCRIPTION_STATUS_CHANGED, (status) => {
      if (status === "ON") {
        conference.setLocalParticipantProperty("transcribing", true);
        dispatch(showSnackbar({ autoHide: true, message: "Caption started" }));
        action({ key: "caption", value: true });
      }

      if (status === "OFF") {
        conference.removeLocalParticipantProperty("transcribing");
        dispatch(showSnackbar({ autoHide: true, message: "Caption stopped" }));
        dispatch(addSubtitle({}));
        action({ key: "caption", value: false });
      }
    });

    conference.addEventListener(SariskaMediaTransport.events.conference.RECORDER_STATE_CHANGED, (data) => {
      if (data._status === "on" && data._mode === "stream") {
        conference.setLocalParticipantProperty("streaming", true);
        dispatch(showSnackbar({ autoHide: true, message: "Live streaming started" }));
        action({ key: "streaming", value: true });
        localStorage.setItem("streaming_session_id", data?._sessionID);
      }

      if (data._status === "off" && data._mode === "stream") {
        conference.removeLocalParticipantProperty("streaming");
        dispatch(showSnackbar({ autoHide: true, message: "Live streaming stopped" }));
        action({ key: "streaming", value: false });
      }

      if (data._status === "on" && data._mode === "file") {
        conference.setLocalParticipantProperty("recording", true);
        dispatch(showSnackbar({ autoHide: true, message: "Recording started" }));
        action({ key: "recording", value: true });
        localStorage.setItem("recording_session_id", data?._sessionID);
      }

      if (data._status === "off" && data._mode === "file") {
        conference.removeLocalParticipantProperty("recording");
        dispatch(showSnackbar({ autoHide: true, message: "Recording stopped" }));
        action({ key: "recording", value: false });
      }

      if (data._mode === "stream" && data._error) {
        conference.removeLocalParticipantProperty("streaming");
        dispatch(showSnackbar({
          autoHide: true,
          message: RECORDING_ERROR_CONSTANTS[data._error],
        }));
        action({ key: "streaming", value: false });
      }

      if (data._mode === "file" && data._error) {
        conference.removeLocalParticipantProperty("recording");
        dispatch(showSnackbar({
          autoHide: true,
          message: RECORDING_ERROR_CONSTANTS[data._error],
        }));
        action({ key: "recording", value: false });
      }
    })
  }, []);

  const leaveConference = () => {
    dispatch(clearAllReducers());
    history.push("/leave");
  };

  return (
    <Box id="footer" className={classes.root}>
      <Box className={classes.infoContainer}>
        <Box>{time}</Box>
        <Box className={classes.separator}>|</Box>
        <Box>{profile.meetingTitle}</Box>
      </Box>
      <Tooltip title="Leave Call">
        <span
          className={classNames(
            "material-icons material-icons-outlined",
            classes.end
          )}
          onClick={leaveConference}
        >
          call_end
        </span>
      </Tooltip>
      <Box className={classes.permissions}>
        <Tooltip title={audioTrack ? audioTrack?.isMuted() ? "Unmute Audio" : "Mute Audio" : "Check the mic or Speaker"}>
          {audioTrack ? audioTrack?.isMuted() ? (
            <span
              className={classnames("material-icons material-icons-outlined", classes.active)}
              onClick={unmuteAudio}
            >
              mic_off
            </span>
          ) : (
            <span
              className="material-icons material-icons-outlined"
              onClick={muteAudio}
            >
              mic_none
            </span>
          ) : <span
            className="material-icons material-icons-outlined"
            style={{ cursor: 'unset' }}
          >
            mic_none
          </span>
          }
        </Tooltip>
        <Tooltip title={videoTrack?.isMuted() ? "Unmute Video" : "Mute Video"}>
          {videoTrack?.isMuted() ? (
            <span
              className={classnames("material-icons material-icons-outlined", classes.active)}
              onClick={unmuteVideo}
            >
              videocam_off
            </span>
          ) : (
            <span
              className="material-icons material-icons-outlined"
              onClick={muteVideo}
            >
              videocam
            </span>
          )}
        </Tooltip>
        <Tooltip title={presenting ? "Stop Presenting" : "Share Screen"}>
          {presenting ? (
            <span
              className={classnames("material-icons material-icons-outlined", classes.active)}
              onClick={stopPresenting}
            >
              stop_screen_share
            </span>
          ) : (
            <span
              className="material-icons material-icons-outlined"
              onClick={shareScreen}
            >
              screen_share
            </span>
          )}
        </Tooltip>
        <Tooltip title={raiseHand ? "Hand Down" : "Raise Hand"}>
          {raiseHand ? (
            <span
              className={classnames("material-icons material-icons-outlined", classes.active, classes.panTool)}
              onClick={stopRaiseHand}
            >
              pan_tool
            </span>
          ) : (
            <span
              className={classnames("material-icons material-icons-outlined", classes.panTool)}
              onClick={startRaiseHand}
            >
              pan_tool
            </span>
          )}
        </Tooltip>
        <Tooltip title="Participants Details">
          <span
            className="material-icons material-icons-outlined"
            onClick={toggleParticipantDrawer("right", true)}
          >
            group
          </span>
        </Tooltip>
        <DrawerBox
          open={participantState["right"]}
          onClose={toggleParticipantDrawer("right", false)}
        >
          {participantList("right")}
        </DrawerBox>
        <Tooltip title="Chat Box">
          <StyledBadge badgeContent={unread}>
            <span
              className={classnames("material-icons material-icons-outlined", classes.chat)}
              onClick={toggleChatDrawer("right", true)}
            >
              chat
            </span>
          </StyledBadge>
        </Tooltip>
        <DrawerBox
          open={chatState["right"]}
          onClose={toggleChatDrawer("right", false)}
        >
          {chatList("right")}
        </DrawerBox>
        <Tooltip
          title={
            layout.type === SPEAKER || layout.type === PRESENTATION
              ? "Grid View" : "Speaker View"
          }
        >
          {layout.type === SPEAKER || layout.type === PRESENTATION ? (
            <span
              className={classnames(
                "material-icons material-icons-outlined",
                classes.subIcon,
              )}
              onClick={toggleView}
            >
              view_sidebar
            </span>
          ) : (
            <span
              className={classnames(
                "material-icons material-icons-outlined",
                classes.subIcon,
                classes.active
              )}
              onClick={toggleView}
            >
              view_comfy
            </span>
          )}
        </Tooltip>
        <Tooltip title="More Actions">
          <span
            className={classnames("material-icons material-icons-outlined", classes.more)}
            onClick={toggleMoreActionDrawer("right", true)}
          >
            more_vert
          </span>
        </Tooltip>
        <DrawerBox
          open={moreActionState["right"]}
          onClose={toggleMoreActionDrawer("right", false)}
        >
          {moreActionList("right")}
        </DrawerBox>
      </Box>
    </Box>
  );
};

export default ActionButtons;
