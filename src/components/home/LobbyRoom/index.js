import {
    Box,
    Button,
    makeStyles,
    Snackbar,
    Tooltip,
} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import SariskaMediaTransport from "sariska-media-transport";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import {color} from "../../../assets/styles/_color";
import {useHistory} from "react-router-dom";
import {localTrackMutedChanged} from "../../../store/actions/track";
import {addConference} from "../../../store/actions/conference";
import {getToken,getRandomColor, checkRoom} from "../../../utils";
import {addThumbnailColor} from "../../../store/actions/color";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextInput from "../../shared/TextInput";
import {setProfile, setMeeting} from "../../../store/actions/profile";
import JoinTrack from "../JoinTrack";
import Switch from '@mui/material/Switch';
import {addConnection} from "../../../store/actions/connection"

const label = { inputProps: { 'aria-label': 'Moderator?' } };

const useStyles = makeStyles((theme) => ({
    root: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    permissions: {
        left: "calc(50% - 50px)",
        position: "absolute",
        bottom: "20px",
        "& .MuiSvgIcon-root": {
            border: `1px solid ${color.white}`,
            padding: "12px",
            borderRadius: "50%",
            marginRight: "18px",
            color: color.white,
            "&:hover": {
                background: color.primary,
                cursor: "pointer",
            },
        },
    },
    disable: {
        background: color.red,
        borderColor: `${color.red} !important`,
        "&:hover": {
            opacity: "0.8",
            background: `${color.red} !important`,
        },
    },
    textBox: {
        width: "100%",
    },
    anchor: {
        color: color.secondary,
        textDecoration: "none",
        border: `1px solid ${color.primary}`,
        padding: theme.spacing(1, 5),
        borderRadius: "15px",
        fontWeight: "900",
        textTransform: "capitalize",
        "&:hover": {
            color: color.primary,
        },
    },
    videoContainer: {
        position: "relative"
    },
    wrapper: {
        margin: "0px 0px 12px 0px",
        position: "relative",
        textAlign: "center"
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
        top: "50%",
        left: "50%",
        marginTop: -12,
        marginLeft: -12,
    },
}));
const LobbyRoom = ({tracks}) => {
    const classes = useStyles();
    const history = useHistory();
    const [audioTrack, videoTrack] = useSelector((state) => state.localTrack);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [meetingTitle, setMeetingTitle] = useState("");
    const [moderator, setModerator] = useState(false);
    const [name, setName] = useState("");
    const [buttonText, setButtonText] = useState("Create Meeting");
    const [accessDenied, setAccessDenied] = useState(false);
    const profile = useSelector(state => state.profile);
    const queryParams = useParams();
    const iAmRecorder = window.location.hash.indexOf("iAmRecorder") >= 0;
    const isLoadTesting = window.location.hash.indexOf("isLoadTesting") >= 0;

    const handleTitleChange = (e) => {
        setMeetingTitle(e.target.value.toLowerCase());
    };

    const handleUserNameChange = (e) => {
        setName(e.target.value);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("SARISKA_TOKEN") ? localStorage.getItem("SARISKA_TOKEN")  : await getToken(profile, name, moderator);
        const connection = new SariskaMediaTransport.JitsiConnection(token, meetingTitle, true);
        
        connection.addEventListener(SariskaMediaTransport.events.connection.CONNECTION_ESTABLISHED, () => {
            dispatch(addConnection(connection));
            createConference(connection);
            console.log("createConference")
        });
        
        connection.addEventListener(SariskaMediaTransport.events.connection.CONNECTION_FAILED, async(error) => {
            if (error === SariskaMediaTransport.errors.connection.PASSWORD_REQUIRED) {
                const  token = await getToken(profile, name, moderator)
                connection.setToken(token); // token expired, set a new token
            }
        });
          
        connection.addEventListener(SariskaMediaTransport.events.connection.CONNECTION_DISCONNECTED, (error) => {
            console.log('connection disconnect!!!', error);
        });
          
        connection.connect();
    }

    const createConference = async (connection)=>{   
        const conference = connection.initJitsiConference({
            createVADProcessor: SariskaMediaTransport.effects.createRnnoiseProcessor
        });
        
        await conference.addTrack(audioTrack);
        await conference.addTrack(videoTrack);

        conference.addEventListener(SariskaMediaTransport.events.conference.CONFERENCE_JOINED, () => {
            console.log("CONFERENCE_JOINED")
            setLoading(false);
            dispatch(addConference(conference));
            dispatch(setProfile(conference.getLocalUser()));
            dispatch(setMeeting({meetingTitle}));
            history.push(`/${meetingTitle}`);
        });

        conference.addEventListener(SariskaMediaTransport.events.conference.USER_ROLE_CHANGED, (id) => {
            if (conference.isModerator() && !isLoadTesting) {
                //conference.enableLobby();
            }
        });
        
        conference.addEventListener(SariskaMediaTransport.events.conference.TRACK_ADDED, () => {
            console.log("TRACK_ADDEDTRACK_ADDED");
        });

        conference.addEventListener(SariskaMediaTransport.events.conference.CONFERENCE_ERROR, () => {
            setLoading(false);
        });

        conference.addEventListener(SariskaMediaTransport.events.conference.USER_JOINED, (id) => {
            dispatch(addThumbnailColor({participantId: id, color: getRandomColor()}));
        });

        conference.addEventListener(SariskaMediaTransport.events.conference.CONFERENCE_FAILED, async (error) => {
            if (error === SariskaMediaTransport.errors.conference.MEMBERS_ONLY_ERROR) {
                setButtonText("Asking to join");
                conference.joinLobby(name);
            }

            if (error === SariskaMediaTransport.errors.conference.CONFERENCE_ACCESS_DENIED) {
                setAccessDenied(true);
                setButtonText("Join Meeting");
                setLoading(false);
                setTimeout(() => setAccessDenied(false), 2000);
            }
        });

        conference.join();
    }

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
        setName("recorder");
        setMeetingTitle(queryParams.meetingId);
    }
    
    useEffect(() => {
        if (meetingTitle && (isLoadTesting || iAmRecorder)) {
            handleSubmit();
        }
    }, [meetingTitle]);

    useEffect(() => {
        if (queryParams.meetingId) {
            setButtonText("Join Meeting");
            setMeetingTitle(queryParams.meetingId);
        }
        setName(profile.name);
    }, [profile]);

    return (
        <Box className={classes.root}>
            <Box className={classes.videoContainer}>
                <JoinTrack tracks={tracks}/>
                <Box className={classes.permissions}>
                    {audioTrack?.isMuted() ? (
                        <Tooltip title="Unmute Audio">
                            <MicOffIcon
                                className={classes.disable}
                                onClick={unmuteAudioLocalTrack}
                            />
                        </Tooltip>
                    ) : (
                        <Tooltip title="Mute Audio">
                            <MicIcon onClick={muteAudioLocalTrack}/>
                        </Tooltip>
                    )}
                    {videoTrack?.isMuted() ? (
                        <Tooltip title="Unmute Video">
                            <VideocamOffIcon
                                className={classes.disable}
                                onClick={unmuteVideoLocalTrack}
                            />
                        </Tooltip>
                    ) : (
                        <Tooltip title="Mute Video">
                            <VideocamIcon onClick={muteVideoLocalTrack}/>
                        </Tooltip>
                    )}
                </Box>
                <Switch {...label} defaultChecked />
            </Box>
            <Box className={classes.action}>
                <div className={classes.wrapper}>
                    <Box className={classes.textBox}>
                        <TextInput
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit();
                                }
                            }}
                            label="Meeting Title"
                            width="35ch"
                            value={meetingTitle}
                            onChange={handleTitleChange}
                        />
                        <TextInput
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit();
                                }
                            }}
                            label="Username"
                            width="35ch"
                            value={name}
                            onChange={handleUserNameChange}
                        />
                    </Box>
                    <Button
                        className={classes.anchor}
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {buttonText}
                    </Button>

                    {loading && (
                        <CircularProgress size={24} className={classes.buttonProgress}/>
                    )}
                </div>
            </Box>
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                autoHideDuration={2000}
                open={accessDenied}
                message="Conference access denied by moderator"
            />
        </Box>
    );
};

export default LobbyRoom;
