import React, {useEffect, useState} from "react";

import {makeStyles, Box, Card, Grid, Typography, Tooltip} from "@material-ui/core";
import {color} from "../../assets/styles/_color";
import LobbyRoom from "../../components/home/LobbyRoom";
import SariskaMediaTransport from "sariska-media-transport";
import {addLocalTrack,remoteAllLocalTracks} from "../../store/actions/track";
import {useDispatch, useSelector} from "react-redux";
import googleApi from "../../utils/google-apis";
import {setProfile} from "../../store/actions/profile";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from '@material-ui/icons/Add';
import {formatAMPM, getMeetingId} from "../../utils";
import microsoftLogo from '../../assets/images/shared/microsoftLogo.svg'; // Tell Webpack this JS file uses this image
import slack from '../../assets/images/shared/slack.png'; // Tell Webpack this JS file uses this image
import { microsoftCalendarApi } from "../../utils/microsoft-apis";
import { conference } from "../../store/reducers/conference";

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

    useEffect(()=>{
        if (localTracksRedux.length > 0)  {
            return;
        }
        const createNewLocalTracks = async () => {
            const options = {
                devices: ["audio", "video"],
                resolution
            };
            const tracks = await SariskaMediaTransport.createLocalTracks(options);
            if (!iAmRecorder) {
                setLocalTracks(tracks);
            }
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
                <Grid item md={6}>
                    <Box className={classes.leftBox}>
                        { loading && <CircularProgress className={classes.buttonProgress} size={24}/> }
                        { !loading && googleAPIData.isSignedIn && <Box className={classes.calenderEntries}>
                            <div className={classes.calenderHeader}>Calendar</div>
                            {!googleAPIData.calenderEntries.find(item=>item.calendarId) && <div className={classes.calenderHeader}>
                                No Calendar entries found for next 30 days
                            </div>}
                            {googleAPIData.calenderEntries.map(item => {
                                return item.calendarId ?
                                    <div className={classes.calenderEntriesRow}>
                                        <div>
                                            <span style={{fontWeight: "bold"}}>{new Date(item.startDate).toDateString().split(' ').slice(1).join(' ')}</span>
                                            <span style={{display: "block"}}><span>{formatAMPM(new Date(item.startDate))}</span> - <span>{formatAMPM(new Date(item.endDate))}</span></span>
                                        </div>
                                        <div>
                                            <span style={{fontWeight: "bold"}}>{item.title}</span>
                                            <span className={classes.rightContainer}>{item.location}</span>
                                        </div>
                                        <Tooltip
                                            title={item.location?.indexOf(`${process.env.REACT_APP_API_SERVICE_HOST_NAME}`) > 0 ? "Join" : "Add a meeting link"}>{item.location?.indexOf(`${process.env.REACT_APP_API_SERVICE_HOST_NAME}`) ?
                                            <AddIcon className={classes.joinBtn}
                                                     onClick={() => Join(item.location)}/> :
                                            (updateCalenderLoader !== item.id ?
                                                <AddIcon className={classes.joinBtn}
                                                         onClick={() => addMeetingLink(item)}/> :
                                                <CircularProgress className={classes.buttonProgress}
                                                                  size={24}/>)}
                                        </Tooltip>
                                    </div> : null
                            })}
                        </Box>}
                        { !loading && !googleAPIData.isSignedIn && <Box className={classes.loginBox}>
                            <div onClick={signInIfNotSignedIn} className={classes.googleBtn}>
                                <div className={classes.googleIconWrapper}>
                                    <img className={classes.googleIcon}
                                         src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                                         alt='uploaded logo'
                                         />
                                </div>
                                <p className={classes.btnText}><b>Sign in with Google</b></p>
                            </div>
                            <div className={classes.separator}>OR</div> 
                            <div onClick={microsoftCalendarApi.signIn} className={classes.microsoftBtn}>
                                <div className={classes.googleIconWrapper}>
                                    <img className={classes.googleIcon}
                                         src={microsoftLogo} 
                                         alt='microsoft logo'
                                    />
                                </div>
                                <p className={classes.btnTextMicrosoft}><b>Sign in with Microsoft</b></p>
                            </div>
                            <div className={classes.bottomText}>
                                Continue with google/microsoft to access your profile, calenders and YouTube live
                                broadcasts.
                            </div>
                        </Box> }
                    </Box>
                    <Box className={classes.slackContainer}>
                        <a href="https://slack.com/oauth/v2/authorize?client_id=884180672320.2771420271893&scope=chat:write,commands,im:write,users:read&user_scope=" >
                            <img className={classes.slackBtn} src={slack} alt='slack'/>
                        </a>
                    </Box>
                </Grid>
                <Grid className={classes.rightContainer} item md={6}>
                    <Box className={classes.cardContainer}>
                        <LobbyRoom tracks={localTracks}/>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Home;
