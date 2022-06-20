import React from 'react'
import ParticipantGrid from "../../shared/ParticipantGrid";
import {useSelector} from "react-redux";

const GridLayout = ({dominantSpeakerId}) => {
    const conference = useSelector(state => state.conference);
    const constraints = {
        "colibriClass": "ReceiverVideoConstraints",
        "defaultConstraints": { "maxHeight":  180, "maxFrameRate": 15 }
    }
    conference.setReceiverConstraints(constraints);
    return <ParticipantGrid dominantSpeakerId={dominantSpeakerId} />
}

export default GridLayout;
