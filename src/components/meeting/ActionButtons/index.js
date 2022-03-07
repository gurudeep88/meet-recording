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
import {useHistory} from 'react-router-dom';
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
} from "../../../constants";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import PanTool from '@material-ui/icons/PanTool';
import FullscreenExitOutlinedIcon from "@material-ui/icons/FullscreenExitOutlined";
import {setFullScreen, setPresenter} from "../../../store/actions/layout";
import {clearAllReducers} from "../../../store/actions/conference";
import {formatAMPM} from "../../../utils";

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
    const [time, setTime] = useState(formatAMPM(new Date()));
    const profile = useSelector(state => state.profile)
    const layout = useSelector((state) => state.layout);
    const [raiseHand, setRaiseHand] = useState(false);

    const FShandler = ()=>{
        removeFullscreenListeners();
        dispatch(setFullScreen(EXIT_FULL_SCREEN_MODE));
    }

    const addFullscreenListeners = ()=>{
        document.addEventListener("fullscreenchange", FShandler);
        document.addEventListener("webkitfullscreenchange", FShandler);
        document.addEventListener("mozfullscreenchange", FShandler);
        document.addEventListener("MSFullscreenChange", FShandler);
    }

    const removeFullscreenListeners = ()=>{
        document.removeEventListener("fullscreenchange", FShandler);
        document.removeEventListener("webkitfullscreenchange", FShandler);
        document.removeEventListener("mozfullscreenchange", FShandler);
        document.removeEventListener("MSFullscreenChange", FShandler);
    }
    
    const enterFullScreen = () => {
        var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);
        let docElm = document.documentElement;

        if (isInFullScreen || !docElm) {
            return;
        }

        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        } else if(docElm.msRequestFullScreen) {
            docElm.msRequestFullScreen();
        }
        dispatch(setFullScreen(ENTER_FULL_SCREEN_MODE));
        setTimeout(()=>{addFullscreenListeners()},1000);
    }

    const exitFullScreen = () => {
        var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);
        if (!isInFullScreen) {
            return;
        }   

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        dispatch(setFullScreen(EXIT_FULL_SCREEN_MODE));
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
        const videoTrack = localTracks.find(track => track.videoType === "camera");
        const [desktopTrack] = await SariskaMediaTransport.createLocalTracks({
            resolution: 720,
            devices: ["desktop"]
        });

        await conference.replaceTrack(videoTrack, desktopTrack);
        desktopTrack.addEventListener(SariskaMediaTransport.events.track.LOCAL_TRACK_STOPPED, async () => {
            stopPresenting();
        });
        setPresenting(true);
        conference.setLocalParticipantProperty("presenting", "start");
        dispatch(addLocalTrack(desktopTrack));
        dispatch(setPresenter({ participantId: conference.myUserId(), presenter: true}));
    }

    const stopPresenting = async () => {
        const videoTrack = localTracks.find(track => track.videoType === "camera");
        const desktopTrack = localTracks.find(track => track.videoType === "desktop");        
        await conference.replaceTrack(desktopTrack, videoTrack);
        dispatch(setPresenter({ participantId: conference.myUserId(), presenter: false}));
        dispatch(removeLocalTrack(desktopTrack));
        conference.setLocalParticipantProperty("presenting", "stop");
        setPresenting(false);
    }

    const startRaiseHand = () => {
        conference.setLocalParticipantProperty("handraise", "start");
        setRaiseHand(true);
    };

    const stopRaiseHand = () => {
        conference.setLocalParticipantProperty("handraise", "stop");
        setRaiseHand(false);
    };

    useEffect(()=>{
        const interval = setInterval(()=> {
            setTime(formatAMPM(new Date()));
        }, 1000);

        const dbClickHandler = ()=>{
            if ( layout.mode === EXIT_FULL_SCREEN_MODE ){
                enterFullScreen();
            } else {
                exitFullScreen();
            }
        }

        document.addEventListener('dblclick', dbClickHandler);                
        return ()=>{
            clearInterval(interval);
            document.removeEventListener('dblclick', dbClickHandler); 
        }
    },[layout.mode])

    const leaveConference = () => {
        dispatch(clearAllReducers());
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
                <Tooltip title={ raiseHand ? "Hand Down" : "Raise Hand"}>{ raiseHand ? <PanTool style={{color: color.primary}} onClick={stopRaiseHand}/> : <PanTool  onClick={startRaiseHand}/> }</Tooltip>
                <Tooltip title="Leave Call"><CallEndIcon className={classes.end} onClick={leaveConference}/></Tooltip>
                <Tooltip title={ layout.mode === EXIT_FULL_SCREEN_MODE ? "Full Screen": "Exit Full Screen" }>
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
