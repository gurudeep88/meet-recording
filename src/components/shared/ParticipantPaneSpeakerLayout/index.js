import React from 'react';
import {Box, makeStyles} from '@material-ui/core'
import {useSelector} from "react-redux";
import VideoBox from "../VideoBox";
import classnames from "classnames";
import * as Constants from "../../../constants";

const useStyles = makeStyles((theme) => ({
    root: {
        overflowY: "auto",
        alignItems: "center",
        "& > div": {
            marginBottom: "22px"
        }
    }
}));


const ParticipantPaneSpeakerLayout = ({remoteTracks, localTracks, largeVideoId, dominantSpeakerId, panelHeight, gridWidth}) => {
    const classes = useStyles();
    const conference = useSelector(state => state.conference);
    const layout = useSelector(state => state.layout);
    const activeClasses = classnames(classes.root, {
        'fullmode': layout.mode === Constants.ENTER_FULL_SCREEN_MODE
    });
    const actaulWidth = gridWidth - 40;
    const actualHeight = actaulWidth * 9/16;

    return (
        <Box style={{height: `${panelHeight}px`}} className={activeClasses}>
            {conference.getParticipantsWithoutHidden().map((participant, index) => {
                if (participant._id === largeVideoId) {
                    return <VideoBox localUserId={conference.myUserId()}
                                     isPresenter={layout.presenterParticipantIds.find(item=>item===conference.myUserId())}
                                     isFilmstrip={false}
                                     width={actaulWidth}
                                     height={actualHeight}
                                     isActiveSpeaker={dominantSpeakerId===conference.myUserId()}
                                     participantDetails={conference.getLocalUser()}
                                     participantTracks={localTracks}
                                     key={index}/>
                } else {
                    return <VideoBox localUserId={conference.myUserId()}
                                     width={actaulWidth}
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
