import {Snackbar} from "@material-ui/core";
import { Box, makeStyles } from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import { color } from '../../../assets/styles/_color';
import MuiAlert from '@material-ui/lab/Alert';
import { useDispatch } from "react-redux";
import { showNotification } from "../../../store/actions/notification";

const useStyles = makeStyles(()=>({
    logo: {
        display: 'flex',
        textDecoration: 'none',
        color: color.white,
        alignItems: 'center',
        "&:hover": {
            textDecoration: 'none',
            color: color.white,
        }
    },
    logoImage: {
        width: '38px',
        height: '38px',
        marginRight: '10px',
    },
    logoText: {
        fontFamily: `'Montserrat', sans-serif`,
        width: 'fit-content',
        height: "63px",
        display: "flex",
        alignItems: "center",
        color: `${color.white}`,
        fontSize: '1.2rem'
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const SnackbarBox = ({notification}) => {
    const  [open, setOpen] = useState({open: false});
    const dispatch = useDispatch();

    useEffect(()=>{
        setOpen(true);
        if (!notification?.autoHide) {
            return;
        }
        setTimeout(()=>{
            setOpen(false);
            dispatch(showNotification({
            message: "",
            severity: "warning",
            autoHide: true
        }))
        }, 2000);
    }, [notification?.message]);

    if (!notification?.message) {
        return null;
    }

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            autoHideDuration={2000}
            open={open}
        >
            <Alert severity={notification.severity}>{notification.message}</Alert>
        </Snackbar>
    )
}

export default SnackbarBox;
