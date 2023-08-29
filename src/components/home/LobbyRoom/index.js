import {
  Box,
  Hidden,
  makeStyles,
  Snackbar,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState, useRef } from "react";
import SariskaMediaTransport from "sariska-media-transport";
import { color } from "../../../assets/styles/_color";
import { useHistory } from "react-router-dom";
import { localTrackMutedChanged } from "../../../store/actions/track";
import { addConference } from "../../../store/actions/conference";
import {
  getToken,
  trimSpace,
  getRandomColor
} from "../../../utils";
import { addThumbnailColor } from "../../../store/actions/color";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import TextInput from "../../shared/TextInput";
import { setProfile, setMeeting , updateProfile} from "../../../store/actions/profile";
import JoinTrack from "../JoinTrack";
import { addConnection } from "../../../store/actions/connection";
import SnackbarBox from "../../shared/Snackbar";
import { showNotification } from "../../../store/actions/notification";
import { setDisconnected } from "../../../store/actions/layout";
import Logo from "../../shared/Logo";
import FancyButton from "../../shared/FancyButton";
import StyledTooltip from "../../shared/StyledTooltip";

const LobbyRoom = ({ tracks }) => {
  const history = useHistory();
  const audioTrack =  useSelector((state) => state.localTrack).find(track=>track?.isAudioTrack());  
  const videoTrack =  useSelector((state) => state.localTrack).find(track=>track?.isVideoTrack());  
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [name, setName] = useState("");
  const [buttonText, setButtonText] = useState("Start Meeting");
  const [accessDenied, setAccessDenied] = useState(false);
  const profile = useSelector((state) => state.profile);
  const queryParams = useParams();
  const iAmRecorder = window.location.hash.indexOf("iAmRecorder") >= 0;
  const testMode = window.location.hash.indexOf("testMode") >= 0;
  const notification = useSelector((state) => state.notification);
  const [settingsState, setSettingsState] = React.useState({
    right: false,
  });
  const moderator = useRef(true);

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: 'flex-start'
    },
    permissions: {
      display: "flex",
      justifyContent: "space-around",
      paddingLeft: "0",
      paddingRight: "0",
      marginTop: "3.73vh",
      "& svg": {
        //border: `1px solid ${color.white}`,
        padding: "12px 0px",
        borderRadius: "7.5px",
        color: color.white,
        fontSize: "1.87vw",
        "&:hover": {
          color: color.primaryLight,
          cursor: "pointer",
        },
        [theme.breakpoints.down("sm")]: {
          fontSize: "1.6rem",
        }
      },
      [theme.breakpoints.down("sm")]: {
        marginTop: "10px !important",
        padding: '0 50px',
        width: '250px',
        margin: 'auto'
      }
    },
  
    joinPermissions: {
      display: "flex",
      justifyContent: "space-around",
      paddingLeft: "0",
      paddingRight: "0",
      marginTop: "3.73vh",
      //marginBottom: theme.spacing(3),
      "& svg": {
        //border: `1px solid ${color.white}`,
        padding: "12px 0px",
        borderRadius: "7.5px",
        color: color.white,
        fontSize: "1.87vw",
        "&:hover": {
          color: color.primaryLight,
          cursor: "pointer",
        },
        [theme.breakpoints.down("sm")]: {
          fontSize: "1.6rem",
        }
      },
      [theme.breakpoints.down("sm")]: {
        marginTop: "10px !important",
        padding: '0 50px',
        width: '250px',
        margin: 'auto'
      }
    },
    disable: {
      background: color.red,
      "&:hover": {
        opacity: "0.8",
        background: `${color.red} !important`,
      },
    },
    textBox: {
      width: "100%",
      //marginBottom: "60px"
    },
    userBox: {
      marginTop: '1vh',
      marginBottom: '1vh',
      [theme.breakpoints.down("sm")]: {
        marginTop: '10px',
        marginBottom: '10px'
      }
    },
    moderatorBox: {
      display: "flex",
      justifyContent: "space-between",
      color: color.lightgray1,
      alignItems: "center",
      padding: "0px 8px 8px",
    },
    action: {
      opacity: .9
    },
    anchor: {
      color: color.white,
      textDecoration: "none",
      border: `1px solid ${color.primaryLight}`,
      padding: theme.spacing(0.5, 5),
      borderRadius: "10px",
      textTransform: "capitalize",
      marginTop: '5.4vh',
      width: '178.69px',
      "&:hover": {
        fontWeight: "900",
        background: `linear-gradient(to right, ${color.primaryLight}, ${color.buttonGradient}, ${color.primary})`,
      }
    },
    videoContainer: {
      borderRadius: "4px",
      backgroundColor: color.blurEffect,
      backdropFilter: `blur(48px)`,	
      '-webkit-backdrop-filter': 'blur(48px)',
      transition: `background-color .2s ease`,
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "column",
      zIndex: 1,
      padding: "1.74vw",
      border: `1px solid ${color.whitePointOne}`,
      marginLeft: '15%',
      marginRight: 'auto',
      minHeight: '60vh',
      [theme.breakpoints.down("md")]: {
        padding: "24px 0",
        backgroundColor: videoTrack?.isMuted() ? color.blurEffect : color.lightBlurEffect,
        border: `none`,
        minHeight: 'fit-content',
        borderRadius: "20px 20px 0px 0px",
        marginLeft: 0,
        marginRight: 0,
        width: '350px'
      }
    },
    logoContainer: {},
    header: {
      color: color.white,
      textAlign: "center",
      fontSize: "2.385vw",
      fontWeight: 300,
      marginTop: '5.5vh',
      [theme.breakpoints.down("sm")]: {
        fontSize: "1.7rem",
        marginTop: '0',
      }
    },
    headerJoin: {
      color: color.white,
      textAlign: "center",
      fontSize: "2.385vw",
      fontWeight: 300,
      marginTop: theme.spacing(11),
      [theme.breakpoints.down("sm")]: {
        fontSize: "1.7rem",
        marginTop: '0',
      }
    },
    wrapper: {
      margin: "2.3vh 0px 0.5vh 0px",
      position: "relative",
      textAlign: "center",
      [theme.breakpoints.down("sm")]: {
        marginTop: 0,
        marginBottom: 0,
      }
    },
    buttonSuccess: {
      backgroundColor: color.primary,
      "&:hover": {
        backgroundColor: color.primary,
      },
    },
    buttonProgress: {
      color: color.primary,
      position: "absolute",
      bottom: "4.5vh",
      top: "30px",
      left: "50%",
      marginLeft: -12,
    },
    buttonProgressJoin: {
      color: color.primary,
      top: "30px",
      position: "absolute",
      bottom: '4.5vh',
      left: "50%",
      marginLeft: -12,
    },
  }));

  const classes = useStyles();

  const handleTitleChange = (e) => {
    setMeetingTitle(trimSpace(e.target.value.toLowerCase()));
  };

  const handleUserNameChange = (e) => {
    setName(e.target.value);
    if (e.target.value.length === 1 ) {
      dispatch(updateProfile({key: "color", value: getRandomColor()}));
    }
    if (!e.target.value) {
      dispatch(updateProfile({key: "color", value: null}));
    }
  };
  
  const handleSubmit = async () => {
    if (!meetingTitle) {
      dispatch(
        showNotification({
          message: "Meeting Title is required",
          severity: "warning",
          autoHide: true,
        })
      );
      return;
    }

    setLoading(true);
    let avatarColor = profile?.color ?  profile?.color : getRandomColor();
    dispatch(updateProfile({key: "color", value: avatarColor}));

    const token = await getToken(profile, name, avatarColor);
    const connection = new SariskaMediaTransport.JitsiConnection(
      token,
      meetingTitle,
      process.env.REACT_APP_ENV === "development" ? true : false
    );

    connection.addEventListener(
      SariskaMediaTransport.events.connection.CONNECTION_ESTABLISHED,
      () => {
        dispatch(addConnection(connection));
        createConference(connection);
      }
    );

    connection.addEventListener(
      SariskaMediaTransport.events.connection.CONNECTION_FAILED,
      async (error) => {
        console.log(" CONNECTION_DROPPED_ERROR", error);
        if (
          error === SariskaMediaTransport.errors.connection.PASSWORD_REQUIRED
        ) {
          const token = await getToken(profile, name, moderator.current);
          connection.setToken(token); // token expired, set a new token
        }
        if (
          error ===
          SariskaMediaTransport.errors.connection.CONNECTION_DROPPED_ERROR
        ) {
          dispatch(setDisconnected("lost"));
        }
      }
    );

    connection.addEventListener(
      SariskaMediaTransport.events.connection.CONNECTION_DISCONNECTED,
      (error) => {
        console.log("connection disconnect!!!", error);
      }
    );

    connection.connect();
  };

  const createConference = async (connection) => {
    const conference = connection.initJitsiConference();
    tracks.forEach(async track => await conference.addTrack(track));

    conference.addEventListener(
      SariskaMediaTransport.events.conference.CONFERENCE_JOINED,
      () => {
        setLoading(false);
        dispatch(addConference(conference));
        dispatch(setProfile(conference.getLocalUser()));
        dispatch(setMeeting({ meetingTitle }));
        dispatch(addThumbnailColor({participantId: conference?.myUserId(), color:  profile?.color}));
      }
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.USER_ROLE_CHANGED,
      (id, role) => {
        console.log('USER_ROLE_CHANGED', id, role)
        if (conference.isModerator() && !testMode) {
          conference.enableLobby();
          history.push(`/meet/${meetingTitle}`);
        } else {
          history.push(`/meet/${meetingTitle}`);
        }
      }
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.CONFERENCE_ERROR,
      () => {
        setLoading(false);
      }
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.USER_JOINED,
      (id) => {
        dispatch(
          addThumbnailColor({ participantId: id, color: getRandomColor() })
        );
      }
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.CONFERENCE_FAILED,
      async (error) => {
        if (
          error === SariskaMediaTransport.errors.conference.MEMBERS_ONLY_ERROR
        ) {
          setButtonText("Asking to join");
          conference.joinLobby(name || conference?.getLocalUser()?.name);
        }

        if (
          error ===
          SariskaMediaTransport.errors.conference.CONFERENCE_ACCESS_DENIED
        ) {
          setAccessDenied(true);
          setButtonText("Join Meeting");
          setLoading(false);
          setTimeout(() => setAccessDenied(false), 2000);
        }
      }
    );
    conference.join();
  };

  const unmuteAudioLocalTrack = async () => {
    await audioTrack?.unmute();
    dispatch(localTrackMutedChanged());
  };

  const muteAudioLocalTrack = async () => {
    await audioTrack?.mute();
    dispatch(localTrackMutedChanged());
  };

  const unmuteVideoLocalTrack = async () => {
    await videoTrack?.unmute();
    dispatch(localTrackMutedChanged());
  };

  const muteVideoLocalTrack = async () => {
    await videoTrack?.mute();
    dispatch(localTrackMutedChanged());
  };

  if (iAmRecorder && !meetingTitle) {
    console.log('first recorder', queryParams.meetingId)
    setName("recorder");
    setMeetingTitle(queryParams.meetingId);
  }

  useEffect(() => {
    console.log('out state.meetingName && (testMode || iAmRecorder)', meetingTitle, testMode, iAmRecorder);
    if (meetingTitle && (testMode || iAmRecorder)) {
      console.log('state.meetingName && (testMode || iAmRecorder)', meetingTitle, testMode, iAmRecorder);
      handleSubmit();
    }
  }, [meetingTitle]);

  useEffect(() => {
    if ((!audioTrack || !videoTrack) && !iAmRecorder ) {
        setLoading(true);
    } else {
        setLoading(false);
    }
  }, [audioTrack, videoTrack]);


  useEffect(() => {
    if (queryParams.meetingId) {
      setButtonText("Join Meeting");
      setMeetingTitle(queryParams.meetingId);
    }
    setName(profile.name);
  }, [profile?.name]);

  return (
    <Box className={classes.root}>
      <JoinTrack tracks={tracks} name={name} />
      <Box className={classes.videoContainer}>
        <Hidden smDown>
        <Box className={classes.logoContainer}>
          <Logo height={"80px"} />
        </Box>
        </Hidden>
        <Box>
        {queryParams.meetingId ? 
          <Typography className={classes.headerJoin}>Joins {queryParams.meetingId}</Typography>
          :
          <Typography className={classes.header}>Create Meeting</Typography>
        }
        </Box>
        <Box className={!queryParams.meetingId ? classes.permissions : classes.joinPermissions}>
          {audioTrack?.isMuted() ? (
            <StyledTooltip title="Unmute Audio">
              <MicOffIcon onClick={unmuteAudioLocalTrack} />
            </StyledTooltip>
          ) : (
            <StyledTooltip title="Mute Audio">
              <MicIcon onClick={muteAudioLocalTrack} />
            </StyledTooltip>
          )}
          {videoTrack?.isMuted() ? (
            <StyledTooltip title="Unmute Video">
              <VideocamOffIcon onClick={unmuteVideoLocalTrack} />
            </StyledTooltip>
          ) : (
            <StyledTooltip title="Mute Video">
              <VideocamIcon onClick={muteVideoLocalTrack} />
            </StyledTooltip>
          )}
        </Box>
        <Box className={classes.action}>
          <div className={classes.wrapper}>
            <Box className={classes.textBox}>
              {!queryParams.meetingId ? <>
              <TextInput
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                label="Meeting Title"
                width="20vw"
                value={meetingTitle}
                onChange={handleTitleChange}
              />
              </> : 
              null}
              <Box className={classes.userBox}>
                <TextInput
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  label="Username"
                  width="20vw"
                  value={name}
                  onChange={handleUserNameChange}
                />
              </Box>
            </Box>
            
          </div>
        </Box>
        <Box style={{textAlign: 'center', position: 'relative'}}>
        <FancyButton 
              homeButton={true}
              disabled={loading}
              onClick={handleSubmit}
              buttonText={buttonText}
            />
            {loading && (
              <CircularProgress size={24} className={ !queryParams?.meetingId ? classes.buttonProgress : classes.buttonProgressJoin} />
            )}
            </Box>
      </Box>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        autoHideDuration={2000}
        open={accessDenied}
        message="Conference access denied by moderator"
      />
      <SnackbarBox notification={notification} />
    </Box>
  );
};

export default LobbyRoom;