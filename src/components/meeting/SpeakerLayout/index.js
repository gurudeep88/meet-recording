import {Box, makeStyles} from '@material-ui/core';
import React from 'react'
import VideoBox from '../../shared/VideoBox';
import ParticipantPane from "../../shared/ParticipantPane";
import {useSelector} from "react-redux";
import {useWindowResize} from "../../../hooks/useWindowResize";
import {useDocumentSize} from "../../../hooks/useDocumentSize";
import classnames from "classnames";
import * as Constants from "../../../constants";

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

    largeVideoId = layout.pinnedParticipant.participantId || layout.presenterParticipantIds.slice(0).pop() || largeVideoId || dominantSpeakerId || myUserId;
    let isPresenter = layout.presenterParticipantIds.find(item=>item===largeVideoId);
    if ( layout.pinnedParticipant.isPresenter === false ) {
        isPresenter = false;
    }

    let participantTracks = remoteTracks[largeVideoId] || localTracks;
    const videoTrack = participantTracks.find(track => track.getVideoType() === "camera");

    const constraints = {
        "lastN": 25,
        "colibriClass": "ReceiverVideoConstraints",
        "selectedSources":  [],
        "defaultConstraints": {"maxHeight": 180 },
        "onStageSources":  [videoTrack?.getSourceName()],
        constraints: {
            [videoTrack?.getSourceName()]:  { "maxHeight": 720 }
        }
    }

    if (isPresenter)  {
        const desktopTrack = participantTracks.find(track => track.getVideoType() === "desktop");
        constraints["onStageSources"] = [desktopTrack?.getSourceName()];
        constraints["selectedSources"] = [desktopTrack?.getSourceName()];
        constraints["constraints"] = { [desktopTrack?.getSourceName()]: { "maxHeight": 2160 }};
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

    let justifyContent = "center";
    if ( layout.presenterParticipantIds.length || conference.getParticipantCount() > 1 ) {
        justifyContent = "space-evenly";
    }    
    return (
        <Box style={{justifyContent}}  className={activeClasses} >
            <VideoBox
                isFilmstrip={true}
                isTranscription={true}
                width={viewportWidth}
                height={viewportHeight}
                isLargeVideo={true}
                isActiveSpeaker={ largeVideoId === dominantSpeakerId }
                isPresenter={isPresenter}
                participantDetails={conference.participants[largeVideoId]?._identity?.user || conference.getLocalUser()}
                participantTracks={participantTracks}
                localUserId={conference.myUserId()}
            />
            <ParticipantPane
                isPresenter={isPresenter}
                panelHeight = {layout.mode === Constants.ENTER_FULL_SCREEN_MODE ? documentHeight - 108 :documentHeight - 88}
                gridItemWidth = {218}    
                gridItemHeight= {123}   
                dominantSpeakerId={dominantSpeakerId} 
                largeVideoId={largeVideoId} 
                localTracks={localTracks} 
                remoteTracks={remoteTracks}
            />
        </Box>
    )
}

export default SpeakerLayout;
