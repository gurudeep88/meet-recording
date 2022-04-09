import React, { useState } from 'react';
import {useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core";
import SariskaMediaTransport from "sariska-media-transport";
import {Tooltip} from '@material-ui/core'


const QUALITY_TO_WIDTH = [
    // full 3 bars
    {
        colorClass: 'status-high',
        percent: 30,
        tip: 'connectionindicator.quality.good',
        width: '100%'
    },

    // 2 bars
    {
        colorClass: 'status-med',
        percent: 10,
        tip: 'connectionindicator.quality.nonoptimal',
        width: '66%'
    },

    // 1 bar
    {
        colorClass: 'status-low',
        percent: 0,
        tip: 'connectionindicator.quality.poor',
        width: '33%'
    }
    // Note: we never show 0 bars as long as there is a connection.
];

const connectionSvgIcon = <svg height="1em" width="1em" viewBox="0 0 32 32">
    <path d="M28 0a4 4 0 014 4v24a4 4 0 01-8 0V4a4 4 0 014-4zM16 8a4 4 0 014 4v16a4 4 0 01-8 0V12a4 4 0 014-4zM4 20a4 4 0 014 4v4a4 4 0 01-8 0v-4a4 4 0 014-4z"></path>
</svg>

const useStyles = makeStyles((theme) => ({
    root: {
         marginLeft: "8px",
        "& svg": {
            fill: "#fff"
        },
        "& .connection-indicator": {
            position: "relative",
            fontSize: "8px",
            textAlign: "center",
            lineHeight: "22px",
            padding: 0,
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            boxSizing: "border-box",
            zIndex: 3,
            background: "#165ecc",
            color: "#fff",
            border: "2px solid #fff"
        },
        "& .indicatoricon": {
            top: "50%",
            transform: "translate(0,-50%)",
            position: "relative",
            display: "inline-block",
            margin: "0 auto",
            left: 0
        },
        "& .connection_empty, .connection_lost": {
            color: "#8B8B8B",
            overflow: "hidden"
        },
        "& .connection_full": {
            color: "#FFFFFF",
            overflow: "hidden",
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
        },
        "& .connection_ninja": {
            color: "#8B8B8B",
            overflow: "hidden"
        },
        "& .icon-gsm-bars": {
            cursor: "pointer",
            fontSize: "1em"
        },
        "& .status-high": {
            background: "green",
        },
        "& .status-med": {
            background: "#FFD740"
        },
        "& .status-lost": {
            background: "gray"
        },
        "& .status-low": {
            background: "#BF2117"
        },
        "& .status-other": {
            background: "#165ecc;"
        }
    }
}));

const ConnectionIndicator = ({participantId}) => {
    let connectionValue = "Connection: Good";
    const classes = useStyles();
    const conference = useSelector(state => state.conference);
    const stats = conference.myUserId() === participantId ? conference.connectionQuality._localStats : conference.connectionQuality._remoteStats[participantId] || {};
    const connectionStatus = conference.participants[participantId]?.getConnectionStatus();

    const getVisibilityClass = () => {
        return connectionStatus === SariskaMediaTransport.constants.participantConnectionStatus.INTERRUPTED
        || connectionStatus === SariskaMediaTransport.constants.participantConnectionStatus.INACTIVE ? 'show-connection-indicator' : 'hide-connection-indicator';
    }

    const visibilityClass = getVisibilityClass();
    
    const rootClassNames = `indicator-container ${visibilityClass}`;

    const getConnectionColorClass = () => {
        
        const {percent} = stats;
        
        const {INACTIVE, INTERRUPTED} = SariskaMediaTransport.constants.participantConnectionStatus;
        
        if (connectionStatus === INACTIVE) {
            connectionValue = "Connection :Low"
            return 'status-other';
        } else if (connectionStatus === INTERRUPTED) {
            connectionValue = "Connection :Lost"
            return 'status-lost';
        } else if (typeof percent === 'undefined') {
            connectionValue = "Connection :High"
            return 'status-high';
        }
        return getDisplayConfiguration(percent).colorClass;
    }

    const colorClass = getConnectionColorClass();
    const indicatorContainerClassNames = `connection-indicator indicator ${colorClass}`;

    const getDisplayConfiguration = (percent) => {
        return QUALITY_TO_WIDTH.find(x => percent >= x.percent) || {};
    }


    const renderIcon = () => {

        if (connectionStatus === SariskaMediaTransport.constants.participantConnectionStatus.INACTIVE) {
            return (
                <span className='connection_ninja'>
                    {connectionSvgIcon}
                </span>
            );
        }

        let iconWidth;

        let emptyIconWrapperClassName = 'connection_empty';

        if (connectionStatus === SariskaMediaTransport.constants.participantConnectionStatus.INTERRUPTED) {
            emptyIconWrapperClassName = 'connection_lost';
            iconWidth = '0%';
        } else if (typeof stats.percent === 'undefined') {
            iconWidth = '100%';
        } else {
            const {percent} = stats;
            iconWidth = getDisplayConfiguration(percent).width;
        }


        return [
            <span
                className={emptyIconWrapperClassName}
                key='icon-empty'>
                {connectionSvgIcon}
            </span>,
            <span
                className='connection_full'
                key='icon-full'
                style={{width: iconWidth}}>
                {connectionSvgIcon}
            </span>
        ];
    }

    const connectionRate = conference.myUserId()=== participantId ? conference.connectionQuality._localStats : conference.connectionQuality._remoteStats[participantId];
    return (
        <div className={classes.root}>
            <Tooltip title={<div style={{fontSize: "bold"}} >{connectionValue} <br /> {connectionRate?.bandwidth?.upload ? <span>Upload Bandwidth: {connectionRate?.bandwidth?.upload}</span> : ''} {connectionRate?.bandwidth?.download ? <><br /><span>Download Bandwidth: {connectionRate?.bandwidth?.download}</span></> : ''}</div>}>
                <div className={rootClassNames}>
                    <div className={indicatorContainerClassNames}
                         style={{fontSize: "8px"}}>
                        <div className='connection indicatoricon'>
                            {renderIcon()}
                        </div>
                    </div>
                </div>
            </Tooltip>
        </div>
    );
}

export default ConnectionIndicator;



