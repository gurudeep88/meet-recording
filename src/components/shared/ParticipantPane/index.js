import React from 'react';
import {Box, makeStyles} from '@material-ui/core'
import {useSelector} from "react-redux";
import VideoBox from "../VideoBox";
import classnames from "classnames";
import * as Constants from "../../../constants";
import {useWindowResize} from "../../../hooks/useWindowResize";

const useStyles = makeStyles((theme) => ({
    root: {
        overflowY: "scroll",
        alignItems: "center",
        maxHeight: "600px",
        "& > div": {
            marginBottom: "15px"
        }
    }
}));

const PartcipantPane = ({remoteTracks, localTracks, largeVideoId, dominantSpeakerId}) => {
    const classes = useStyles();
    const conference = useSelector(state => state.conference);
    const layout = useSelector(state => state.layout);
    const {viewportWidth, viewportHeight} = useWindowResize();
    const activeClasses = classnames(classes.root, {
        'fullmode': layout.mode === Constants.ENTER_FULL_SCREEN_MODE
    });
    return (
        <Box className={activeClasses}>
            {Object.entries(remoteTracks).map(([key, value]) => {
                if (key === largeVideoId) {
                    return <VideoBox localUserId={conference.myUserId()}
                                     isPresenter={conference.myUserId()===layout.presenterParticipantId}
                                     isFilmstrip={false}
                                     width={(viewportWidth/3)*75/100}
                                     height={viewportWidth/3*(75/100)*9/16}
                                     isActiveSpeaker={dominantSpeakerId===conference.myUserId()}
                                     participantDetails={conference.getLocalUser()}
                                     participantTracks={localTracks}/>
                } else {
                    return <VideoBox localUserId={conference.myUserId()}
                                     width={(viewportWidth/3)*75/100}
                                     height={(viewportWidth/3)*75/100*9/16}
                                     isPresenter={key===layout.presenterParticipantId}
                                     isFilmstrip={false}
                                     isActiveSpeaker={dominantSpeakerId===key}
                                     participantDetails={conference.participants[key]?._identity?.user}
                                     participantTracks={value}/>
                }
            })}
        </Box>)
}

export default PartcipantPane;
