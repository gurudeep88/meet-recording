import React, {useEffect, useState} from "react";

import {makeStyles, Box, Card, Grid, Typography, Tooltip} from "@material-ui/core";
import {color} from "../../assets/styles/_color";
import LobbyRoom from "../../components/home/LobbyRoom";
import SariskaMediaTransport from "sariska-media-transport";
import {addLocalTrack} from "../../store/actions/track";
import {useDispatch, useSelector} from "react-redux";
import googleApi from "../../utils/google-apis";
import {setProfile} from "../../store/actions/profile";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from '@material-ui/icons/Add';
import {formatAMPM, getMeetingId} from "../../utils";

const useStyles = makeStyles((theme) => ({
    googleBtn: {
        cursor: "pointer",
        width: "196px",
        height: "42px",
        marginBottom: "15px",
        backgroundColor: "#4285f4",
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
        overflow: "auto",
        width: "90%",
        background: "#c7ddff",
        borderRadius: "8px",
        height: "450px"
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
    }
}));

const Home = () => {
    const dispatch = useDispatch();
    const resolution = useSelector(state => state.media?.resolution);
    SariskaMediaTransport.initialize();
    SariskaMediaTransport.setLogLevel(SariskaMediaTransport.logLevels.ERROR); //TRACE ,DEBUG, INFO, LOG, WARN, ERROR
    const classes = useStyles();
    const [googleAPIData, setGoogleAPIData] = useState({isSignedIn: false, calenderEntries: []});
    const [localTracks, setLocalTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateCalenderLoader, setUpdateCalenderLoader] = useState(null);

    const options = {
        devices: ["audio", "video"],
        resolution,
        constraints: {
            video: {
                aspectRatio: 16 / 9,
                height: {
                    ideal: 360,
                    max: 720,
                    min: 180
                }
            }
        },
    };

    const signInIfNotSignedIn = async () => {
        const response = await googleApi.signInIfNotSignedIn();
        console.log("response", response);
        const {Rs} = response;
        dispatch(setProfile({id: Rs.GS, name: Rs.Qe, email: Rs.Ct, avatar: Rs.$I}));
        googleAPIData.isSignedIn = true;
        googleAPIData.calenderEntries = await googleApi.getCalendarEntries(0, 30);
        setGoogleAPIData({...googleAPIData});
    }

    const addMeetingLink = async (item) => {
        setUpdateCalenderLoader(item.id);
        const meetingUrl = `https://meet.sariska.io/${getMeetingId()}`;
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
        const createNewLocalTracks = async () => {
            const localTracks = await SariskaMediaTransport.createLocalTracks(options);
            setLocalTracks(localTracks);
            localTracks?.forEach(track => dispatch(addLocalTrack(track)));
        };

        const googleLogin = async () => {
            try {
                googleAPIData.isSignedIn = await googleApi.loadGoogleAPI();
                if (googleAPIData.isSignedIn) {
                    const profile = await googleApi.getCurrentUserProfile();
                    dispatch(setProfile({id: profile.GS, name: profile.mU, email: profile.Ct, avatar: profile.$I}));
                    googleAPIData.calenderEntries = await googleApi.getCalendarEntries(0, 30);
                }
                setGoogleAPIData({...googleAPIData});
            } catch (e) {
                console.log("e", e);
            }
            setLoading(false);
        }
        createNewLocalTracks();
        googleLogin();
    }, []);

    return (
        <Box className={classes.root}>
            <Grid className={classes.gridContainer} container>
                <Grid item md={6}>
                    <Box className={classes.leftBox}>
                        {loading && <CircularProgress className={classes.buttonProgress} size={24}/>}
                        {!loading && googleAPIData.isSignedIn && <Box className={classes.calenderEntries}>
                            <div className={classes.calenderHeader}>Calendar</div>
                            {!googleAPIData.calenderEntries.find(item=>item.calendarId) && <div className={classes.calenderHeader}>
                                No Calendar entries found in next month
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
                                            title={item.location?.indexOf("meet.sariska.io") > 0 ? "Join" : "Add a meeting link"}>{item.location?.indexOf("meet.sariska.io") ?
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
                        {!loading && !googleAPIData.isSignedIn && <Box className={classes.loginBox}>
                            <div onClick={signInIfNotSignedIn} className={classes.googleBtn}>
                                <div className={classes.googleIconWrapper}>
                                    <img className={classes.googleIcon}
                                         src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                                </div>
                                <p className={classes.btnText}><b>Sign in with google</b></p>
                            </div>
                            <div>
                                Continue with google to access your profile, calenders and YouTube live
                                broadcasts.
                            </div>
                        </Box>}
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
