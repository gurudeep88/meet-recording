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
    }
}));

const PinParticipant =  ({pinnedPartcipantId, togglePinParticipant, participantId})=>{
    const classes = useStyles();

    return (<Box className={classes.controls}>
        { pinnedPartcipantId ? <Tooltip title="Unpin Partcipant">
                <svg onClick={()=>togglePinParticipant(null)}
                     className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-bnlyqp-MuiSvgIcon-root"
                     focusable="false"
                     viewBox="0 0 24 24" aria-hidden="true" data-testid="PushPinIcon">
                    <path fill-rule="evenodd"
                          d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"></path>
                </svg>
            </Tooltip> :
            <Tooltip title="Pin Partcipant">
                <svg onClick={()=>togglePinParticipant(participantId)}
                     className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-bnlyqp-MuiSvgIcon-root"
                     focusable="false"
                     viewBox="0 0 24 24" aria-hidden="true" data-testid="PushPinIcon">
                    <path fill-rule="evenodd"
                          d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"></path>
                </svg>
            </Tooltip>}
    </Box>);
}

export default PinParticipant;
