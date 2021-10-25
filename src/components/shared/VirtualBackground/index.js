import React, { useState } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {images} from "../../../constants";
import {Tooltip, Typography} from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import Video from "../Video";
import {useSelector} from "react-redux";
import SariskaMediaTransport from "sariska-media-transport";
import {Box, Card, Grid} from "@material-ui/core";
import PowerSettingsNewOutlinedIcon from '@material-ui/icons/PowerSettingsNewOutlined';
import BlurOnOutlinedIcon from '@material-ui/icons/BlurOnOutlined';
import BlurLinearOutlinedIcon from '@material-ui/icons/BlurLinearOutlined';
import ScreenShareOutlinedIcon from '@material-ui/icons/ScreenShareOutlined';
import { color } from '../../../assets/styles/_color';
import {useDispatch} from "react-redux";
import {showNotification} from "../../../store/actions/notification";

const useStyles = makeStyles((theme) => ({
    root: {
        background: "white",
        flexGrow: 1,
        "& img": {
            height: "60px",
            width: '100%',
            borderRadius: '10px'
        },
        width: "100%",
        "& .MuiPaper-rounded": {
            padding: 0
        },
        "& .MuiGrid-item": {
            flexFlow: 0
        }
    },
    backgroundTitle: {
        fontWeight: '900',
        marginBottom: '8px'
    },
    item: {
        cursor: "pointer",
        height: "60px",
        background: "white",
        padding: '5px'
    },
    turn: {
        background: color.secondary,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '8px',
        borderRadius: '15px',
        color: color.white
    },
    light: {
        background: color.secondary,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '8px',
        borderRadius: '15px',
        color: color.white
    },
    background: {
        background: color.secondary,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '8px',
        borderRadius: '15px',
        color: color.white
    },
    screen: {
        background: color.secondary,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '8px',
        borderRadius: '15px',
        color: color.white,
    },
    effectTitle: {
            fontSize: '0.7rem'
    },
    imageItem: {
        cursor: "pointer",
        height: "100%",
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    container: {
        display: "flex",
        marginBottom: '16px'
    },
    mainImagesContainer: {
        display: "flex",
        marginBottom: '16px',
        background: color.lightgray3,
        borderRadius: '5px'
    },
    extraImagesContainer: {
        display: "flex",
        marginBottom: '16px',
        background: color.lightBlue2,
        borderRadius: '5px'
    },
    localVideo: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "360px",
        height: "206px",
        marginBottom: '8px'
    },
    buttonProgress: {
        color: color.primary
    }
}));

export default function VirtualBackground() {
    const classes = useStyles();
    const totalRow = parseInt(images.length / 4);
    const extraRow = images.length % 4;
    const localTracks = useSelector(state => state.localTrack);
    const videoTrack = localTracks.find(track => track.isVideoTrack());
    const [desktopTrack, setDesktopTrack] = useState(null);
    const [loading, setLoading] = useState(null);
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const dispatch = useDispatch()

    const imageBackground = async (url) => {
        if (isSafari) {
            dispatch(showNotification({autoHide: true, message: "Virtual background not supported!!!", severity: "info"}));
            return;
        }
        await videoTrack.setEffect(undefined);
        const options = {
            backgroundEffectEnabled: true,
            backgroundType: "image",
            virtualSource: url
        };
        setLoading(true);
        try {
            const effect = await SariskaMediaTransport.effects.createVirtualBackgroundEffect(options);
            await videoTrack.setEffect(effect);
            setLoading(false);
        } catch(e) {
            console.log("too", e);
        }

    }

    const lightBlurBackground = async () => {
        if (isSafari) {
            dispatch(showNotification({autoHide: true, message: "Virtual background not supported!!!", severity: "info"}));
            return;
        }
        await videoTrack.setEffect(undefined);
        const options = {
            backgroundEffectEnabled: true,
            backgroundType: "blur",
            blurValue: 8
        }
        setLoading(true);
        const effect = await SariskaMediaTransport.effects.createVirtualBackgroundEffect(options);
        await videoTrack.setEffect(effect);
        setLoading(false);
    }

    const blurBackground = async () => {
        if (isSafari) {
            dispatch(showNotification({autoHide: true, message: "Virtual background not supported!!!", severity: "info"}));
            return;
        }
        await videoTrack.setEffect(undefined);
        const options = {
            backgroundEffectEnabled: true,
            backgroundType: "blur",
            blurValue: 25
        }
        setLoading(true);
        const effect = await SariskaMediaTransport.effects.createVirtualBackgroundEffect(options);
        await videoTrack.setEffect(effect);
        setLoading(false);
    }

    const screenSharingBackground = async () => {
        if (isSafari) {
            dispatch(showNotification({autoHide: true, message: "Virtual background not supported!!!", severity: "info"}));
            return;
        }
        await videoTrack.setEffect(undefined);
        const [desktopTrack] = await SariskaMediaTransport.createLocalTracks({devices: ["desktop"]});
        const options = {
            backgroundEffectEnabled: true,
            backgroundType: "desktop-share",
            virtualSource: desktopTrack
        }
        setLoading(true);
        const effect = await SariskaMediaTransport.effects.createVirtualBackgroundEffect(options);
        await videoTrack.setEffect(effect);
        setDesktopTrack(desktopTrack);
        setLoading(false);
    }

    const removeBackground = async () => {
        if (desktopTrack) {
            desktopTrack.dispose();
            setDesktopTrack(null);
        }
        await videoTrack.setEffect(undefined);
    }

    return (
        <Box className={classes.root}>
            <Typography variant="h6" className={classes.backgroundTitle}>Change Background</Typography>
            <div className={classes.localVideo}>
                { loading ? <CircularProgress className={classes.buttonProgress} /> : <Video track={videoTrack}/> }
            </div>
            <Grid container className={classes.container}>
                <Grid item md={6}>
                    <Box onClick={removeBackground} className={classes.item}>
                        <Box className={classes.turn}>
                        <PowerSettingsNewOutlinedIcon />
                        <Typography className={classes.effectTitle}>Turn off</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item md={6}>
                    <Box onClick={lightBlurBackground} className={classes.item}>
                        <Box className={classes.light}>
                        <BlurOnOutlinedIcon />
                        <Typography className={classes.effectTitle}>Light Blur</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item md={6}>
                    <Box onClick={blurBackground} className={classes.item}>
                        <Box className={classes.background}>
                        <BlurLinearOutlinedIcon />
                        <Typography className={classes.effectTitle}>Blur Background</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item md={6}>
                    <Box onClick={screenSharingBackground} className={classes.item}>
                        <Box className={classes.screen}>
                        <ScreenShareOutlinedIcon />
                        <Typography className={classes.effectTitle}>Screen Sharing</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            {[...Array(totalRow)].map((x, i) =>
                <Grid container className={classes.mainImagesContainer}>
                    {[...Array(4)].map((y, j) =>
                        <Grid item md={6}><Box className={classes.imageItem} onClick={() => imageBackground(images[i * 4 + j].url)}>
                            <Tooltip title={images[i * 4 + j].name}>
                                <Box className={classes.paper}><img src={images[i * 4 + j].thumbnail} alt={images[i * 4 + j].name}/></Box></Tooltip>
                                </Box>
                        </Grid>
                    )}
                </Grid>
            )}
            { extraRow &&
                <Grid container className={classes.extraImagesContainer}>
                    {[...Array(extraRow)].map((x, i) =>
                        <Grid item md={6}> <Box className={classes.imageItem} onClick={() => imageBackground(images[(totalRow * 4) + i].url)}>
                            <Tooltip title={images[(totalRow * 4) + i].name}><Box className={classes.paper}><img
                                src={images[(totalRow * 4) + i].thumbnail}
                                alt={images[(totalRow * 4) + i].name}/></Box></Tooltip>
                                </Box>
                        </Grid>
                    )}
                </Grid>
            }
        </Box>
    );
}
