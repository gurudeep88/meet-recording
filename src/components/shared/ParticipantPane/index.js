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

const PartcipantPane = ({remoteTracks, localTracks, largeVideoId, dominantSpeakerId, height}) => {
    const classes = useStyles();
    const conference = useSelector(state => state.conference);
    const layout = useSelector(state => state.layout);
    const {viewportWidth, viewportHeight} = useWindowResize();
    const activeClasses = classnames(classes.root, {
        'fullmode': layout.mode === Constants.ENTER_FULL_SCREEN_MODE
    });

    return (
        <Box style={{height: `${height}px`}} className={activeClasses}>
            {Object.entries(conference.participants).map(([key, value]) => {
                if (key === largeVideoId) {
                    return <VideoBox localUserId={conference.myUserId()}
                                     isPresenter={conference.myUserId()===layout.presenterParticipantId}
                                     isFilmstrip={false}
                                     width={218}
                                     height={123}
                                     isActiveSpeaker={dominantSpeakerId===conference.myUserId()}
                                     participantDetails={conference.getLocalUser()}
                                     participantTracks={localTracks}/>
                } else {
                    return <VideoBox localUserId={conference.myUserId()}
                                     width={219}
                                     height={123}
                                     isPresenter={key===layout.presenterParticipantId}
                                     isFilmstrip={false}
                                     isActiveSpeaker={dominantSpeakerId===key}
                                     participantDetails={conference.participants[key]?._identity?.user}
                                     participantTracks={remoteTracks[key] || []}/>
                }
            })}
        </Box>)
}

export default PartcipantPane;
