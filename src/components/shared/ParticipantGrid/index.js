

import React, { useEffect } from 'react';
import { Box, makeStyles, Grid } from '@material-ui/core'
import { useSelector } from "react-redux";
import VideoBox from "../VideoBox";
import { calculateRowsAndColumns, getLeftTop } from "../../../utils";
import { useWindowResize } from "../../../hooks/useWindowResize";
import { useDocumentSize } from "../../../hooks/useDocumentSize";

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
    const classes = useStyles();
    const conference = useSelector(state => state.conference);
    const localTracks = useSelector(state => state.localTrack);
    const remoteTracks = useSelector(state => state.remoteTrack);
    const localUser = conference.getLocalUser();

    // all participants 
    const tracks = { ...remoteTracks, [localUser.id]: localTracks };
    // all tracks
    const participants = [...conference.getParticipantsWithoutHidden(), { _identity: { user: localUser }, _id: localUser.id }];
    participants.filter( p => layout.presenterParticipantIds.indexOf(p._id) >= 0).forEach(p=>{
        participants.push({...p, presenter: true});
    });
    let { viewportWidth, viewportHeight } = useWindowResize(participants.length);
    let { documentWidth, documentHeight } = useDocumentSize();
    const {
        rows,
        columns,
        gridItemWidth,
        gridItemHeight,
        offset,
        lastRowOffset,
        lastRowWidth
    } = calculateRowsAndColumns(participants.length, viewportWidth, viewportHeight); // get grid item dimension
    // now render them as a grid
    return (
        <Box className={classes.root}>
            <Grid className={classes.container} style={{ height: viewportHeight, width: viewportWidth }} container item>
                {[...Array(rows)].map((x, i) =>
                    <>
                        {[...Array(columns)].map((y, j) => {
                            return (tracks[participants[i * columns + j]?._id] || participants[i * columns + j]?._id) &&
                                <Box className={classes.containerItem} style={{ 
                                    left: getLeftTop(i, j, gridItemWidth, gridItemHeight, offset, lastRowOffset, rows, participants.length, viewportHeight, lastRowWidth, documentHeight).left, 
                                    top: getLeftTop(i, j, gridItemWidth, gridItemHeight, offset, lastRowOffset, rows, participants.length, viewportHeight, lastRowWidth, documentHeight).top, 
                                    width: rows === (i - 1) && lastRowWidth ? lastRowWidth : gridItemWidth,
                                    height: gridItemHeight
                                }}>
                                    <VideoBox key={i * columns + j}
                                        height={gridItemHeight}
                                        width={(rows - 1) === i && lastRowWidth ? lastRowWidth : gridItemWidth}
                                        isBorderSeparator={participants.length > 1}
                                        isFilmstrip={true}
                                        isPresenter={participants[i * columns + j].presenter ? true : false}
                                        isActiveSpeaker={dominantSpeakerId === participants[i * columns + j]._id}
                                        participantDetails={participants[i * columns + j]?._identity?.user}
                                        participantTracks={tracks[participants[i * columns + j]._id]}
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