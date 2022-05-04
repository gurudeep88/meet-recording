import React from 'react';
import {Box, makeStyles, Grid} from '@material-ui/core'
import {useSelector} from "react-redux";
import VideoBox from "../VideoBox";
import {calculateRowsAndColumns} from "../../../utils";
import {useWindowResize} from "../../../hooks/useWindowResize";
import * as Constants from "../../../constants";

const ParticipantGrid = ({dominantSpeakerId}) => {
    const layout = useSelector(state => state.layout);
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
            flexDirection: "column"
        }
    }));

    const {viewportWidth, viewportHeight} = useWindowResize();
    
    const classes = useStyles();
    const conference = useSelector(state => state.conference);
    const localTracks = useSelector(state => state.localTrack);
    const remoteTracks = useSelector(state => state.remoteTrack);
    const localUser = conference.getLocalUser();

    //merge local and remote track
    const tracks = {...remoteTracks, [localUser.id]: localTracks };
    // merge local and remote participant
    const participants = [...conference.getParticipantsWithoutHidden(), {_identity: { user: localUser }, _id: localUser.id}];

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
                            { return (tracks[participants[i * columns + j]?._id] ||  participants[i * columns + j]?._id) &&
                                <VideoBox key={i * columns + j}
                                    height={gridItemHeight}
                                    width={gridItemWidth > gridItemHeight* 16/9 ? gridItemHeight* 16/9: gridItemWidth}
                                    isBorderSeparator={participants.length > 1}
                                    isFilmstrip={true}
                                    isPresenter={layout.presenterParticipantIds.find(item=>item===participants[i * columns + j]._id)}
                                    isActiveSpeaker={dominantSpeakerId === participants[i * columns + j]._id}
                                    participantDetails={participants[i * columns + j]?._identity?.user}
                                    participantTracks={tracks[participants[i * columns + j]._id] || []}
                                    localUserId={conference.myUserId()}
                                />
                            }
                        )}
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}

export default ParticipantGrid;
