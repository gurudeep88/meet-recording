import React from 'react';
import {Box, makeStyles} from '@material-ui/core'
import {useSelector} from "react-redux";
import VideoBox from "../VideoBox";
import classnames from "classnames";
import * as Constants from "../../../constants";
import {useWindowResize} from "../../../hooks/useWindowResize";

const useStyles = makeStyles((theme) => ({
    root: {
        overflowY: "auto",
        alignItems: "center",
        "& > div": {
            marginBottom: "15px"
        }
    }
}));

const ParticipantPaneSpeakerLayout = ({remoteTracks, localTracks, largeVideoId, dominantSpeakerId, height}) => {
    const classes = useStyles();
    const conference = useSelector(state => state.conference);
    const layout = useSelector(state => state.layout);
    const activeClasses = classnames(classes.root, {
        'fullmode': layout.mode === Constants.ENTER_FULL_SCREEN_MODE
    });
    const {viewportWidth, viewportHeight} = useWindowResize();

    return (
        <Box style={{height: `${height}px`}} className={activeClasses}>
            {conference.getParticipantsWithoutHidden().map(participant => {
                if (participant._id === largeVideoId) {
                    return <VideoBox localUserId={conference.myUserId()}
                                     isPresenter={layout.presenterParticipantIds.find(item=>item===conference.myUserId())}
                                     isFilmstrip={false}
                                     width={225}
                                     height={225*9/16}
                                     isActiveSpeaker={dominantSpeakerId===conference.myUserId()}
                                     participantDetails={conference.getLocalUser()}
                                     participantTracks={localTracks}/>
                } else {
                    return <VideoBox localUserId={conference.myUserId()}
                                     width={225}
                                     height={225*9/16}
                                     isPresenter={layout.presenterParticipantIds.find(item=>item===participant._id)}
                                     isFilmstrip={false}
                                     isActiveSpeaker={dominantSpeakerId===participant._id}
                                     participantDetails={participant?._identity?.user}
                                     participantTracks={remoteTracks[participant._id] || []}/>
                }
            })}
        </Box>)
}

export default ParticipantPaneSpeakerLayout;
