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
            marginBottom: "16px"
        }
    }
}));

const PartcipantPane = ({remoteTracks, localTracks, dominantSpeakerId, panelHeight, gridItemWidth, gridItemHeight, largeVideoId, isPresenter}) => {
    const classes = useStyles();
    const conference = useSelector(state => state.conference);
    const layout = useSelector(state => state.layout);
    const activeClasses = classnames(classes.root, {
        'fullmode': layout.mode === Constants.ENTER_FULL_SCREEN_MODE
    });
    return (
        <Box style={{height: `${panelHeight}px`}} className={activeClasses}>
            { (largeVideoId !== conference.myUserId() || isPresenter) && <VideoBox localUserId={conference.myUserId()}
                    isPresenter={false}
                    isFilmstrip={false}
                    width={gridItemWidth}
                    height={gridItemHeight}
                    isActiveSpeaker={dominantSpeakerId===conference.myUserId()}
                    participantDetails={conference.getLocalUser()}
                    participantTracks={localTracks}
            />}
            { conference.getParticipantsWithoutHidden().map(participant => {              
                return (largeVideoId === participant._id && !isPresenter)  ? null : <VideoBox 
                            localUserId={conference.myUserId()}
                            width={gridItemWidth}
                            height={gridItemHeight}
                            isPresenter={false}
                            isFilmstrip={false}
                            isActiveSpeaker={dominantSpeakerId===participant._id}
                            participantDetails={participant?._identity?.user}
                            participantTracks={remoteTracks[participant._id] || []}
                        />
            })}
        </Box>)
}

export default PartcipantPane;
