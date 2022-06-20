import { Button, Grid } from "@material-ui/core";
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
import MicNoneOutlinedIcon from '@material-ui/icons/MicNoneOutlined';
import MicOffOutlinedIcon from '@material-ui/icons/MicOffOutlined';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import {
  setCamera,
  setMicrophone,
  setYourResolution,
  setSpeaker,
} from "../../../store/actions/media";
import { updateLocalTrack } from "../../../store/actions/track";
import { useDocumentSize } from "../../../hooks/useDocumentSize";
import VideoBox from "../../shared/VideoBox";
import Video from "../../shared/Video";
import MicIndicator from "../../shared/MicIndicator";

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
    backgroundColor: color.secondary,
  },
  tabs: {
    padding: "8px 0px 8px 0px",
    "&>div>span": {
      display: "none",
    },
    "& .MuiTabs-scrollable": {
      overflowX: 'hidden'
    },
    "& .MuiTabScrollButton-root": {
      display: 'none'
    }
  },
  tab: {
    height: "36px",
    minHeight: "36px",
    padding: "6px 20px",
    minWidth: "56px",
    border: `1px solid ${color.primaryLight}`,
    borderRadius: "10px",
    color: "#fff",
    "& .MuiTab-wrapper": {
      alignItems: "flex-start",
    },
    "&.Mui-selected": {
      background: color.mainGradient,
      border: `none`,
      padding: "7px 21px",
      "& svg": {
        color: color.white,
      },
      "& p": {
        color: color.white,
      },
    },
    "&:hover": {
      fontWeight: "900",
      background: color.mainGradient,
      border: 'none',
      padding: "7px 21px",
    },
  },
  setting: {
    padding: theme.spacing(0, 3, 3, 0),
    color: color.secondary,
  },
  title: {
    color: color.white,
    fontWeight: "400",
    fontSize: "28px",
    lineHeight: "1",
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  marginBottom: {
    marginBottom: theme.spacing(2),
  },
  label: {
    display: "flex",
    alignItems: "center",
    padding: "4px 14px",
    textTransform: "capitalize",
  },
  audioIcon: {
    paddingLeft: "0px",
    marginRight: "15px",
  },
  videoIcon: {
    marginRight: "13px",
    fontSize: "2rem",
  },
  audioText: {
    paddingTop: "2px",
  },
  videoText: {
    paddingTop: "2px",
  },
  list: {
    padding: theme.spacing(3, 0),
    "&>li>div": {
      "&>span": {
        fontSize: "0.9rem",
      },
      "&&>p": {
        fontSize: "0.9rem",
      },
    },
  },
  display: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  microphone: {
    color: "#fff",
    display: "flex",
    alignItems: "center",
    paddingTop: "27px",
    paddingRight: "3px",
    paddingLeft: "15px",
  },
  offButton: {
    padding: "4px 2px 4px 10px",
    fontSize: "0.875rem",
    color: "#fff",
    borderRadius: "0px",
    textTransform: "capitalize",
  },
  volume: {
    color: color.white,
    border: color.white,
    textTransform: "capitalize",
    paddingLeft: "10px",
    marginTop: "23px",
    marginLeft: '5px',
    "&:hover": {
      opacity: "0.6",
      background: color.lightgray4,
    },
  },
  test: {
    marginLeft: "10px",
  },
  videoWrapper: {
    "& > div": {
      borderRadius: 0,
    },
    "& .rightControls": {
      display: "none",
    },
    "& .userDetails": {
      display: "none",
    },
    "& .audioBox": {
      display: "none",
    },
  },
  muted: {
    color: color.white,
    width: "310px",
    height: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: color.secondaryDark,
    borderRadius: "8px",
    marginTop: "28px",
    "& p": {
      fontSize: "0.9rem",
    },
  },
}));

const SettingsBox = ({ tracks }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [devices, setDevices] = useState([]);
  const [microphoneOpen, setMicrophoneOpen] = React.useState(false);
  const [speakerOpen, setSpeakerOpen] = React.useState(false);
  const [cameraOpen, setCameraOpen] = React.useState(false);
  const [resolutionOpen, setResolutionOpen] = React.useState(false);
  const localTracks = useSelector((state) => state.localTrack);
  const [testText, setTestText] = useState("Test");
  const conference = useSelector((state) => state.conference);
  const [vol, setVol] = useState(0);
  const { resolution, camera, speaker, microphone } = useSelector((state) => state?.media);
  const dispatch = useDispatch();
  const audioTrack = localTracks.find((track) => track.isAudioTrack());
  const videoTrack = localTracks.find((track) => track.isVideoTrack());


  useEffect(() => {
    SariskaMediaTransport.mediaDevices.enumerateDevices((allDevices) => {
      dispatch(setDevices(allDevices));
      return setDevices(allDevices);
    });
  }, []);

  useEffect(() => {
    if (!audioTrack) {
      return;
    }
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(audioTrack.stream);
    const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);
    scriptProcessor.onaudioprocess = function () {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      const arraySum = array.reduce((a, value) => a + value, 0);
      const average = arraySum / array.length;
      setVol(average);
    };
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMicrophoneChange = async (event) => {
    const microphoneDeviceId = event.target.value;
    const [newAudioTrack] = await SariskaMediaTransport.createLocalTracks({
      devices: ["audio"],
      micDeviceId: microphoneDeviceId
    });
    await conference.replaceTrack(audioTrack, newAudioTrack);
    dispatch(updateLocalTrack(audioTrack, newAudioTrack));
    dispatch(setCamera(microphoneDeviceId));
  };

  const handleMicrophoneClose = () => {
    setMicrophoneOpen(false);
  };

  const handleMicrophoneOpen = () => {
    setMicrophoneOpen(true);
  };

  const handleSpeakerChange = (event) => {
    const deviceId = event.target.value;
    dispatch(setSpeaker(deviceId));
    SariskaMediaTransport.mediaDevices.setAudioOutputDevice(deviceId);
  };

  const handleSpeakerClose = () => {
    setSpeakerOpen(false);
  };

  const handleSpeakerOpen = () => {
    setSpeakerOpen(true);
  };

  const handleCameraChange = async (event) => {
      const deviceId = event.target.value;
      const [newVideoTrack] = await SariskaMediaTransport.createLocalTracks({
          devices: ["video"],
          cameraDeviceId: deviceId,
          resolution,
      });
      await conference.replaceTrack(videoTrack, newVideoTrack);
      dispatch(updateLocalTrack(videoTrack, newVideoTrack));
      dispatch(setCamera(deviceId));
  };

  const handleCameraClose = () => {
    setCameraOpen(false);
  };

  const handleCameraOpen = () => {
    setCameraOpen(true);
  };

  const handleResolutionChange = async (event) => {
    const item = resolutionList.find(
      (item) => item.value === event.target.value
    );
    dispatch(
      setYourResolution({
        resolution: event.target.value,
        aspectRatio: item.aspectRatio,
      })
    );

    const [newVideoTrack] = await SariskaMediaTransport.createLocalTracks({
      devices: ["video"],
      resolution: event.target.value,
    });

    conference.setLocalParticipantProperty(
      "resolution",
      event.target.value.toString()
    );
    conference.replaceTrack(videoTrack, newVideoTrack);
    dispatch(updateLocalTrack(videoTrack, newVideoTrack));
  };

  const handleResolutionClose = () => {
    setResolutionOpen(false);
  };

  const handleResolutionOpen = () => {
    setResolutionOpen(true);
  };

  const handleAudioTest = () => {
    setTestText("Playing");
    let audio = new Audio(
      "https://sdk.sariska.io/knock_0b1ea0a45173ae6c10b084bbca23bae2.ogg"
    );
    audio.play();
    setTimeout(() => setTestText("Test"), 500);
  };

  const microphoneData = {
    label: "Microphone",
    open: microphoneOpen,
    handleClose: handleMicrophoneClose,
    handleOpen: handleMicrophoneOpen,
    value: microphone,
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
    value: speaker,
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
    value: camera,
    handleChange: handleCameraChange,
    list: devices
      .filter((device) => device.kind === "videoinput")
      .map((device, index) => ({
        value: device.deviceId,
        label: device.label,
      })),
  };

  const resolutionList = [
    { value: 2160, label: "Ultra High Definition (4k)", aspectRatio: 16 / 9 },
    { value: 1080, label: "Full High Definition (1080p)", aspectRatio: 16 / 9 },
    { value: 720, label: "High Definition (720p)", aspectRatio: 16 / 9 },
    { value: 480, label: "VGA (480p)", aspectRatio: 4 / 3 },
    { value: 360, label: "Standard Definition (360p)", aspectRatio: 16 / 9 },
    { value: 180, label: "Low Definition (180p)", aspectRatio: 16 / 9 },
  ];

  const resolutionData = {
    label: "Change Resolution",
    open: resolutionOpen,
    handleClose: handleResolutionClose,
    handleOpen: handleResolutionOpen,
    value: resolution,
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
      <Typography className={classes.videoText}>Video</Typography>
    </Box>
  );
  const audioPanel = (
    <Box className={classes.list}>
      <Box className={classes.display}>
        <Box style={{ display: "flex" }} className={classes.marginBottom}>
          <SelectField data={microphoneData} minWidth={"200px"} width={"200px"} />
          <Box className={classes.microphone}>
            {audioTrack ? audioTrack?.isMuted() ? <MicOffOutlinedIcon /> : <MicNoneOutlinedIcon /> : null}
            {!audioTrack && (
              <span className={classes.offButton}>
                Check your mic
              </span>
            )}
            {audioTrack && audioTrack?.isMuted() && (
              <span className={classes.offButton}>Mic Off</span>
            )}
            {audioTrack && !audioTrack?.isMuted() && <MicIndicator vol={vol} />}
          </Box>
        </Box>
      </Box>
      <Box className={classes.display}>
        <Box style={{ display: "flex" }} className={classes.marginBottom}>
          <SelectField data={speakerData} minWidth={"200px"} width={"200px"} />
          <Box>
            <Button
              className={classes.volume}
              variant="outlined"
              onClick={handleAudioTest}
            >
              <VolumeUpIcon />
              <span className={classes.test}>{testText}</span>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
  const videoPanel = (
    <Box className={classes.list}>
      <Box className={classes.marginBottom}>
        <SelectField data={cameraData} minWidth={"310px"} />
      </Box>
      <Box className={classes.marginBottom}>
        <SelectField data={resolutionData} minWidth={"310px"} />
      </Box>
      <Box>
        {videoTrack && !videoTrack?.isMuted() && (
          <div
            className={classes.videoWrapper}
            style={{
              width: "312px",
              height: "202px",
              overflow: "hidden",
              position: "relative",
              borderRadius: "7.5px",
              marginTop: "28px",
            }}
          >
            <Video height="100" track={videoTrack} borderRadius="7.5px" />
          </div>
        )}
        {videoTrack?.isMuted() && (
          <Box className={classes.muted}>
            <Typography>Video is muted</Typography>
          </Box>
        )}
        {!videoTrack && (
          <Box className={classes.muted}>
            <Typography>Check your Camera</Typography>
          </Box>
        )}
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
            style={{ marginRight: '4px' }}
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
