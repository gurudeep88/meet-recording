import React, { useEffect, useRef, useState } from "react";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import { color } from "../../../assets/styles/_color";
import { Box, Drawer } from "@material-ui/core";
import CopyLink from "../CopyLink";
import { useDispatch, useSelector } from "react-redux";
import {
  DROPBOX_APP_KEY,
  PRESENTATION,
  SHARED_DOCUMENT,
  SPEAKER,
  WHITEBOARD,
} from "../../../constants";
import LiveStreamDialog from "../LiveStreamDialog";
import VirtualBackground from "../VirtualBackground";
import { showSnackbar } from "../../../store/actions/snackbar";
import { showNotification } from "../../../store/actions/notification";
import googleApi from "../../../utils/google-apis";
import SariskaMediaTransport from "sariska-media-transport/dist/esm/SariskaMediaTransport";
import { authorizeDropbox } from "../../../utils/dropbox-apis";
import SettingsBox from "../../meeting/Settings";
import classnames from "classnames";
import DrawerBox from "../DrawerBox";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: color.secondary,
    boxShadow: 'none',
    color: color.white,
    "& .MuiList-padding": {
      paddingTop: '0px',      
    },
    "& ul>li:first-child": {
      marginTop: 0,
    },
    "& .MuiListItem-root": {
      height: "40px",
      marginTop: "10px",
      marginBottom: "20px",
      paddingLeft: '6px',
      borderRadius: '7.5px',
      "&:hover": {
        backgroundColor: color.secondaryLight,
        borderRadius: '7.5px',
      },
    },
    "& span.material-icons": {
      color: color.white,
    },
  },
  drawer: {
    "& .MuiDrawer-paper": {
      overflow: "hidden",
      top: "64px",
      height: "82%",
      right: "10px",
      borderRadius: "10px",
    },
  },
  detailedList: {
    width: "360px",
    padding: theme.spacing(3),
    "& h6": {
      paddingLeft: "10px",
    },
  },
  title: {
    color: color.secondary,
    fontWeight: "900",
  },
  cardTitle: {
    color: color.white,
    fontWeight: "400",
    marginLeft: '8px',
    fontSize: '28px',
    lineHeight: '1',
    marginBottom: '24px',
  },
  urlBox: {
    padding: "24px 10px",
    "& h5": {
      fontSize: "1rem",
      fontWeight: "900",
      paddingBottom: theme.spacing(2),
    },
  },
  stopRecording: {
    color: `${color.primaryLight} !important`,
  },
  startRecording: {
    color: color.white,
  },
  virtualList: {
    overflowY: "scroll",
    height: '95%',
  },
  settingsList: {

},
}));

export default function MoreAction({dominantSpeakerId, featureStates, setLayoutAndFeature, action }) {
  const classes = useStyles();
  const conference = useSelector((state) => state.conference);
  const layout = useSelector((state) => state.layout);

  const dispatch = useDispatch();
  const recordingSession = useRef(null);
  const streamingSession = useRef(null);

  const [state, setState] = React.useState({
    right: false,
  });
  const [backgroundState, setBackgroundState] = React.useState({
    right: false,
  });

  const [settingsState, setSettingsState] = React.useState({
    right: false,
  });

  const [openLivestreamDialog, setOpenLivestreamDialog] = useState(false);
  const [broadcasts, setBroadcasts] = useState([]);

  const toggleBackgroundDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setBackgroundState({ ...backgroundState, [anchor]: open });
  };

  const toggleSettingsDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setSettingsState({ ...settingsState, [anchor]: open });
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const startStreamingCaption = async () => {
    dispatch(
      showSnackbar({
        severity: "info",
        message: "Live Streaming to be Launched Soon",
        autoHide: true,
      })
    );
  };

  const startStreaming = async () => {
    if (featureStates.streaming) {
      return;
    }

    if (conference?.getRole() === "none") {
      return dispatch(
        showNotification({
          severity: "info",
          autoHide: true,
          message: "You are not moderator!!",
        })
      );
    }

    await googleApi.signInIfNotSignedIn();
    let youtubeBroadcasts;

    try {
      youtubeBroadcasts = await googleApi.requestAvailableYouTubeBroadcasts();
    } catch (e) {
      dispatch(
        showNotification({
          autoHide: true,
          message: e?.result?.error?.message,
          severity: "info",
        })
      );
      return;
    }

    if (youtubeBroadcasts.status !== 200) {
      dispatch(
        showNotification({
          autoHide: true,
          message: "Could not fetch YouTube broadcasts",
          severity: "info",
        })
      );
    }
    setBroadcasts(youtubeBroadcasts.result.items);
    setOpenLivestreamDialog(true);
  };

  const createLiveStream = async () => {
    const title = `test__${Date.now()}`;
    const resposne = await googleApi.createLiveStreams(title);

    const streamName = resposne.cdn?.ingestionInfo?.streamName;
    if (!streamName) {
      return;
    }

    dispatch(
      showSnackbar({
        severity: "info",
        message: "Starting Live Streaming",
        autoHide: false,
      })
    );
    const session = await conference.startRecording({
      mode: SariskaMediaTransport.constants.recording.mode.STREAM,
      streamId: `rtmp://a.rtmp.youtube.com/live2/${streamName}`,
    });
    streamingSession.current = session;
    setOpenLivestreamDialog(false);
  };

  const selectedBroadcast = async (boundStreamID) => {
    const selectedStream =
      await googleApi.requestLiveStreamsForYouTubeBroadcast(boundStreamID);

    if (selectedStream.status !== 200) {
      dispatch(
        showNotification({
          autoHide: true,
          message: "No live streams found",
          severity: "error",
        })
      );
      return;
    }

    dispatch(
      showSnackbar({
        severity: "info",
        message: "Starting Live Streaming",
        autoHide: false,
      })
    );

    const streamName =
      selectedStream.result.items[0]?.cdn?.ingestionInfo?.streamName;
    setOpenLivestreamDialog(false);
    const session = await conference.startRecording({
      mode: SariskaMediaTransport.constants.recording.mode.STREAM,
      streamId: `rtmp://a.rtmp.youtube.com/live2/${streamName}`,
    });
    streamingSession.current = session;
  };

  const stopStreaming = async () => {
    console.log("stop", featureStates);

    if (!featureStates.streaming) {
      return;
    }
    if (conference?.getRole() === "none") {
      return dispatch(
        showNotification({
          severity: "info",
          autoHide: true,
          message: "You are not moderator!!",
        })
      );
    }
    await conference.stopRecording(
      localStorage.getItem("streaming_session_id")
    );
  };

  const startRecording = async () => {
    if (featureStates.recording) {
      return;
    }

    if (conference?.getRole() === "none") {
      return dispatch(
        showNotification({
          severity: "info",
          autoHide: true,
          message: "You are not moderator!!",
        })
      );
    }

    const response = await authorizeDropbox();
    if (!response?.token) {
      return dispatch(
        showNotification({
          severity: "error",
          message: "Recording failed no dropbox token",
        })
      );
    }
    const appData = {
      file_recording_metadata: {
        upload_credentials: {
          service_name: "dropbox",
          token: response.token,
          app_key: DROPBOX_APP_KEY,
          r_token: response.rToken,
        },
      },
    };

    dispatch(
      showSnackbar({
        severity: "info",
        message: "Starting Recording",
        autoHide: false,
      })
    );

    const session = await conference.startRecording({
      mode: SariskaMediaTransport.constants.recording.mode.FILE,
      appData: JSON.stringify(appData),
    });
    recordingSession.current = session;
  };

  const stopRecording = async () => {
    if (!featureStates.recording) {
      return;
    }
    if (conference?.getRole() === "none") {
      return dispatch(
        showNotification({
          severity: "info",
          autoHide: true,
          message: "You are not moderator!!",
        })
      );
    }
    await conference.stopRecording(
      localStorage.getItem("recording_session_id")
    );
  };

  const startCaption = () => {
    dispatch(
      showSnackbar({
        severity: "info",
        message: "Starting Caption",
        autoHide: false,
      })
    );
    conference.setLocalParticipantProperty("requestingTranscription", true);
  };

  const stopCaption = () => {
    conference.setLocalParticipantProperty("requestingTranscription", false);
  };

  const startWhiteboard = () => {
    stopSharedDocument();
    setLayoutAndFeature(PRESENTATION, WHITEBOARD, { key: "whiteboard",  value: true});
    conference.setLocalParticipantProperty("whiteboard", "start");
  };

  const stopWhiteboard = () => {
    setLayoutAndFeature(SPEAKER, null, { key: "whiteboard", value:  false});
    conference.setLocalParticipantProperty("whiteboard", "stop");
  };

  const startSharedDocument = () => {
    stopWhiteboard();
    setLayoutAndFeature(PRESENTATION, SHARED_DOCUMENT, { key: "sharedDocument", value: true});
    conference.setLocalParticipantProperty("sharedDocument", "start");
  };

  const stopSharedDocument = () => {
    setLayoutAndFeature(SPEAKER, null, { key: "sharedDocument", value: false});
    conference.setLocalParticipantProperty("sharedDocument", "stop");
  };

  const virtualBackgroundList = (anchor) => (
    <Box
      className={classes.virtualList}
      role="presentation"
      onKeyDown={toggleBackgroundDrawer(anchor, false)}
    >
      <VirtualBackground dominantSpeakerId={dominantSpeakerId} />
    </Box>
  );
  const settingsList = (anchor) => (
    <Box
      onKeyDown={toggleSettingsDrawer(anchor, false)}
    >
      <SettingsBox />
    </Box>
  );
  
  const closeLiveStreamDialog = () => {
    setOpenLivestreamDialog(false);
  };

  const menuData = [
    {
      icon: (
        <span
          className={
            featureStates.recording
              ? classnames(
                  "material-icons material-icons-outlined",
                  classes.stopRecording
                )
              : classnames(
                  "material-icons material-icons-outlined",
                  classes.startRecording
                )
          }
        >
          album
        </span>
      ),
      title: featureStates.recording ? "Stop Recording" : "Start Recording",
      onClick: featureStates.recording ? stopRecording : startRecording,
    },
    {
      icon: (
        <span
          className={
            featureStates.streaming
              ? classnames(
                  "material-icons material-icons-outlined",
                  classes.stopRecording
                )
              : classnames(
                  "material-icons material-icons-outlined",
                  classes.startRecording
                )
          }
        >
          public
        </span>
      ),
      title: featureStates.streaming ? "Stop Streaming" : "Start Streaming",
      onClick: featureStates.streaming ? stopStreaming: startStreaming,
    },
    // {
    //   icon: (
    //     <span
    //       className={
    //         caption
    //           ? classnames(
    //               "material-icons material-icons-outlined",
    //               classes.stopRecording
    //             )
    //           : classnames(
    //               "material-icons material-icons-outlined",
    //               classes.startRecording
    //             )
    //       }
    //     >
    //       closed_caption
    //     </span>
    //   ),
    //   title: caption ? "Turn off Captions" : "Turn on Captions",
    //   onClick: caption ? stopCaption : startCaption,
    // },
    {
      icon: (
        <span className="material-icons material-icons-outlined">
          flip_to_front
        </span>
      ),
      title: "Virtual Background",
      onClick: toggleBackgroundDrawer("right", true),
    },
    {
      icon: (
        <span
          className={featureStates.whiteboard ? classnames("material-icons material-icons-outlined", classes.stopRecording) : classnames("material-icons material-icons-outlined", classes.startRecording)}
        >
          create
        </span>
      ),
      title: featureStates.whiteboard ? "Stop Whiteboard" : "Start Whiteboard",
      onClick: featureStates.whiteboard ? stopWhiteboard: startWhiteboard,
    },
    {
      icon: (
        <span
        className={featureStates.sharedDocument ? classnames("material-icons material-icons-outlined", classes.stopRecording) : classnames("material-icons material-icons-outlined", classes.startRecording)}
        >
          description
        </span>
      ),
      title: featureStates.sharedDocument ? "Stop Shared Documents" : "Start Shared Documents",
      onClick: featureStates.sharedDocument ? stopSharedDocument: startSharedDocument,
    },
    {
      icon: (
        <span
          className="material-icons material-icons-outlined"
          style={{ color: color.white }}
        >
          settings
        </span>
      ),
      title: "Settings",
      onClick: toggleSettingsDrawer("right", true),
    },
  ];

  const detailedList = (anchor) => (
    <Box
      className={classes.detailedList}
      role="presentation"
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Typography variant="h6" className={classes.title}>
        Meeting Info
      </Typography>
      <Box className={classes.urlBox}>
        <Typography variant="h5" className={classes.title1}>
          Shared URL
        </Typography>
        <CopyLink onClick={toggleDrawer} />
      </Box>
    </Box>
  );

  return (
    <>
      <Paper className={classes.root}>
      <Typography variant="h6" className={classes.cardTitle}>Activities</Typography>
        <MenuList>
          {menuData.map((menu, index) => (
            <MenuItem onClick={menu.onClick} key={index}>
              <ListItemIcon>{menu.icon}</ListItemIcon>
              <Typography variant="inherit">{menu.title}</Typography>
            </MenuItem>
          ))}
        </MenuList>
      </Paper>
      <DrawerBox
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
      >
        {detailedList("right")}
      </DrawerBox>
      <DrawerBox
        open={backgroundState["right"]}
        onClose={toggleBackgroundDrawer("right", false)}
      >
        {virtualBackgroundList("right")}
      </DrawerBox>
      <DrawerBox
        open={settingsState["right"]}
        onClose={toggleSettingsDrawer("right", false)}
      >
        {settingsList("right")}
      </DrawerBox>
      <LiveStreamDialog close={closeLiveStreamDialog} createLiveStream={createLiveStream} open={openLivestreamDialog} broadcasts={broadcasts}
                              selectedBroadcast={selectedBroadcast}/>
    </>
  );
}
