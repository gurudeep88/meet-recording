import {Box, makeStyles, Tooltip} from "@material-ui/core";
import React from "react";
import {color} from "../../../assets/styles/_color";

const useStyles = makeStyles((theme) => ({
    root: {
        boxSizing: "border-box",
        border: "2px solid black",
        background: color.secondary,
        position: "relative",
        display: 'flex',
        flexDirection: 'column'
    },

    controls: {
        cursor: "pointer",
        color: "white",
        height: "24px",
        width: "24px"
    },
    unpin: {
        color: "#27CED7"
    },
    pin: {
        color: "white"
    }
}));

const PinParticipant =  ({pinnedParticipantId, togglePinParticipant, participantId})=>{

    const classes = useStyles();
    return (<Box className={classes.controls}>
        { pinnedParticipantId === participantId ? 
            <Tooltip title="Unpin Partcipant">
                <Box onClick={()=>togglePinParticipant(null)} className={classes.unpin}>
                    <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc" focusable="false" viewBox="0 0 24 24" aria-hidden="true" data-testid="PushPinIcon"><path fillRule="evenodd" d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"></path></svg>
                </Box>
            </Tooltip> :
            <Tooltip title="Pin Partcipant">
                 <Box onClick={()=>togglePinParticipant(participantId)} className={classes.pin}>
                    <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1om0hkc" focusable="false" viewBox="0 0 24 24" aria-hidden="true" data-testid="PushPinIcon"><path fillRule="evenodd" d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"></path></svg>
                </Box>
            </Tooltip>}
    </Box>);
}

export default PinParticipant;
