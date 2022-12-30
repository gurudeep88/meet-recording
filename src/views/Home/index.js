import React, {useEffect, useState} from "react";

import {makeStyles, Box, Card, Grid, Typography, Tooltip} from "@material-ui/core";
import {color} from "../../assets/styles/_color";
import LobbyRoom from "../../components/home/LobbyRoom";
import SariskaMediaTransport from "sariska-media-transport";
import {addLocalTrack} from "../../store/actions/track";
import {useDispatch, useSelector} from "react-redux";
import googleApi from "../../utils/google-apis";
import {setProfile} from "../../store/actions/profile";
import {getMeetingId} from "../../utils";
import { microsoftCalendarApi } from "../../utils/microsoft-apis";
import { setDevices } from "../../store/actions/media";

const useStyles = makeStyles((theme) => ({
    googleBtn: {
        cursor: "pointer",
        width: "210px",
        height: "42px",
        backgroundColor: "#4285f4",
        borderRadius: "2px",
        boxShadow: "0 3px 4px 0 rgba(0,0,0,.25)"
    },
    microsoftBtn: {
        color: "#5e5e5e",
        cursor: "pointer",
        width: "210px",
        height: "42px",
        backgroundColor: "#ffffff",
        borderRadius: "2px",
        boxShadow: "0 3px 4px 0 rgba(0,0,0,.25)"
    },
    googleIconWrapper: {
        position: "absolute",
        marginTop: "1px",
        marginLeft: "1px",
        width: "40px",
        height: "40px",
        borderRadius: "2px",
        backgroundColor: "#fff"
    },
    googleIcon: {
        position: "absolute",
        marginTop: "11px",
        marginLeft: "11px",
        width: "18px",
        height: "18px"
    },
    btnText: {
        float: "right",
        margin: "11px",
        color: "#fff",
        fontSize: "14px"
    },
    btnTextMicrosoft: {
        float: "right",
        margin: "11px",
        color: "#5e5e5e",
        fontSize: "14px"
    },
    root: {
        minHeight: "100vh",
        background: color.secondaryDark,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        [theme.breakpoints.down("sm")]: {
            alignItems: "flex-end",
        }
    },

    cardContainer: {
        [theme.breakpoints.down("xs")]: {
            minWidth: "300px",
        },
        borderRadius: "8px",
        background: "white",
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
    calenderEntries: {
        width: "90%",
        overflow: "auto",
        background: "#c7ddff",
        borderRadius: "8px",
        padding: "11px"
    },
    calenderEntriesRow: {
        background: "#fff",
        boxSizing: "border-box",
        borderRadius: "4px",
        margin: "4px 4px 4px 4px",
        minHeight: "60px",
        width: "calc(100% - 8px)",
        wordBreak: "break-word",
        textAlign: "left",
        fontSize: "14px",
        color: "#253858",
        lineHeight: "20px",
        textOverflow: "ellipsis",
        position: "relative",
        overflow: "auto",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: "10px",
        paddingRight: "10px"
    },
    rightContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    cardHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: theme.spacing(0, 1, 1, 1),
    },
    left: {
        height: '100%',
    },
    leftBox: {
        height: "450px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    calenderHeader: {
        fontSize: "20px",
        color: "black",
        margin: "15px",
    },
    gridContainer: {
        justifyContent: "space-around"
    },
    gridChild: {
        [theme.breakpoints.down("sm")]: {
            width: '100%'
        }
    },
    logo: {
        width: "20px",
        marginTop: "7px",
        marginRight: "8px"
    },
    title: {
        marginLeft: '24px',
        fontSize: '1.8rem',
        width: '190px'
    },
    anchor: {
        color: color.white,
        textDecoration: "none",
        "&:hover": {
            color: color.primary,
        },
    },
    joinBtn: {
        cursor: "pointer",
        color: color.primary
    },
    buttonProgress: {
        color: color.primary
    },
    loginBox: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    bottomText: {
        textAlign: "center",
        padding: "10px"
    },
    separator: {
        padding: "10px"
    },
    slackBtn: {
        cursor: "pointer"
    },
    slackContainer: {
        position: "absolute",
        left: "22px",
        bottom: "22px"
    }
}));

const Home = () => {
    const dispatch = useDispatch();
    const resolution = useSelector(state => state.media?.resolution);
    const localTracksRedux = useSelector(state => state.localTrack);
    SariskaMediaTransport.initialize();
    SariskaMediaTransport.setLogLevel(SariskaMediaTransport.logLevels.ERROR); //TRACE ,DEBUG, INFO, LOG, WARN, ERROR
    const classes = useStyles();
    const [googleAPIData, setGoogleAPIData] = useState({isSignedIn: false, calenderEntries: []});
    const [localTracks, setLocalTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateCalenderLoader, setUpdateCalenderLoader] = useState(null);
    const iAmRecorder = window.location.hash.indexOf("iAmRecorder") >= 0;

    const signInIfNotSignedIn = async () => {
        await googleApi.signInIfNotSignedIn();
        const profile = await googleApi.getCurrentUserProfile();
        dispatch(setProfile({id: profile.getId(), name: profile.getName(), email: profile.getEmail(), avatar: profile.getImageUrl()}));
        googleAPIData.isSignedIn = true;
        googleAPIData.calenderEntries = await googleApi.getCalendarEntries(0, 30);
        setGoogleAPIData({...googleAPIData});
    }
    
    const addMeetingLink = async (item) => {
        setUpdateCalenderLoader(item.id);
        const meetingUrl = `https://${process.env.REACT_APP_API_SERVICE_HOST_NAME}/${getMeetingId()}`;
        const text = `Click the following link to join the meeting:\n${meetingUrl}`;
        await googleApi.updateCalendarEntry(item.id, item.calendarId, meetingUrl, text);
        googleAPIData.calenderEntries = await googleApi.getCalendarEntries(0, 30);

        setGoogleAPIData({...googleAPIData});
        setUpdateCalenderLoader(null);
    }

    const Join = async (meetingUrl) => {
        window.location.href = meetingUrl;
    }

    useEffect(() => {
        SariskaMediaTransport.mediaDevices.enumerateDevices((allDevices) => {
          dispatch(setDevices(allDevices));
        });
      }, []);

    useEffect(()=>{
        if (iAmRecorder) {
            setLocalTracks([]);
            return;
        }
        if (localTracksRedux.length > 0)  {
            return;
        }
        const createNewLocalTracks = async () => {
            let tracks = [];
            const options = {
                devices: ["audio", "video"],
                resolution
            };

            try  {
                const [audioTrack] = await SariskaMediaTransport.createLocalTracks({devices: ["audio"], resolution});
                tracks.push(audioTrack);
            } catch(e) {
                console.log("failed to fetch audio device");
            }

            try  {
                const [videoTrack]  = await SariskaMediaTransport.createLocalTracks({devices: ["video"], resolution});
                tracks.push(videoTrack);
            } catch(e) {
                console.log("failed to fetch video device");
            }
            setLocalTracks(tracks);
            tracks.forEach(track=>dispatch(addLocalTrack(track)));
        };
        createNewLocalTracks();
    },[])

    useEffect(() => {
        const googleLogin = async () => {
            try {
                googleAPIData.isSignedIn = await googleApi.loadGoogleAPI();
                if (googleAPIData.isSignedIn) {
                    const profile = await googleApi.getCurrentUserProfile();
                    dispatch(setProfile({id: profile.getId(), name: profile.getName(), email: profile.getEmail(), avatar: profile.getImageUrl()}));
                    googleAPIData.calenderEntries = await googleApi.getCalendarEntries(0, 30);
                }
                setGoogleAPIData({...googleAPIData});
            } catch (e) { }
            setLoading(false);
        }

        const microsoftLogin = async () => {
            try {
                const response = await microsoftCalendarApi?.isSignedIn();
            } catch (e) {}
            setLoading(false);
        }

        googleLogin();
        microsoftLogin();
    }, []);

    return (
        <Box className={classes.root}>
            <Grid className={classes.gridContainer} container>
                <Grid item md={12} className={classes.gridChild}>
                    <Box >
                        { localTracks.length > 0 && <LobbyRoom tracks={localTracks}/>} 
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Home;