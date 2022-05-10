import React, { useEffect } from 'react';
import { Box, makeStyles, Grid } from '@material-ui/core'
import { useSelector } from "react-redux";
import VideoBox from "../VideoBox";
import { calculateRowsAndColumns, getLeftTop } from "../../../utils";
import { useWindowResize } from "../../../hooks/useWindowResize";

const ParticipantGrid = ({ dominantSpeakerId }) => {
    const layout = useSelector(state => state.layout);
    const useStyles = makeStyles((theme) => ({
        root: {
            justifyContent: "center",
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        },
        container: {
            position: "relative"
        },
        containerItem: {
            position: "absolute",
            width: "100%",
            height: "100%"
        }
    }));

    let { viewportWidth, viewportHeight } = useWindowResize();
    const classes = useStyles();
    const conference = useSelector(state => state.conference);
    const localTracks = useSelector(state => state.localTrack);
    const remoteTracks = useSelector(state => state.remoteTrack);
    const localUser = conference.getLocalUser();

    //merge local and remote track
    const tracks = { ...remoteTracks, [localUser.id]: localTracks };
    // merge local and remote participant
    const participants = [...conference.getParticipantsWithoutHidden(), { _identity: { user: localUser }, _id: localUser.id }];

    const {
        rows,
        columns,
        gridItemWidth,
        gridItemHeight,
        offset,
        lastRowOffset,
        lastRowWidth
    } = calculateRowsAndColumns(conference.getParticipantCount(), viewportWidth, viewportHeight); // get grid item dimension
    // now render them as a grid
    return (
        <Box className={classes.root}>
            <Grid className={classes.container} style={{ height: viewportHeight, width: viewportWidth }} container item>
                {[...Array(rows)].map((x, i) =>
                    <>
                        {[...Array(columns)].map((y, j) => {
                            return (tracks[participants[i * columns + j]?._id] || participants[i * columns + j]?._id) &&
                                <Box className={classes.containerItem} style={{ 
                                    left: getLeftTop(i, j, gridItemWidth, gridItemHeight, offset, lastRowOffset, rows, conference.getParticipantCount(), viewportHeight, lastRowWidth).left, 
                                    top: getLeftTop(i, j, gridItemWidth, gridItemHeight, offset, lastRowOffset, rows, conference.getParticipantCount(), viewportHeight, lastRowWidth).top, 
                                    width: rows === (i - 1) && lastRowWidth ? lastRowWidth : gridItemWidth,
                                    height: gridItemHeight
                                }}>
                                    <VideoBox key={i * columns + j}
                                        height={gridItemHeight}
                                        width={(rows - 1) === i && lastRowWidth ? lastRowWidth : gridItemWidth}
                                        isBorderSeparator={participants.length > 1}
                                        isFilmstrip={true}
                                        isPresenter={layout.presenterParticipantIds.find(item => item === participants[i * columns + j]._id)}
                                        isActiveSpeaker={dominantSpeakerId === participants[i * columns + j]._id}
                                        participantDetails={participants[i * columns + j]?._identity?.user}
                                        participantTracks={tracks[participants[i * columns + j]._id] || []}
                                        localUserId={conference.myUserId()}
                                    />
                                </Box>
                            }
                        )}
                    </>
                )}
            </Grid>
        </Box>
    );
}

export default ParticipantGrid;
