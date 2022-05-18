import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import {makeStyles} from '@material-ui/core/styles';
import {Avatar, Box, Button, Typography} from '@material-ui/core';
import {color} from '../../../assets/styles/_color';
import classNames from 'classnames';
import SnackbarBox from '../Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { showNotification } from '../../../store/actions/notification';


const useStyles = makeStyles((theme) => ({
    iconContainer: {
        padding: '8px 12px 4px 12px',
        border: `1px solid transparent`,
        background: color.secondary,
        borderRadius: '48px',
        "&:hover": {
          opacity: '0.8',
          cursor: 'pointer',
          border: `1px solid ${color.primaryLight}`,
          background: color.secondaryDark,
        }
      },
}));
const CopyMeetingLink = () => {
    const classes = useStyles();
    const [copySuccess, setCopySuccess] = useState('');
    const textToCopy = window.location.href;
    const notification = useSelector(state => state.notification);
    const dispatch = useDispatch();

    function copyToClipboard() {
        navigator.clipboard.writeText(textToCopy);
        setCopySuccess('successfully copied');
        dispatch(showNotification({
            message: "successfully copied",
            severity: "info",
            autoHide: true
        }))
    }

    return (
        <Box className={classes.iconContainer} onClick={copyToClipboard}>
            <span className={classNames("material-icons material-icons-outlined", classes.icon)}>content_copy</span>
                <Box>
                    <SnackbarBox notification={notification} />
                </Box>
        </Box>
    )
}

export default CopyMeetingLink

