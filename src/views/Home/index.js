import React, {useEffect, useState} from "react";

import {makeStyles, Box, Grid} from "@material-ui/core";
import {color} from "../../assets/styles/_color";
import LobbyRoom from "../../components/home/LobbyRoom";
import SariskaMediaTransport from "sariska-media-transport";
import {addLocalTrack} from "../../store/actions/track";
import {useDispatch, useSelector} from "react-redux";
import {setProfile} from "../../store/actions/profile";
import {getMeetingId} from "../../utils";
import { setDevices } from "../../store/actions/media";

const useStyles = makeStyles((theme) => ({
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

    gridContainer: {
        justifyContent: "space-around"
    },
    gridChild: {
        [theme.breakpoints.down("sm")]: {
            width: '100%'
        }
    }
}));

const Home = () => {
    const dispatch = useDispatch();
    const resolution = useSelector(state => state.media?.resolution);
    const localTracksRedux = useSelector(state => state.localTrack);
    SariskaMediaTransport.initialize();
    SariskaMediaTransport.setLogLevel(SariskaMediaTransport.logLevels.ERROR); //TRACE ,DEBUG, INFO, LOG, WARN, ERROR
    const classes = useStyles();
    const [localTracks, setLocalTracks] = useState([]);
    const iAmRecorder = window.location.hash.indexOf("iAmRecorder") >= 0;

    useEffect(() => {
        SariskaMediaTransport.mediaDevices.enumerateDevices((allDevices) => {
          dispatch(setDevices(allDevices));
        });
      }, []);

    useEffect(()=>{
        if (iAmRecorder) {
            console.log('home iAmRecorder', iAmRecorder)
            setLocalTracks([]);
            return;
        }
        if (localTracksRedux.length > 0)  {
            return;
        }
        const createNewLocalTracks = async () => {
            let tracks = [];

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
    },[]);

    return (
        <Box className={classes.root}>
            <Grid className={classes.gridContainer} container>
                <Grid item md={12} className={classes.gridChild}>
                    <Box >
                        <LobbyRoom tracks={localTracks}/>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Home;