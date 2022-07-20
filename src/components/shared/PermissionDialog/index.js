import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import {makeStyles} from "@material-ui/core";
import { color } from '../../../assets/styles/_color';
import FancyButton from '../FancyButton';

const useStyles = makeStyles((theme) => ({
    root: {
        position: "absolute",
        top : 0,
        width: "400px",
        left: 0,
        right: 0,
        margin: "0 auto",
        padding: "50px",
        "& > div" : {
           padding: "20px"
        },
        [theme.breakpoints.down("sm")]: {
            width: '100%',
            padding: "0px",
        }
    },
    card: {
        background: color.secondaryDark,
        color: color.white,
        [theme.breakpoints.down("sm")]: {
            background: color.secondary,
        }
    },
    controls: {
        textAlign: "right",
        marginTop: "20px",
    }
}));

export default function PermissionDialog({displayName, allowLobbyAccess, denyLobbyAccess, userId}) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Card className={classes.card}>
                <div>{displayName} wants to join </div>
                <div className={classes.controls}>
                    <FancyButton buttonText={'Deny'} onClick={()=>denyLobbyAccess(userId)} width="100px" />
                    &nbsp; &nbsp;
                    <FancyButton buttonText={'Allow'} onClick={()=>allowLobbyAccess(userId)} width="100px"/>
                </div>
            </Card>
        </div>
    );
}
