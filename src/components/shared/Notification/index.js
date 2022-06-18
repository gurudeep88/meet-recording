import {Snackbar} from "@material-ui/core";
import { Box, makeStyles } from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import { color } from '../../../assets/styles/_color';

const useStyles = makeStyles(()=>({
    root: {
        position: "absolute",
        color: color.white,
        alignItems: 'center',
        display: "flex",
        position: "absolute",
        alignItems: "center",
        left: "100px",
        bottom: "50px",
        background: "grey",
        height: "50px",
        paddingLeft: "20px",
        paddingRight: "20px"
    }}));


const Notification = ({snackbar}) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    
    useEffect(()=>{
        if (!snackbar) {
            return;
        }
        setOpen(true);
        if (!snackbar?.autoHide) {
            return;
        }
        setTimeout(()=>setOpen(false), 2000);
    }, [snackbar]);

    return (
        <>
        { open && snackbar.message && <Box className={classes.root}>
            {snackbar.message}
        </Box> }
       </> 
    )
}

export default Notification;
