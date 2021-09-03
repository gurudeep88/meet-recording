import React from 'react';
import {Box, makeStyles, Grid} from '@material-ui/core'
import {useSelector} from "react-redux";
import VideoBox from "../VideoBox";
import {calculateRowsAndColumns} from "../../../utils";
import {useWindowResize} from "../../../hooks/useWindowResize";

const useStyles = makeStyles((theme) => ({
    row: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    root: {
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        "& .gridSeparator": {
            border: "2px solid black"
        },
        "& .activeSpeaker": {
            border: "2px solid #44A5FF"
        }
    }
}));

const ParticipantGrid = ({dominantSpeakerId}) => {
    const {viewportWidth, viewportHeight} = useWindowResize();
    const classes = useStyles();
    const conference = useSelector(state => state.conference);
    const localTracks = useSelector(state => state.localTrack);
    const remoteTracks = useSelector(state => state.remoteTrack);
    const localUser = conference.getLocalUser();
    const layout = useSelector(state => state.layout);

    //merge local and remote track
    let tracks = {
        ...remoteTracks,
        [localUser.id]: localTracks
    };

    // merge local and remote participant
    const participants = {
        ...conference.participants,
        [localUser.id]: {_identity: {user: {name: localUser.name, id: localUser.id}}, _id: localUser.id}
    };


    const participantIds = Object.keys(tracks);
    const {
        rows,
        columns,
        gridItemWidth,
        gridItemHeight,
    } = calculateRowsAndColumns(conference.getParticipantCount(), viewportWidth, viewportHeight); // get grid item dimension

    // now render them as a grid
    return (
        <Box className={classes.root}>
            <Grid container item>
                {[...Array(rows)].map((x, i) =>
                    <Grid className={classes.row} key={i} item>
                        {[...Array(columns)].map((y, j) =>
                            { return tracks[participantIds[i * columns + j]] ?
                                <VideoBox key={i * columns + j}
                                    height={gridItemHeight}
                                    width={gridItemWidth}
                                    isBorderSeparator={participantIds.length !== 1}
                                    isFilmstrip={true}
                                    isPresenter={layout.presenterParticipantId === participantIds[i * columns + j]}
                                    isActiveSpeaker={dominantSpeakerId === participantIds[i * columns + j]}
                                    participantDetails={participants[participantIds[i * columns + j]]?._identity?.user}
                                    participantTracks={tracks[participantIds[i * columns + j]]}
                                    localUserId={conference.myUserId()}
                                /> : null }
                        )}
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}

export default ParticipantGrid;
