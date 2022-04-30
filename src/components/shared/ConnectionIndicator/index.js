import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Divider, makeStyles } from "@material-ui/core";
import SariskaMediaTransport from "sariska-media-transport";
import { Tooltip } from "@material-ui/core";
import classNames from "classnames";

const QUALITY_TO_WIDTH = [
  // full 3 bars
  {
    colorClass: "status-high",
    percent: 30,
    tip: "connectionindicator.quality.good",
    width: "100%",
  },

  // 2 bars
  {
    colorClass: "status-med",
    percent: 10,
    tip: "connectionindicator.quality.nonoptimal",
    width: "66%",
  },

  // 1 bar
  {
    colorClass: "status-low",
    percent: 0,
    tip: "connectionindicator.quality.poor",
    width: "33%",
  },
  // Note: we never show 0 bars as long as there is a connection.
];

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: "8px",
    "& svg": {
      fill: "#fff",
    },
    "& .connection-indicator": {
      position: "relative",
      fontSize: "8px",
      textAlign: "center",
      lineHeight: "22px",
      padding: 0,
      width: "24px",
      height: "24px",
      borderRadius: "5px",
      boxSizing: "border-box",
      zIndex: 3,
      background: "#165ecc",
      color: "#fff",
    },
    "& .indicatoricon": {
      position: "relative",
      display: "inline-block",
      margin: "0 auto",
      left: 0,
      top: 2,
    },
    "& .connection_empty, .connection_lost": {
      color: "#8B8B8B",
      overflow: "hidden",
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
      overflow: "hidden",
    },
    "& .icon-gsm-bars": {
      cursor: "pointer",
      fontSize: "1em",
    },
    "& .status-high": {
      background: "green",
    },
    "& .status-med": {
      background: "#FFD740",
    },
    "& .status-lost": {
      background: "gray",
    },
    "& .status-low": {
      background: "#BF2117",
    },
    "& .status-other": {
      background: "#165ecc;",
    },
  },
  icon: {
    fontSize: "20px",
  },
  connectionStatus: {
    fontSize: "15px",
    fontWeight: 700,
    margin: '5px 10px',
  },
  connectionTooltipHeader: {
    fontSize: "14px",
    fontWeight: 700,
    margin: '5px 10px',
  },
  connectionTooltip: {
    fontSize: "14px",
    fontWeight: 500,
    margin: '5px 10px',
  },
  tooltipElementContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: 'row',
  },
}));

const ConnectionIndicator = ({ participantId }) => {
  let connectionValue = "Connection : Good";
  const classes = useStyles();
  const conference = useSelector((state) => state.conference);
  const stats =
    conference.myUserId() === participantId
      ? conference.connectionQuality._localStats
      : conference.connectionQuality._remoteStats[participantId] || {};
  const connectionStatus =
    conference.participants[participantId]?.getConnectionStatus();

  const connectionSvgIcon = (
    <span
      className={classNames(
        "material-icons material-symbols-outlined",
        classes.icon
      )}
    >
      signal_cellular_alt
    </span>
  );

  const getVisibilityClass = () => {
    return connectionStatus ===
      SariskaMediaTransport.constants.participantConnectionStatus.INTERRUPTED ||
      connectionStatus ===
        SariskaMediaTransport.constants.participantConnectionStatus.INACTIVE
      ? "show-connection-indicator"
      : "hide-connection-indicator";
  };

  const visibilityClass = getVisibilityClass();

  const rootClassNames = `indicator-container ${visibilityClass}`;

  const getConnectionColorClass = () => {
    const { percent } = stats;

    const { INACTIVE, INTERRUPTED } =
      SariskaMediaTransport.constants.participantConnectionStatus;

    if (connectionStatus === INACTIVE) {
      connectionValue = "Connection : Low";
      return "status-other";
    } else if (connectionStatus === INTERRUPTED) {
      connectionValue = "Connection : Lost";
      return "status-lost";
    } else if (typeof percent === "undefined") {
      connectionValue = "Connection : High";
      return "status-high";
    }
    return getDisplayConfiguration(percent).colorClass;
  };

  const colorClass = getConnectionColorClass();
  const indicatorContainerClassNames = `connection-indicator indicator ${colorClass}`;

  const getDisplayConfiguration = (percent) => {
    return QUALITY_TO_WIDTH.find((x) => percent >= x.percent) || {};
  };

  const renderIcon = () => {
    if (
      connectionStatus ===
      SariskaMediaTransport.constants.participantConnectionStatus.INACTIVE
    ) {
      return <span className="connection_ninja">{connectionSvgIcon}</span>;
    }

    let iconWidth;

    let emptyIconWrapperClassName = "connection_empty";

    if (
      connectionStatus ===
      SariskaMediaTransport.constants.participantConnectionStatus.INTERRUPTED
    ) {
      emptyIconWrapperClassName = "connection_lost";
      iconWidth = "0%";
    } else if (typeof stats.percent === "undefined") {
      iconWidth = "100%";
    } else {
      const { percent } = stats;
      iconWidth = getDisplayConfiguration(percent).width;
    }

    return [
      <span className={emptyIconWrapperClassName} key="icon-empty">
        {connectionSvgIcon}
      </span>,
      <span
        className="connection_full"
        key="icon-full"
        style={{ width: iconWidth }}
      >
        {connectionSvgIcon}
      </span>,
    ];
  };

  const connectionRate =
    conference.myUserId() === participantId
      ? conference.connectionQuality._localStats
      : conference.connectionQuality._remoteStats[participantId];
      
  return (
    <div className={classes.root}>
      <Tooltip
        title={
          <div style={{ fontSize: "bold", width: "250px" }}>
            <span className={classes.connectionStatus}>{connectionValue}</span>{" "}
            <Divider style={{backgroundColor: 'white', margin: '5px'}} />
            <div className={classes.tooltipElementContainer}>
              <p className={classes.connectionTooltipHeader}>Bandwidth: </p>
              <p className={classes.connectionTooltip}>
                Up{" "}
                {connectionRate?.bandwidth?.upload
                  ? connectionRate?.bandwidth?.upload
                  : "N/A"}{" "}
                Down{" "}
                {connectionRate?.bandwidth?.download
                  ? connectionRate?.bandwidth?.download
                  : "N/A"}
              </p>
              </div>
            <div className={classes.tooltipElementContainer}>
            <p className={classes.connectionTooltipHeader}>
              Bitrate:
              </p>
              <p className={classes.connectionTooltip}>Up{" "}
              {connectionRate?.bitrate?.upload
                ? connectionRate?.bitrate?.upload
                : "N/A"}{" "}
              Down{" "}
              {connectionRate?.bitrate?.download
                ? connectionRate?.bitrate?.download
                : "N/A"}
            </p>
            </div>
            <div className={classes.tooltipElementContainer}>
            <p className={classes.connectionTooltipHeader}>
              Packet loss: 
              </p>
              <p className={classes.connectionTooltip}>Up{" "}
              {connectionRate?.packetLoss?.upload
                ? connectionRate?.packetLoss?.upload
                : "N/A"}{" "}
              Down{" "}
              {connectionRate?.packetLoss?.download
                ? connectionRate?.packetLoss?.download
                : "N/A"}
            </p>
            </div>
            <div className={classes.tooltipElementContainer}>
            <p className={classes.connectionTooltipHeader}>
              Resolution: 
              </p>
              <p className={classes.connectionTooltip}>Up{" "}
              {connectionRate?.packetLoss?.upload
                ? connectionRate?.packetLoss?.upload
                : "N/A"}{" "}
              Down{" "}
              {connectionRate?.packetLoss?.download
                ? connectionRate?.packetLoss?.download
                : "N/A"}
            </p>
            </div>
          </div>
        }
      >
        <div className={rootClassNames}>
          <div
            className={indicatorContainerClassNames}
            style={{ fontSize: "8px" }}
          >
            <div className="connection indicatoricon">{renderIcon()}</div>
          </div>
        </div>
      </Tooltip>
    </div>
  );
};

export default ConnectionIndicator;
