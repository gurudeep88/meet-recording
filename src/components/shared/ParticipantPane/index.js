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
            marginBottom: "15px"
        }
    }
}));

const PartcipantPane = ({remoteTracks, localTracks, dominantSpeakerId, height}) => {
    const classes = useStyles();
    const conference = useSelector(state => state.conference);
    const layout = useSelector(state => state.layout);
    const activeClasses = classnames(classes.root, {
        'fullmode': layout.mode === Constants.ENTER_FULL_SCREEN_MODE
    });
    
    return (
        <Box style={{height: `${height}px`}} className={activeClasses}>
            { conference.getParticipantsWithoutHidden().map(participant => {              
                return <VideoBox localUserId={conference.myUserId()}
                                    width={218}
                                    height={123}
                                    isPresenter={layout.presenterParticipantIds.find(item=>item===participant._id)}
                                    isFilmstrip={false}
                                    isActiveSpeaker={dominantSpeakerId===participant._id}
                                    participantDetails={participant?._identity?.user}
                                    participantTracks={remoteTracks[participant._id] || []}
                        />
            })}
            <VideoBox localUserId={conference.myUserId()}
                    isPresenter={layout.presenterParticipantIds.find(item=>item===conference.myUserId())}
                    isFilmstrip={false}
                    width={218}
                    height={123}
                    isActiveSpeaker={dominantSpeakerId===conference.myUserId()}
                    participantDetails={conference.getLocalUser()}
                    participantTracks={localTracks}
            />
        </Box>)
}

export default PartcipantPane;
