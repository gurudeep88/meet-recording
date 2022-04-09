import {Box, makeStyles} from '@material-ui/core';
import React from 'react'
import PartcipantPane from "../../shared/ParticipantPane";
import SharedDocument from '../../shared/SharedDocument';
import Whiteboard from '../../shared/Whiteboard';
import {useSelector} from "react-redux";
import {useWindowResize} from "../../../hooks/useWindowResize";
import classnames from "classnames";
import * as Constants from "../../../constants";
import { useDocumentSize } from '../../../hooks/useDocumentSize';


const useStyles = makeStyles((theme) => ({
    root: {
        justifyContent: "space-evenly",
        alignItems: "center",
        display: "flex",
        "& .fullmode": {
            position: "absolute",
            right: 0,
        },
        "& iframe .hasSecondary": {
           boxShadow: "none",
           borderRadius: "40px"
        }
    }
}));

const PresentationLayout = ({dominantSpeakerId}) => {
    const classes = useStyles();
    const {viewportWidth, viewportHeight} = useWindowResize();
    const {documentWidth, documentHeight} = useDocumentSize();

    const localTracks = useSelector(state => state.localTrack);
    const remoteTracks = useSelector(state => state.remoteTrack);
    const conference = useSelector(state => state.conference);
    const layout = useSelector(state=>state.layout);

    const constraints = {
        "colibriClass": "ReceiverVideoConstraints",
        "defaultConstraints": { "maxHeight":  180 }
    }
    conference.setReceiverConstraints(constraints);

    const activeClasses = classnames(classes.root, {
        'fullmode': layout.mode === Constants.ENTER_FULL_SCREEN_MODE
    });
    
    const height =  layout.mode === Constants.ENTER_FULL_SCREEN_MODE ? documentHeight - 84:  documentHeight -  128;
    const width  = height*16/9;
    return (
        <Box  className={activeClasses}>
            <SharedDocument
                isVisible={layout.presentationType === Constants.SHARED_DOCUMENT}
                conference={conference}
                width={width - 20}
                height={height}
            />
            <Whiteboard
                isVisible={layout.presentationType === Constants.WHITEBOARD}
                conference={conference}
                width={width - 20}
                height={height}
            />
            <PartcipantPane 
                panelHeight = {viewportHeight}
                gridWidth = {layout.mode === Constants.ENTER_FULL_SCREEN_MODE ? documentWidth*20/100: documentWidth - viewportWidth} 
                dominantSpeakerId={dominantSpeakerId} 
                localTracks={localTracks} 
                remoteTracks={remoteTracks}/>
        </Box>
    )
}

export default PresentationLayout;
