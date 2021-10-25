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

const PinParticipant =  ({pinnedParticipantId, togglePinParticipant, participantId})=>{
    const classes = useStyles();
    return (<Box className={classes.controls}>
        { pinnedParticipantId === participantId ? 
            <Tooltip title="Unpin Partcipant">
                <svg 
                    onClick={()=>togglePinParticipant(null)}  
                    width="24px" 
                    height="24px"   
                    aria-hidden="true" 
                    role="img" 
                    preserveAspectRatio="xMidYMid meet" 
                    viewBox="0 0 24 24"><path d="M2 5.27L3.28 4L20 20.72L18.73 22l-5.93-5.93V22h-1.6v-6H6v-2l2-2v-.73l-6-6M16 12l2 2v2h-.18L8 6.18V4H7V2h10v2h-1v8z" fill="currentColor"/>
                </svg>
            </Tooltip> :
            <Tooltip title="Pin Partcipant">
                 <svg  
                      onClick={()=>togglePinParticipant(participantId)} 
                      width="24px"  
                      height="24px"  
                      aria-hidden="true" 
                      role="img" 
                      preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" fill="currentColor"/>
                  </svg>
            </Tooltip>}
    </Box>);
}

export default PinParticipant;
