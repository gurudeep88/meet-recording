import {Box, makeStyles} from '@material-ui/core';
import React from 'react'
import VideoBox from '../../shared/VideoBox';
import ParticipantPaneSpeakerLayout from "../../shared/ParticipantPaneSpeakerLayout";
import {useSelector} from "react-redux";
import {useWindowResize} from "../../../hooks/useWindowResize";
import {useDocumentSize} from "../../../hooks/useDocumentSize";
import classnames from "classnames";
import * as Constants from "../../../constants";
import {getVideoWidthHeight} from "../../../utils";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        "& .fullmode": {
            position: "absolute",
            right: '16px',
        }
    }
}));
 
const SpeakerLayout = ({dominantSpeakerId}) => {
    let {viewportWidth, viewportHeight} = useWindowResize();
    const {documentWidth, documentHeight} = useDocumentSize();
    const localTracks = useSelector(state => state.localTrack);
    const remoteTracks = useSelector(state => state.remoteTrack);
    const resolution = useSelector(state => state.media?.resolution);
    const conference = useSelector(state => state.conference);
    const layout = useSelector(state=>state.layout);
    const myUserId = conference.myUserId();
    const classes = useStyles();

    let largeVideoId;
    if ( conference.getParticipantCount() === 2 ) {
        largeVideoId = conference.getParticipantsWithoutHidden()[0]?._id;
    }
    largeVideoId = layout.pinnedParticipantId || layout.presenterParticipantIds.slice(-1).pop() || largeVideoId || dominantSpeakerId || myUserId;

    const constraints = {
        "colibriClass": "ReceiverVideoConstraints",
        "onStageEndpoints":  [largeVideoId],
        "defaultConstraints": { "maxHeight":  180 },
        "constraints": {
            [largeVideoId]: { "maxHeight": layout?.resolution[largeVideoId] || resolution }
        }
    }

    conference.setReceiverConstraints(constraints);
    const activeClasses = classnames(classes.root, {
        'fullmode': layout.mode === Constants.ENTER_FULL_SCREEN_MODE
    });    

    if (conference?.getParticipantCount() === 1  || layout.mode === Constants.ENTER_FULL_SCREEN_MODE) {
        viewportWidth = viewportWidth;
    }  else {
        viewportWidth = viewportWidth - 48; 
    }

    return (
        <Box style={{justifyContent: conference.getParticipantCount() === 1 ? "center" : "space-evenly"}}  className={activeClasses} >
            <VideoBox
                isFilmstrip={true}
                isTranscription={true}
                width={viewportWidth}
                height={viewportHeight}
                isLargeVideo={true}
                isActiveSpeaker={ largeVideoId === dominantSpeakerId }
                isPresenter={layout.presenterParticipantIds.find(item=>item===largeVideoId)}
                participantDetails={conference.participants[largeVideoId]?._identity?.user || conference.getLocalUser()}
                participantTracks={remoteTracks[largeVideoId] || localTracks}
                localUserId={conference.myUserId()}
            />
            {  conference.getParticipantCount() > 1 &&
                <ParticipantPaneSpeakerLayout
                    panelHeight = {layout.mode === Constants.ENTER_FULL_SCREEN_MODE ? documentHeight - 108 :documentHeight - 88}
                    gridWidth = {218}    
                    gridHeight= {123}    
                    dominantSpeakerId={dominantSpeakerId} 
                    largeVideoId={largeVideoId} 
                    localTracks={localTracks} 
                    remoteTracks={remoteTracks}
                />
            }
        </Box>
    )
}

export default SpeakerLayout;
