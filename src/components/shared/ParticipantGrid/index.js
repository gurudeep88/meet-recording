import React, { useEffect } from 'react';
import { Box, makeStyles, Grid } from '@material-ui/core'
import { useSelector } from "react-redux";
import VideoBox from "../VideoBox";
import { calculateRowsAndColumns, getLeftTop, isMobile, isPortrait } from "../../../utils";
import { useWindowResize } from "../../../hooks/useWindowResize";
import { useDocumentSize } from "../../../hooks/useDocumentSize";
import VideoMoreBox from '../VideoMoreBox';

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
            height: "100%",
            [theme.breakpoints.down("sm")]: {
                position: 'relative',
                margin:  'auto',
                marginBottom: '8px',
            }
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
    let participantsArray = [];

    participants.map(participant => participant?.presenter === true ?
        participantsArray.unshift(participant)
        :
        participantsArray.push(participant)
    )

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
                            console.log('i j', i, j, participants.length, participants, participantsArray);
                            return (tracks[participantsArray[i * columns + j]?._id] || participantsArray[i * columns + j]?._id) && <>
                                {isPortrait() ? 
                                <Box key={i * columns + j} className={classes.containerItem} style={{ 
                                    left: isPortrait() ? 0 : getLeftTop(i, j, gridItemWidth, gridItemHeight, offset, lastRowOffset, rows, participantsArray.length, viewportHeight, lastRowWidth, documentHeight).left, 
                                    top: isPortrait() ? 0 : getLeftTop(i, j, gridItemWidth, gridItemHeight, offset, lastRowOffset, rows, participantsArray.length, viewportHeight, lastRowWidth, documentHeight).top, 
                                    width: isPortrait() ? participantsArray.length === 1 ? '100%' : rows === (i - 1) && lastRowWidth ? lastRowWidth : gridItemWidth :  rows === (i - 1) && lastRowWidth ? lastRowWidth : gridItemWidth,
                                    height: gridItemHeight
                                }}>
                                    {/* {countTopSevenParticipants <4 &&  */}
                                    
                                    <VideoBox
                                        height={gridItemHeight}
                                        width={isPortrait() ? participantsArray.length === 1 ? '100%' : rows === (i - 1) && lastRowWidth ? lastRowWidth : gridItemWidth :  rows === (i - 1) && lastRowWidth ? lastRowWidth : gridItemWidth }
                                        isBorderSeparator={participantsArray.length > 1}
                                        isFilmstrip={true}
                                        isPresenter={participantsArray[i * columns + j].presenter ? true : false}
                                        isActiveSpeaker={dominantSpeakerId === participantsArray[i * columns + j]._id}
                                        participantDetails={participantsArray[i * columns + j]?._identity?.user}
                                        participantTracks={tracks[participantsArray[i * columns + j]._id]}
                                        localUserId={conference.myUserId()}
                                        numParticipants = {participantsArray?.length}
                                    />
                                    {/* }
                                    {
                                        countRemainingParticipants === participants?.length && 
                                        <VideoMoreBox
                                        height={gridItemHeight}
                                        width={isPortrait() ? participants.length === 1 ? '100%' : rows === (i - 1) && lastRowWidth ? lastRowWidth : gridItemWidth :  rows === (i - 1) && lastRowWidth ? lastRowWidth : gridItemWidth }
                                        isBorderSeparator={participants.length > 1}
                                        isFilmstrip={true}
                                        isPresenter={participants[i * columns + j].presenter ? true : false}
                                        isActiveSpeaker={dominantSpeakerId === participants[i * columns + j]._id}
                                        participantDetails={participants[i * columns + j]?._identity?.user}
                                        participantTracks={tracks[participants[i * columns + j]._id]}
                                        localUserId={conference.myUserId()}
                                        numParticipants = {participants?.length} 
                                        others={participants?.length-3}
                                        participantsArray={participantsArray}
                                        />
                                     } */}
                                </Box>
                            :
                            <Box key={i * columns + j} className={classes.containerItem} style={{ 
                                left: getLeftTop(i, j, gridItemWidth, gridItemHeight, offset, lastRowOffset, rows, participants.length, viewportHeight, lastRowWidth, documentHeight).left, 
                                top: getLeftTop(i, j, gridItemWidth, gridItemHeight, offset, lastRowOffset, rows, participants.length, viewportHeight, lastRowWidth, documentHeight).top, 
                                width: rows === (i - 1) && lastRowWidth ? lastRowWidth : gridItemWidth,
                                height: gridItemHeight
                            }}>
                                <VideoBox
                                    height={gridItemHeight}
                                    width={ rows === (i - 1) && lastRowWidth ? lastRowWidth : gridItemWidth }
                                    isBorderSeparator={participants.length > 1}
                                    isFilmstrip={true}
                                    isPresenter={participants[i * columns + j].presenter ? true : false}
                                    isActiveSpeaker={dominantSpeakerId === participants[i * columns + j]._id}
                                    participantDetails={participants[i * columns + j]?._identity?.user}
                                    participantTracks={tracks[participants[i * columns + j]._id]}
                                    localUserId={conference.myUserId()}
                                    numParticipants = {participants?.length}
                                />
                            </Box>
                        }
                        </>
                            }
                        )}
                    </>
                )}
            </Grid>
        </Box>
    );
}

export default ParticipantGrid;
