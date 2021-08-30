import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import {makeStyles} from "@material-ui/core";

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
        }
    },
    controls: {
        textAlign: "right",
        marginTop: "20px"
    }
}));

export default function PermissionDialog({displayName, allowLobbyAccess, denyLobbyAccess}) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Card>
                <div>Someone wants to join {displayName}</div>
                <div className={classes.controls}>
                    <Button onClick={allowLobbyAccess}>Allow</Button>
                    <Button onClick={denyLobbyAccess}>Deny</Button>
                </div>
            </Card>
        </div>
    );
}
