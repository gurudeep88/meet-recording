import {Avatar, Box, makeStyles, Typography} from '@material-ui/core'
import React from 'react';
import {color} from '../../../assets/styles/_color';
import MicNoneOutlinedIcon from '@material-ui/icons/MicNoneOutlined';
import MicOffOutlinedIcon from '@material-ui/icons/MicOffOutlined';
import {useSelector} from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '24px'
    },
    title: {
        color: color.secondary,
        fontSize: '0.85rem'
    },
    localBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing(2, 0),
        color: color.secondary,
        "&>svg": {
            color: color.secondary,
        }
    },
    userBox: {
        display: 'flex',
        alignItems: 'center',
        "&>div": {
            width: '30px',
            height: '30px',
            fontSize: '1rem'
        },
        "&>p": {
            fontSize: '0.9rem',
            paddingLeft: '15px'
        }
    }
}))

const ParticipantDetails = () => {
    const classes = useStyles();
    const conference = useSelector(state => state.conference);
    const avatarColors = useSelector(state => state.color);
    const remoteTracks = useSelector(state => state.remoteTrack);
    const localTracks = useSelector(state => state.localTrack);
    const localUser = conference.getLocalUser();

    return (
        <Box className={classes.root}>
            <Typography className={classes.title}>In Meet</Typography>
            <Box className={classes.localBox}>
                <Box className={classes.userBox}>
                    <Avatar src={ localUser?.avatar ? localUser?.avatar: null}  >{localUser?.name?.slice(0, 1).toUpperCase()}</Avatar>
                    <Typography>{ localUser?.name } (You)</Typography>
                </Box>
                {localTracks.find(track=>track.isAudioTrack())?.isMuted() ? <MicOffOutlinedIcon/> : <MicNoneOutlinedIcon/> }
            </Box>
            <Box>
                {Object.entries(conference.participants).map(([key, value]) => {
                    return !value._hidden ? <Box className={classes.localBox}>
                        <Box className={classes.userBox}>
                            <Avatar src={ value?._identity?.user?.avatar ? value?._identity?.user?.avatar: null} style={{background: avatarColors[key]}} >{value?._identity?.user?.name.toUpperCase().slice(0, 1)}</Avatar>
                            <Typography>{value?._identity?.user?.name}</Typography>
                        </Box>
                        {remoteTracks[key]?.find(track=>track.isAudioTrack())?.isMuted() ? <MicOffOutlinedIcon/> : <MicNoneOutlinedIcon/> }
                    </Box> : null}
                )}
            </Box>
        </Box>
    )
}

export default ParticipantDetails
