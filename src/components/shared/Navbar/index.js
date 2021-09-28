import {Badge, Box, Drawer, makeStyles, Tooltip, Typography} from "@material-ui/core";
import React, {useState, useEffect} from "react";
import SariskaMediaTransport from "sariska-media-transport";
import {color} from "../../../assets/styles/_color";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import CreateIcon from '@material-ui/icons/Create';
import AlbumIcon from '@material-ui/icons/Album';
import ClosedCaptionIcon from '@material-ui/icons/ClosedCaption';
import DetailsIcon from "@material-ui/icons/Details";
import GroupIcon from '@material-ui/icons/Group';
import CommentIcon from '@material-ui/icons/Comment';
import PublicIcon from '@material-ui/icons/Public';
import DescriptionIcon from '@material-ui/icons/Description';
import Logo from "../Logo";
import CopyLink from "../CopyLink";
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import {useSelector, useDispatch} from "react-redux";
import {setLayout} from "../../../store/actions/layout";
import {GRID, PRESENTATION, SHARED_DOCUMENT, SPEAKER, WHITEBOARD, DROPBOX_APP_KEY} from "../../../constants";
import classnames from "classnames";
import Chat from "../Chat";
import ParticipantDetails from "../ParticipantDetails";
import VirtualBackground from "../VirtualBackground";
import FlipToFrontOutlinedIcon from '@material-ui/icons/FlipToFrontOutlined';
import SettingsIcon from "@material-ui/icons/Settings";
import {withStyles} from '@material-ui/core/styles';
import {unreadMessage} from "../../../store/actions/chat";
import {setPresentationtType} from "../../../store/actions/layout";
import SettingsBox from "../../meeting/Settings";
import {showNotification} from "../../../store/actions/notification";
import googleApi from "../../../utils/google-apis";
import LiveStreamDialog from "../LiveStreamDialog";
import {authorizeDropbox} from "../../../utils/dropbox-apis";
import Whiteboard from "../Whiteboard";

const StyledBadge = withStyles((theme) => ({
    badge: {
        background: color.primary,
        top: 6,
        right: 10
    },
}))(Badge);

const useStyles = makeStyles((theme) => ({
    root: {
        top: 0,
        width: "100%",
        position: "fixed"
    },
    navContainer: {},
    nav: {
        "& .MuiAppBar-colorPrimary": {
            backgroundColor: color.secondaryDark,
            padding: theme.spacing(0, 3),
            boxShadow: "none",
        },
    },
    navbar: {
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
    },
    logoStyle: {},
    logo: {
        display: "flex",
        textDecoration: "none",
        color: color.white,
        alignItems: "center",
        "&:hover": {
            textDecoration: "none",
            color: color.white,
        },
    },
    logoImage: {
        width: "38px",
        height: "38px",
        marginRight: "10px",
    },
    logoText: {},
    toolbar: {
        paddingRight: 0,
        fontSize: "0.9rem",
    },
    link: {
        color: color.white,
        textDecoration: "none",
        display: "block",
        padding: '8px 0px',
        borderRadius: '50%',
        marginRight: '5px',
        "&:hover": {
            color: color.primary,
            background: color.secondary,
            borderRadius: '50%',
        },
        "& svg": {
            verticalAlign: 'middle'
        },
        [theme.breakpoints.down("xs")]: {
            display: "none",
        },
        "&.MuiButton-root": {
            minWidth: '42px'
        }
    },
    title: {
        color: color.secondary,
        fontWeight: '900'
    },
    anchor: {
        color: color.white,
        textDecoration: "none",
        display: "block",
        marginRight: theme.spacing(1),
        "&:hover": {
            color: color.primary,
        },
        [theme.breakpoints.down("xs")]: {
            display: "none",
        },
    },
    button: {
        color: color.white,
        textTransform: "capitalize",
        border: `1px solid ${color.primary}`,
        borderRadius: "15px",
        padding: "5px 20px",
        textDecoration: "none",
        "&:hover": {
            color: color.primary,
        },
    },
    list: {
        width: '360px',
        padding: theme.spacing(3, 0, 0, 0),
    },
    chatList: {
        height: "100%",
        width: '360px',
        padding: theme.spacing(3, 3, 0, 3),
    },
    detailedList: {
        width: '360px',
        padding: theme.spacing(3),
        "& h6": {
            paddingLeft: '10px'
        }
    },
    virtualList: {
        width: '360px',
        padding: theme.spacing(3),
        overflow: "auto"
    },
    settingsList: {
        width: '390px',
        padding: theme.spacing(3, 0, 0, 0),
    },
    drawer: {
        "& .MuiDrawer-paper": {
            overflow: "hidden",
            top: '64px',
            height: '82%',
            right: '10px',
            borderRadius: '10px'
        }
    },
    fullList: {
        width: 'auto',
    },
    drawerVirtualBackground: {
        overflow: "auto!important"
    },
    urlBox: {
        padding: '24px 10px',
        "& h5": {
            fontSize: '1rem',
            fontWeight: '900',
            paddingBottom: theme.spacing(2)
        }
    }
}));


const Navbar = ({dominantSpeakerId}) => {
    const dispatch = useDispatch()
    const conference = useSelector(state => state.conference);
    const layout = useSelector(state => state.layout);
    const avatarColors = useSelector(state => state.color);
    const [streamingSession, setStreamingSession] = useState(false);
    const [recordingSession, setRecordingSession] = useState(false);
    const unread = useSelector(state => state.chat.unreadMessage);
    const classes = useStyles();

    const [state, setState] = React.useState({
        right: false,
    });

    const [chatState, setChatState] = React.useState({
        right: false,
    });

    const [participantState, setParticipantState] = React.useState({
        right: false,
    });

    const [backgroundState, setBackgroundState] = React.useState({
        right: false,
    });

    const [settingsState, setSettingsState] = React.useState({
        right: false,
    });

    const [caption, setCaption] = useState(false);
    const [recording, setRecording] = useState(false);
    const [streaming, setStreaming] = useState(false);
    const [openLivestreamDialog, setOpenLivestreamDialog] = useState(false);
    const [broadcasts, setBroadcasts] = useState([]);
    const [whiteboard, setWhiteboard] = useState(false);
    const [sharedDocument, setSharedDocument] = useState(false);

    const toggleBackgroundDrawer = (anchor, open) => (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setBackgroundState({...backgroundState, [anchor]: open});
    };

    const toggleSettingsDrawer = (anchor, open) => (event) => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setSettingsState({...settingsState, [anchor]: open});
    };

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({...state, [anchor]: open});
    };

    const toggleChatDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setChatState({...chatState, [anchor]: open});
        dispatch(unreadMessage(0));
    };

    const toggleParticipantDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setParticipantState({...participantState, [anchor]: open});
    };

    const toggleView = () => {
       if ( layout.type === SPEAKER  || layout.type === PRESENTATION) {
            dispatch(setLayout(GRID));
       } else if ( sharedDocument  || whiteboard) {
           dispatch(setLayout(PRESENTATION));
       } else {
            dispatch(setLayout(SPEAKER));
       }
    }

    const startStreaming = async () => {
        if (streaming) {
            return;
        }
        const youtubeBroadcasts = await googleApi.requestAvailableYouTubeBroadcasts();

        if (youtubeBroadcasts.status !== 200) {
            dispatch(showNotification({autoHide: true, message: "Could not fetch YouTube broadcasts", severity: "error"}));
            return;
        }

        if (youtubeBroadcasts.result.items.length === 0) {
            dispatch(showNotification({autoHide: true, message : "No live streams found", severity: "info"}));
        }

        setBroadcasts(youtubeBroadcasts.result.items);
        setOpenLivestreamDialog(true);
    }

    const selectedBroadcast = async (boundStreamID, streamKey) => {
        const selectedStream = await googleApi.requestLiveStreamsForYouTubeBroadcast(boundStreamID);
        if (selectedStream.status !== 200) {
            dispatch(showNotification({autoHide: true, message: "Could not fetch YouTube broadcasts", severity: "error"}));
            return;
        }
        const streamName = selectedStream.result.items[0]?.cdn?.ingestionInfo?.streamName;
        setOpenLivestreamDialog(false);

        const session = await conference.startRecording({
            broadcastId: boundStreamID,
            mode: SariskaMediaTransport.constants.recording.mode.STREAM,
            streamId: streamName
        });
        setStreamingSession(session);
    }

    const stopStreaming = async () => {
        if (!streaming) {
            return;
        }
        await conference.stopRecording(streamingSession._sessionID);
        setStreamingSession(null);
    }

    const startRecording = async () => {
        if (recording) {
            return;
        }
        const response = await authorizeDropbox();

        if (!response?.token) {
            return dispatch(showNotification({
                severity: "error",
                message: 'Recording failed no dropbox token'
            }));
        }

        const appData = {
            file_recording_metadata: {
                upload_credentials: {
                        service_name: "dropbox",
                        token: response.token,
                        app_key: DROPBOX_APP_KEY,
                        r_token: response.rToken
                    }
                }
            }

        const session = await conference.startRecording({
            mode: SariskaMediaTransport.constants.recording.mode.FILE,
            appData: JSON.stringify(appData)
        });
        setRecordingSession(session);
    }

    const stopRecording = async () => {
        if (!recording) {
            return;
        }
        setRecordingSession(null);
        await conference.stopRecording(recordingSession._sessionID);
    }

    const startCaption = () => {
        conference.setLocalParticipantProperty("requestingTranscription", true);
    }

    const stopCaption = () => {
        conference.setLocalParticipantProperty("requestingTranscription", false);
    }

    const startWhiteboard = (isRemoteEvent)=>{
        dispatch(setLayout(PRESENTATION));
        setWhiteboard(true);
        dispatch(setPresentationtType({ presentationType:  WHITEBOARD}));
        if (sharedDocument) {
            setSharedDocument(false);
            conference.setLocalParticipantProperty("sharedDocument", "stop");
        }
        if (isRemoteEvent !== true) {
            conference.setLocalParticipantProperty("whiteboard", "start");
        }
    }

    const stopWhiteboard = (isRemoteEvent)=>{
        dispatch(setLayout(SPEAKER));
        setWhiteboard(false);
        if (isRemoteEvent !== true) {
            conference.setLocalParticipantProperty("whiteboard", "stop");
        }
    }

    const startSharedDocument = (isRemoteEvent)=>{
        dispatch(setLayout(PRESENTATION));
        dispatch(setPresentationtType({ presentationType:  SHARED_DOCUMENT}));
        setSharedDocument(true);
        if (whiteboard) {
            setWhiteboard(false);
            conference.setLocalParticipantProperty("whiteboard", "stop");
        }
        if (isRemoteEvent !== true) {
            conference.setLocalParticipantProperty("sharedDocument", "start");
        }
    }

    const stopSharedDocument = (isRemoteEvent)=>{
        dispatch(setLayout(SPEAKER));
        setSharedDocument(false);
        if (isRemoteEvent !== true) { 
            conference.setLocalParticipantProperty("sharedDocument", "stop");
        }
    }


    useEffect(() => {

        conference.getParticipantsWithoutHidden().forEach(item=>{
            if (item._properties?.transcribing) {
                setCaption(true);
            }

            if (item._properties?.recording) {
                setRecording(true);
            }

            if (item._properties?.streaming) {
                setStreaming(true);
            }

            console.log("item._properties?", item._properties);

            if (item._properties?.whiteboard === "start") {
                console.log("item._propertieswhiteboard?", item._properties?.whiteboard);
                startWhiteboard(true);
            }

            if (item._properties?.sharedDocument === "start") {
                console.log("item._propertiessharedDocument?", item._properties?.sharedDocument);
                startSharedDocument(true);
            }
        });

        conference.addEventListener(SariskaMediaTransport.events.conference.PARTICIPANT_PROPERTY_CHANGED, (participant, key, oldValue, newValue) => {
           
            console.log(participant, key, oldValue, newValue)
            
            if (key === "whiteboard" && newValue === "start") {
                startWhiteboard(true);
            }

            if (key === "whiteboard" && newValue === "stop") {
                stopWhiteboard(true);
            }

            if (key === "sharedDocument" && newValue === "stop") {
                stopSharedDocument(true);
            }

            if (key === "sharedDocument" && newValue === "start") {
                startSharedDocument(true);
            }
        });

        conference.addEventListener(SariskaMediaTransport.events.conference.TRANSCRIPTION_STATUS_CHANGED, (status) => {
            if (status === "ON") {
                setCaption(true);
                conference.setLocalParticipantProperty("transcribing");
                dispatch(showNotification({autoHide: true, message: "Caption started"}));
            }

            if (status === "OFF") {
                setCaption(false);
                conference.removeLocalParticipantProperty("transcribing");
                dispatch(showNotification({autoHide: true, message: "Caption stopped"}));
            }
        });

        conference.addEventListener(SariskaMediaTransport.events.conference.RECORDER_STATE_CHANGED, (data) => {
            if (data._status === "on" && data._mode === "stream") {
                setStreaming(true);
                conference.setLocalParticipantProperty("streaming");
                dispatch(showNotification({autoHide: true, message: "Live streaming started"}));
            }

            if (data._status === "off" && data._mode === "stream") {
                setStreaming(false);
                setStreamingSession(null);
                conference.removeLocalParticipantProperty("streaming");
                dispatch(showNotification({autoHide: true, message: "Live streaming stopped"}));
            }

            if (data._status === "on" && data._mode === "file") {
                setRecording(true);
                conference.setLocalParticipantProperty("recording");
                dispatch(showNotification({autoHide: true, message: "Recording started"}));
            }

            if (data._status === "off" && data._mode === "file") {
                setRecordingSession(null);
                setRecording(false);
                conference.removeLocalParticipantProperty("recording");
                dispatch(showNotification({autoHide: true, message: "Recording stopped"}));
            }
        });

    }, []);

    const detailedList = (anchor) => (
        <Box
            className={classes.detailedList}
            role="presentation"
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Typography variant="h6" className={classes.title}>Meeting Info</Typography>
            <Box className={classes.urlBox}>
                <Typography variant="h5" className={classes.title1}>
                    Shared URL
                </Typography>
                <CopyLink onClick={toggleDrawer}/>
            </Box>
        </Box>
    );
    const chatList = (anchor) => (
        <Box
            className={classes.chatList}
            role="presentation"
        >
            <Typography variant="h6" className={classes.title}>Chat Details</Typography>
            <Chat/>
        </Box>
    );
    const participantList = (anchor) => (
        <Box
            className={classes.list}
            role="presentation"
        >
            <Typography variant="h6" className={classes.title} style={{paddingLeft: '24px'}}>Participant
                Details</Typography>
            <ParticipantDetails/>
        </Box>
    );
    const virtualBackgroundList = (anchor) => (
        <Box
            className={classes.virtualList}
            role="presentation"
            onKeyDown={toggleBackgroundDrawer(anchor, false)}
        >
            <VirtualBackground dominantSpeakerId={dominantSpeakerId}/>
        </Box>
    );
    const settingsList = (anchor) => (
        <Box
            className={classes.settingsList}
            role="presentation"
            onKeyDown={toggleSettingsDrawer(anchor, false)}
        >
            <SettingsBox/>
        </Box>
    );

    return (
        <Box id="header" className={classes.root}>
            <Box className={classes.navContainer}>
                <Box className={classes.nav}>
                    <AppBar position="static">
                        <Box className={classes.navbar}>
                            <Logo/>
                            <Box className={classes.navLink}>
                                <Toolbar className={classes.toolbar}>
                                    <Button className={classes.link} onClick={toggleDrawer("right", true)}>
                                        <Tooltip title="Meeting Details">
                                            <DetailsIcon/>
                                        </Tooltip>
                                    </Button>

                                    <Drawer anchor="right" open={state["right"]} onClose={toggleDrawer("right", false)}
                                            className={classes.drawer}>
                                        {detailedList("right")}
                                    </Drawer>

                                    {layout.type === SPEAKER ?
                                        <Button onClick={toggleView} className={classes.link}>
                                            <Tooltip title="Grid View">
                                                <svg
                                                    className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-bnlyqp-MuiSvgIcon-root"
                                                    focusable="false" viewBox="0 0 24 24" aria-hidden="true"
                                                    data-testid="ViewSidebarIcon">
                                                    <path
                                                        d="M16 20H2V4h14v16zm2-12h4V4h-4v4zm0 12h4v-4h-4v4zm0-6h4v-4h-4v4z"></path>
                                                </svg>
                                            </Tooltip>
                                        </Button>
                                        :
                                        <Button onClick={toggleView} className={classes.link}>
                                            <Tooltip title="Speaker View">
                                                <ViewComfyIcon/>
                                            </Tooltip>
                                        </Button>
                                    }
                                    {recording ?
                                        <Button onClick={stopRecording}
                                                className={classnames(classes.link, classes.stopRecording)}>
                                            <Tooltip title="Stop Recording">
                                                <AlbumIcon style={{color: color.red}}/>
                                            </Tooltip>
                                        </Button>
                                        :
                                        <Button onClick={startRecording} className={classes.link}>
                                            <Tooltip title="Start Recording">
                                                <AlbumIcon style={{color: color.white}}/>
                                            </Tooltip>
                                        </Button>
                                    }
                                    {streaming ?
                                        <Button onClick={stopStreaming}
                                                className={classnames(classes.link, classes.stopStreaming)}>
                                            <Tooltip title="Stop Streaming">
                                                <PublicIcon style={{color: color.red}}/>
                                            </Tooltip>
                                        </Button>
                                        :
                                        <Button onClick={startStreaming}
                                                className={classnames(classes.link, classes.stopStreaming)}>
                                            <Tooltip title="Start Streaming">
                                                <PublicIcon style={{color: color.white}} />
                                            </Tooltip>
                                        </Button>
                                    }
                                    {caption ?
                                        <Button onClick={stopCaption} className={classes.link}>
                                            <Tooltip title="Turn off captions">
                                                <ClosedCaptionIcon style={{color: color.red}}/>
                                            </Tooltip>
                                        </Button>
                                        :
                                        <Button onClick={startCaption} className={classes.link}>
                                            <Tooltip title="Turn on captions">
                                                <ClosedCaptionIcon style={{color: color.white}}/>
                                            </Tooltip>
                                        </Button>
                                    }
                                    <Button onClick={toggleParticipantDrawer("right", true)} className={classes.link}>
                                        <Tooltip title="Participants Details">
                                            <GroupIcon/>
                                        </Tooltip>
                                    </Button>
                                    <Drawer anchor="right" open={participantState["right"]}
                                            onClose={toggleParticipantDrawer("right", false)}
                                            className={classes.drawer}>
                                        {participantList("right")}
                                    </Drawer>
                                    <StyledBadge badgeContent={unread}>
                                        <Button onClick={toggleChatDrawer("right", true)} className={classes.link}>
                                            <Tooltip title="Chat Box">
                                                <CommentIcon/>
                                            </Tooltip>
                                        </Button>
                                    </StyledBadge>
                                    <Drawer anchor="right" open={chatState["right"]}
                                            onClose={toggleChatDrawer("right", false)} className={classes.drawer}>
                                        {chatList("right")}
                                    </Drawer>
                                    <Button onClick={toggleBackgroundDrawer("right", true)} className={classes.link}>
                                        <Tooltip title="Virtual Background">
                                            <FlipToFrontOutlinedIcon/>
                                        </Tooltip>
                                    </Button>
                                    <Drawer anchor="right" open={backgroundState["right"]}
                                            onClose={toggleBackgroundDrawer("right", false)} className={classes.drawer}>
                                        {virtualBackgroundList("right")}
                                    </Drawer>
                                    <Button onClick={toggleSettingsDrawer("right", true)} className={classes.link}>
                                        <Tooltip title="Settings">
                                            <SettingsIcon/>
                                        </Tooltip>
                                    </Button>
                                    {whiteboard ?
                                        <Button onClick={stopWhiteboard} className={classes.link}>
                                            <Tooltip title="Stop Whiteboard">
                                                <CreateIcon style={{color: "#27ced7"}}/>
                                            </Tooltip>
                                        </Button>
                                        :
                                        <Button onClick={startWhiteboard} className={classes.link}>
                                            <Tooltip title="Start Whiteboard">
                                                <CreateIcon style={{color: color.white}} />
                                            </Tooltip>
                                        </Button>
                                    }
                                    {sharedDocument ?
                                        <Button onClick={stopSharedDocument}
                                                className={classes.link}>
                                            <Tooltip title="Stop Shared Document">
                                                <DescriptionIcon style={{color: "#27ced7"}}/>
                                            </Tooltip>
                                        </Button>
                                        :
                                        <Button onClick={startSharedDocument}
                                                className={classes.link}>
                                            <Tooltip title="Start Shared Document">
                                                <DescriptionIcon style={{color: color.white}} />
                                            </Tooltip>
                                        </Button>
                                    }
                                    <Drawer anchor="right" open={settingsState["right"]}
                                            onClose={toggleSettingsDrawer("right", false)} className={classes.drawer}>
                                        {settingsList("right")}
                                    </Drawer>
                                </Toolbar>
                            </Box>
                        </Box>
                    </AppBar>
                </Box>
            </Box>
            <LiveStreamDialog open={openLivestreamDialog} broadcasts={broadcasts}
                              selectedBroadcast={selectedBroadcast}/>
        </Box>
    );
};

export default Navbar;
