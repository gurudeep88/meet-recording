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
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import { color } from "../../../assets/styles/_color";
import ScreenShareIcon from "@material-ui/icons/ScreenShare";
import CallEndIcon from "@material-ui/icons/CallEnd";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import {
  addLocalTrack,
  localTrackMutedChanged,
  removeLocalTrack,
} from "../../../store/actions/track";
import StopScreenShareIcon from "@material-ui/icons/StopScreenShare";
import {
  ENTER_FULL_SCREEN_MODE,
  EXIT_FULL_SCREEN_MODE,
  GRID,
  PRESENTATION,
  SPEAKER,
} from "../../../constants";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import PanTool from "@material-ui/icons/PanTool";
import FullscreenExitOutlinedIcon from "@material-ui/icons/FullscreenExitOutlined";
import { setFullScreen, setLayout, setPresenter } from "../../../store/actions/layout";
import { clearAllReducers } from "../../../store/actions/conference";
import { formatAMPM } from "../../../utils";
import classNames from "classnames";
import ParticipantDetails from "../../shared/ParticipantDetails";
import { unreadMessage } from "../../../store/actions/chat";
import { withStyles } from "@material-ui/styles";
import ChatPanel from "../../shared/Chat";
import MoreAction from "../../shared/MoreAction";
import DrawerBox from "../../shared/DrawerBox";

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
      borderRadius: "7.5px",
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
    width: "410px",
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

const ActionButtons = () => {
  const history = useHistory();
  const [audioTrack, videoTrack] = useSelector((state) => state.localTrack);
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
  const [chatState, setChatState] = React.useState({
    right: false,
  });
  const [participantState, setParticipantState] = React.useState({
    right: false,
  });
  const [moreActionState, setMoreActionState] = React.useState({
    right: false,
  });
  const AddFShandler = () => {
    var isInFullScreen =
      (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement &&
        document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement &&
        document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null);

    if (isInFullScreen) {
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

  const fullScreen = () => {
    var isInFullScreen =
      (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement &&
        document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement &&
        document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null);

    var docElm = document.documentElement;
    if (!isInFullScreen) {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

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
    dispatch(
      setPresenter({ participantId: conference.myUserId(), presenter: true })
    );
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

  const toggleView = () => {
    if (layout.type === SPEAKER || layout.type === PRESENTATION) {
      dispatch(setLayout(GRID));
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
        <MoreAction />
    </>
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatAMPM(new Date()));
    }, 1000);

    const dbClickHandler = () => {
      if (layout.mode === EXIT_FULL_SCREEN_MODE) {
        fullScreen();
      } else {
        fullScreen();
      }
    };

    document.addEventListener("dblclick", dbClickHandler);
    return () => {
      clearInterval(interval);
      document.removeEventListener("dblclick", dbClickHandler);
    };
  }, [layout.mode]);

  useEffect(() => {
    addFullscreenListeners();
    return () => {
      removeFullscreenListeners();
    };
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
        <Tooltip title={audioTrack?.isMuted() ? "Unmute Audio" : "Mute Audio"}>
          {audioTrack?.isMuted() ? (
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
          )}
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
            layout.type === SPEAKER
              ? "Grid View" : "Speaker View"
          }
        >
          {layout.type === SPEAKER ? (
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
        {/* <Tooltip
          title={
            layout.mode === EXIT_FULL_SCREEN_MODE
              ? "Full Screen"
              : "Exit Full Screen"
          }
        >
          {layout.mode === EXIT_FULL_SCREEN_MODE ? (
            <span
              className={classNames(
                "material-icons material-icons-outlined",
                classes.subIcon
              )}
              onClick={fullScreen}
            >
              fullscreen
            </span>
          ) : (
            <span
              className={classNames(
                "material-icons material-icons-outlined",
                classes.subIcon
              )}
              onClick={fullScreen}
            >
              fullscreen_exit
            </span>
          )}
        </Tooltip> */}
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
