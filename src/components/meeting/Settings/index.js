import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import SpeakerOutlinedIcon from "@material-ui/icons/SpeakerOutlined";
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import { color } from "../../../assets/styles/_color";
import SelectField from "../../shared/SelectField";
import SariskaMediaTransport from "sariska-media-transport";
import { useDispatch, useSelector } from "react-redux";
import {
    setCamera,
    setMicrophone,
    setYourResolution,
    setSpeaker,
} from "../../../store/actions/media";
import {updateLocalTrack} from "../../../store/actions/track";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={0}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        "aria-controls": `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(0),
    },
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
        padding: "8px 8px 0px 24px",
        "&>div>span": {
            display: "none",
        },
    },
    tab: {
        color: "red",
        padding: "6px 16px",
        "& .MuiTab-wrapper": {
            alignItems: "flex-start",
        },
        "&.Mui-selected": {
            background: color.primary,
            borderRadius: "25px",
            "& svg": {
                color: color.white,
            },
            "& p": {
                color: color.white,
            },
        },
        "&:hover": {
            "& svg": {
                color: color.secondaryDark,
            },
            "& p": {
                color: color.primary,
            },
        },
    },
    setting: {
        padding: theme.spacing(0, 3, 3, 0),
        color: color.secondary,
    },
    title: {
        fontSize: "1.5rem",
        paddingLeft: theme.spacing(3),
        fontWeight: '900'
    },
    marginBottom: {
        marginBottom: theme.spacing(2),
    },
    label: {
        display: "flex",
        alignItems: "center",
        "& svg": {
            color: color.secondary,
            marginRight: theme.spacing(2),
        },
        "& p": {
            textTransform: "capitalize",
            color: color.secondary,
            fontSize: "0.9rem",
        },
    },
    audioIcon: {
        paddingLeft: "3px",
        marginRight: "20px",
    },
    videoIcon: {
        marginRight: "13px",
        fontSize: "2rem",
    },
    list: {
        padding: theme.spacing(3, 3, 3, 3),
        "&>li>div": {
            "&>span": {
                fontSize: "0.9rem",
            },
            "&&>p": {
                fontSize: "0.9rem",
            },
        },
    },
}));

const SettingsBox = () => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [devices, setDevices] = useState([]);
    const [microphoneValue, setMicrophoneValue] = React.useState("");
    const [microphoneOpen, setMicrophoneOpen] = React.useState(false);
    const [speakerValue, setSpeakerValue] = React.useState("");
    const [speakerOpen, setSpeakerOpen] = React.useState(false);
    const [cameraValue, setCameraValue] = React.useState("");
    const [cameraOpen, setCameraOpen] = React.useState(false);
    const [resolutionValue, setResolutionValue] = React.useState("");
    const [resolutionOpen, setResolutionOpen] = React.useState(false);
    const localTracks = useSelector(state => state.localTrack);

    const conference = useSelector(state => state.conference);

    const resolution = useSelector(state => state.media?.resolution);
    const dispatch = useDispatch();

    useEffect(() => {
        SariskaMediaTransport.mediaDevices.enumerateDevices((allDevices) => {
            return setDevices(allDevices);
        });
        setResolutionValue(resolution);
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleMicrophoneChange = (event) => {
        setMicrophoneValue(event.target.value);
        dispatch(setMicrophone(event.target.value));
    };

    const handleMicrophoneClose = () => {
        setMicrophoneOpen(false);
    };

    const handleMicrophoneOpen = () => {
        setMicrophoneOpen(true);
    };

    const handleSpeakerChange = (event) => {
        setSpeakerValue(event.target.value);
        dispatch(setSpeaker(event.target.value));
    };

    const handleSpeakerClose = () => {
        setSpeakerOpen(false);
    };

    const handleSpeakerOpen = () => {
        setSpeakerOpen(true);
    };

    const handleCameraChange = (event) => {
        setCameraValue(event.target.value);
        dispatch(setCamera(event.target.value));
    };

    const handleCameraClose = () => {
        setCameraOpen(false);
    };

    const handleCameraOpen = () => {
        setCameraOpen(true);
    };

    const handleResolutionChange = async (event) => {
        setResolutionValue(event.target.value);
        const item = resolutionList.find(item => item.value === event.target.value);
        dispatch(setYourResolution({resolution: event.target.value, aspectRatio: item.aspectRatio}));
        const videoTrack = localTracks.find(track => track.videoType === "camera");
        const [newVideoTrack] = await SariskaMediaTransport.createLocalTracks({
            devices: ["video"],
            resolution: event.target.value,
        });
        conference.setLocalParticipantProperty("resolution", event.target.value.toString());
        conference.replaceTrack(videoTrack, newVideoTrack);
        dispatch(updateLocalTrack(videoTrack, newVideoTrack));
    };
    
    const handleResolutionClose = () => {
        setResolutionOpen(false);
    };

    const handleResolutionOpen = () => {
        setResolutionOpen(true);
    };

    const microphoneData = {
        label: "Microphone",
        open: microphoneOpen,
        handleClose: handleMicrophoneClose,
        handleOpen: handleMicrophoneOpen,
        value: microphoneValue,
        handleChange: handleMicrophoneChange,
        list: devices
            .filter((device) => device.kind === "audioinput")
            .map((device, index) => ({
                value: device.deviceId,
                label: device.label,
            })),
    };
    const speakerData = {
        label: "Speaker",
        open: speakerOpen,
        handleClose: handleSpeakerClose,
        handleOpen: handleSpeakerOpen,
        value: speakerValue,
        handleChange: handleSpeakerChange,
        list: devices
            .filter((device) => device.kind === "audiooutput")
            .map((device, index) => ({
                value: device.deviceId,
                label: device.label,
            })),
    };
    const cameraData = {
        label: "Camera",
        open: cameraOpen,
        handleClose: handleCameraClose,
        handleOpen: handleCameraOpen,
        value: cameraValue,
        handleChange: handleCameraChange,
        list: devices
            .filter((device) => device.kind === "videoinput")
            .map((device, index) => ({
                value: device.deviceId,
                label: device.label,
            })),
    };
   
    const resolutionList = [
        { value: 2160, label: "Ultra High Definition (4k)", aspectRatio: 9 / 16 },
        { value: 1080, label: "Full High Definition (1080p)", aspectRatio: 9 / 16 },
        { value: 720, label: "High Definition (720p)", aspectRatio: 9 / 16 },
        { value: 480, label: "VGA (480p)", aspectRatio: 9 / 16 },
        { value: 360, label: "Standard Definition (360p)", aspectRatio: 9 / 16 },
        { value: 180, label: "Low Definition (180p)", aspectRatio: 9 / 16 },
    ];

    const resolutionData = {
        label: "Change Resolution",
        open: resolutionOpen,
        handleClose: handleResolutionClose,
        handleOpen: handleResolutionOpen,
        value: resolutionValue,
        handleChange: handleResolutionChange,
        list: resolutionList,
    };

    const audioLabel = (
        <Box className={classes.label}>
            <SpeakerOutlinedIcon className={classes.audioIcon} />
            <Typography className={classes.audioText}>Audio</Typography>
        </Box>
    );
    const videoLabel = (
        <Box className={classes.label}>
            <VideocamOutlinedIcon className={classes.videoIcon} />
            <Typography className={classes.videText}>Video</Typography>
        </Box>
    );
    const audioPanel = (
        <Box className={classes.list}>
            <Box className={classes.marginBottom}>
                <SelectField data={microphoneData} />
            </Box>
            <Box className={classes.marginBottom}>
                <SelectField data={speakerData} />
            </Box>
        </Box>
    );
    const videoPanel = (
        <Box className={classes.list}>
            <Box className={classes.marginBottom}>
                <SelectField data={cameraData} />
            </Box>
            <Box className={classes.marginBottom}>
                <SelectField data={resolutionData} />
            </Box>
        </Box>
    );
    return (
        <Grid container className={classes.container}>
            <Grid item md={12} className={classes.setting}>
                <Typography className={classes.title}>Settings</Typography>
            </Grid>
            <Grid item md={12} className={classes.root}>
                <Tabs
                    variant="scrollable"
                    scrollButtons="auto"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    className={classes.tabs}
                >
                    <Tab
                        disableRipple
                        label={audioLabel}
                        {...a11yProps(0)}
                        className={classes.tab}
                    />
                    <Tab
                        disableRipple
                        label={videoLabel}
                        {...a11yProps(1)}
                        className={classes.tab}
                    />
                </Tabs>
                <TabPanel value={value} index={0}>
                    {audioPanel}
                </TabPanel>
                <TabPanel value={value} index={1}>
                    {videoPanel}
                </TabPanel>
            </Grid>
        </Grid>
    );
};

export default SettingsBox;
