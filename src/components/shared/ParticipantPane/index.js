import React from 'react';
import {Box, makeStyles} from '@material-ui/core'
import {useSelector} from "react-redux";
import VideoBox from "../VideoBox";
import classnames from "classnames";
import * as Constants from "../../../constants";


const PartcipantPane = ({remoteTracks, localTracks, dominantSpeakerId, panelHeight, gridItemWidth, gridItemHeight, largeVideoId}) => {
    const conference = useSelector(state => state.conference);
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
    const tracks = { ...remoteTracks, [conference.myUserId()]: localTracks };
    const classes = useStyles();
    const activeClasses = classnames(classes.root, {
        'fullmode': layout.mode === Constants.ENTER_FULL_SCREEN_MODE
    });
    let isPresenter = layout.presenterParticipantIds.length > 0;
    
    console.log("layout.presenterParticipantIds", layout.presenterParticipantIds);

    let remainingPresenters = layout.presenterParticipantIds.slice(0);
    if (layout.pinnedParticipant.isPresenter || isPresenter)  {
        remainingPresenters.pop();
    }
    let participants = [...conference.getParticipantsWithoutHidden(), { _identity: { user: conference.getLocalUser() }, _id: conference.myUserId() }];
    if (!isPresenter)  {
        participants = participants.filter(p=>p._id !== largeVideoId);
    } else {
        let filteredParticipants = participants.filter( p => remainingPresenters.indexOf(p._id) >= 0);
        console.log("filteredParticipants", filteredParticipants);
        filteredParticipants.forEach(p=>{
            participants.push({...p, presenter: true});
        });
        console.log("filteredParticipants after", participants);
    }


    if (participants.length <= 0)  {
        return null;
    }

    return (
        <Box style={{height: `${panelHeight}px`}} className={activeClasses}>
            { participants.map(participant =>               
                <VideoBox 
                    localUserId={conference.myUserId()}
                    width={gridItemWidth}
                    height={gridItemHeight}
                    isPresenter={participant.presenter ? true : false}
                    isFilmstrip={false}
                    isActiveSpeaker={dominantSpeakerId===participant._id}
                    participantDetails={participant?._identity?.user}
                    participantTracks={tracks[participant._id] || []}
                />
            )}
        </Box>)
}

export default PartcipantPane;
