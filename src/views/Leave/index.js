import { Box, makeStyles, Typography } from '@material-ui/core'
import React, {useEffect} from 'react'
import {Link, useParams} from 'react-router-dom';
import { color } from '../../assets/styles/_color';
import {useSelector} from "react-redux";

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        "& h3":{
            fontSize: '2rem',
            marginBottom: theme.spacing(4)
            }
        },
        rejoin: {
            color: color.primary,
            border: `1px solid ${color.primary}`,
            borderRadius: '10px',
            textTransform: 'capitalize',
            textDecoration:'none',
            padding: theme.spacing(0.5, 2.5)
        },
        goHome: {
                color: color.white,
                textDecoration:'none',
                border: `1px solid ${color.primary}`,
                borderRadius: '10px',
                background: color.primary,
                marginLeft: '20px',
                textTransform: 'capitalize',
                padding: theme.spacing(0.5, 2.5),
                "&:hover": {
                    color: color.primary
                }
            }
    }))
const Leave = () => {
    const meetingTitle  = useSelector(state=>state.profile?.meetingTitle);
    const classes = useStyles();
    const layout  = useSelector(state=>state.layout);

    return (
        <Box className={classes.root}>
            <Typography variant="h3">You have left the meeting</Typography>
            <Box>
                <Link to={`/${meetingTitle}`} className={classes.rejoin}>Rejoin</Link>
                <Link to='/' className={classes.goHome}>Go to Home</Link>
            </Box>
        </Box>
    )
}

export default Leave
