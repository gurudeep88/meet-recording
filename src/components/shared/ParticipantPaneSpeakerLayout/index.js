import React from 'react';
import {Box, makeStyles} from '@material-ui/core'
import {useSelector} from "react-redux";
import VideoBox from "../VideoBox";
import classnames from "classnames";
import * as Constants from "../../../constants";

const ParticipantPaneSpeakerLayout = ({remoteTracks, localTracks, largeVideoId, dominantSpeakerId, panelHeight, gridWidth, gridHeight}) => {
    const layout = useSelector(state => state.layout);
    const useStyles = makeStyles((theme) => ({
        root: {
            overflowY: "auto",
            alignItems: "center",
            "& > div": {
                marginBottom: layout.mode === Constants.ENTER_FULL_SCREEN_MODE ? "0px" : "16px",
                marginTop: layout.mode === Constants.ENTER_FULL_SCREEN_MODE ? "16px" : "0px"
            }
        }
    }));
    const classes = useStyles();
    const conference = useSelector(state => state.conference);
    const activeClasses = classnames(classes.root, {
        'fullmode': layout.mode === Constants.ENTER_FULL_SCREEN_MODE
    });
    const actualWidth = gridWidth;
    const actualHeight = gridHeight;

    return (
        <Box style={{height: `${panelHeight}px`}} className={activeClasses}>
            {conference.getParticipantsWithoutHidden().map((participant, index) => {
                if (participant._id === largeVideoId) {
                    return <VideoBox localUserId={conference.myUserId()}
                                     isPresenter={layout.presenterParticipantIds.find(item=>item===conference.myUserId())}
                                     isFilmstrip={false}
                                     width={actualWidth}
                                     height={actualHeight}
                                     isActiveSpeaker={dominantSpeakerId===conference.myUserId()}
                                     participantDetails={conference.getLocalUser()}
                                     participantTracks={localTracks}
                                     key={index}
                                     />
                } else {
                    return <VideoBox localUserId={conference.myUserId()}
                                     width={actualWidth}
                                     height={actualHeight}
                                     isPresenter={layout.presenterParticipantIds.find(item=>item===participant._id)}
                                     isFilmstrip={false}
                                     isActiveSpeaker={dominantSpeakerId===participant._id}
                                     participantDetails={participant?._identity?.user}
                                     participantTracks={remoteTracks[participant._id] || []}
                                     key={index}/>
                }
            })}
        </Box>)
}

export default ParticipantPaneSpeakerLayout;
