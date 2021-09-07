import {Box, makeStyles, Tooltip, Typography} from '@material-ui/core'
import React, {useEffect, useState} from 'react';
import SariskaMediaTransport from "sariska-media-transport";
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import {color} from '../../../assets/styles/_color';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import CallEndIcon from '@material-ui/icons/CallEnd';
import {useHistory, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {
    addLocalTrack,
    localTrackMutedChanged,
    removeLocalTrack
} from "../../../store/actions/track";
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import {
    ENTER_FULL_SCREEN_MODE,
    EXIT_FULL_SCREEN_MODE,
    IS_PRESENTING,
    START_PRESENTING,
    STOP_PRESENTING
} from "../../../constants";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitOutlinedIcon from "@material-ui/icons/FullscreenExitOutlined";
import {setFullScreen, setPresenter} from "../../../store/actions/layout";

const useStyles = makeStyles((theme) => ({
    root: {
        height: "64px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bottom: 0,
        width: "100%",
        position: "fixed",
        color: color.white,
        "& .MuiSvgIcon-root": {
            padding: '8px',
            borderRadius: '50%',
            marginRight: '24px',
            background: "#4c5050",
            "&:hover": {
                opacity: '0.8',
                cursor: 'pointer'
            }
        }
    },
    infoContainer: {
        right: "20px",
        display: "flex",
        position: "absolute",
    },
    separator: {
        marginLeft: "10px",
        marginRight: "10px"
    },
    permissions: {
        display: 'flex',
        alignItems: 'center',
        padding: "10px",
    },
    end: {
        background: `${color.red} !important`,
        borderColor: `${color.red} !important`,
        "&:hover": {
            opacity: '0.8',
            background: `${color.red} !important`,
            cursor: 'pointer'
        }
    },
    subIcon: {
        border: "none !important",
    },
}));


const ActionButtons = () => {
    const history = useHistory();
    const [audioTrack, videoTrack] = useSelector(state => state.localTrack);
    const classes = useStyles();
    const dispatch = useDispatch();
    const conference = useSelector(state => state.conference);
    const localTracks = useSelector(state => state.localTrack);
    const [presenting, setPresenting] = useState(false);
    const [time, setTime] = useState(new Date().toLocaleTimeString().slice(0,5));
    const data = useParams();
    const profile = useSelector(state => state.profile)
    const layout = useSelector((state) => state.layout);

    const enterFullScreen = () => {
        try {
            let docElm = document.documentElement;
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            } else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            } else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            }
            dispatch(setFullScreen(ENTER_FULL_SCREEN_MODE))
        } catch (e) {}
    }

    const exitFullScreen = () => {
        if (document.fullscreenElement === null) {
            dispatch(setFullScreen(EXIT_FULL_SCREEN_MODE));
            return;
        }
        try {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } catch (e) {}
    }

    const muteAudio = async () => {
        await audioTrack.mute();
        dispatch(localTrackMutedChanged());
    };

    const unmuteAudio = async () => {
        await audioTrack.unmute();
        dispatch(localTrackMutedChanged());
    };

    const muteVideo = async () => {
        await videoTrack.mute();
        dispatch(localTrackMutedChanged());
    };

    const unmuteVideo = async () => {
        await videoTrack.unmute();
        dispatch(localTrackMutedChanged());
    };

    const shareScreen = async () => {
        const videoTrack = localTracks.find(track => track.videoType === "camera");
        const [desktopTrack] = await SariskaMediaTransport.createLocalTracks({
            resolution: 720,
            devices: ["desktop"],
            desktopSharingFrameRate: {
                min: 40,
                max: 60
            },
            constraints: {
                video: {
                     height: {
                         ideal: 720,
                         max: 720,
                         min: 720
                     }
                 }
             }
        });
        conference.replaceTrack(videoTrack, desktopTrack);
        desktopTrack.addEventListener(SariskaMediaTransport.events.track.LOCAL_TRACK_STOPPED, async () => {
            stopPresenting();
        });
        setPresenting(true);
        conference.setLocalParticipantProperty(IS_PRESENTING, START_PRESENTING);
        dispatch(addLocalTrack(desktopTrack));
        dispatch(setPresenter(conference.myUserId()));
    }

    const stopPresenting = async () => {
        const videoTrack = localTracks.find(track => track.videoType === "camera");
        const desktopTrack = localTracks.find(track => track.videoType === "desktop");
        await conference.replaceTrack(desktopTrack, videoTrack);
        dispatch(removeLocalTrack(desktopTrack));
        setPresenting(false);
        conference.setLocalParticipantProperty(IS_PRESENTING, STOP_PRESENTING);
        dispatch(setPresenter(null));
    }

    useEffect(()=>{
        setInterval(()=> {
            setTime(new Date().toLocaleTimeString().slice(0,5))
        }, 60000 );
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreen) {
                exitFullScreen();
            }
        }, false);
        document.addEventListener('mozfullscreenchange', () => {
            if (!document.mozFullScreen) {
                exitFullScreen();
            }
        }, false);
        document.addEventListener('webkitfullscreenchange', () => {
            if (!document.webkitIsFullScreen) {
                exitFullScreen();
            }
        }, false);

        document.addEventListener('dblclick', (event) => {
            console.log("douable click event", event)
            if ( layout.mode === EXIT_FULL_SCREEN_MODE ){
              //  enterFullScreen();
            } else {
              //  exitFullScreen();
            }
        });
    },[])

    const leaveConference = () => {
        history.push("/leave");
    };

    return (
        <Box id="footer" className={classes.root}>
            <Box className={classes.permissions}>
                <Tooltip title={videoTrack?.isMuted() ? "Unmute Audio" : "Mute Audio"}>{audioTrack?.isMuted() ?
                    <MicOffIcon onClick={unmuteAudio}/> : <MicIcon onClick={muteAudio}/>}</Tooltip>
                <Tooltip title={videoTrack?.isMuted() ? "Unmute Video" : "Mute Video"}>{videoTrack?.isMuted() ?
                    <VideocamOffIcon onClick={unmuteVideo}/> : <VideocamIcon onClick={muteVideo}/>}</Tooltip>
                <Tooltip title={ presenting ? "Stop Presenting": "Share Screen" }>{presenting ? <StopScreenShareIcon onClick={stopPresenting}/> : <ScreenShareIcon onClick={shareScreen}/>}</Tooltip>
                <Tooltip title="Leave Call"><CallEndIcon className={classes.end} onClick={leaveConference}/></Tooltip>
                <Tooltip title={ layout.mode ===  EXIT_FULL_SCREEN_MODE  ? "Full Screen": "Exit Full Screen" }>
                    { layout.mode === EXIT_FULL_SCREEN_MODE ? <FullscreenIcon onClick={enterFullScreen} className={classes.subIcon}/> : <FullscreenExitOutlinedIcon onClick={exitFullScreen} className={classes.subIcon}/>}
                </Tooltip>
            </Box>
            <Box className={classes.infoContainer}>
                <Box>
                    {time}
                </Box>
                <Box className={classes.separator}>
                    |
                </Box>
                <Box>
                    {profile.meetingTitle}
                </Box>
            </Box>
        </Box>
    )
}

export default ActionButtons
