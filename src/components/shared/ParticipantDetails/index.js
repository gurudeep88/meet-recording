import {
  Avatar,
  Box,
  Button,
  Divider,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { color } from "../../../assets/styles/_color";
import MicNoneOutlinedIcon from "@material-ui/icons/MicNoneOutlined";
import MicOffOutlinedIcon from "@material-ui/icons/MicOffOutlined";
import { useDispatch, useSelector } from "react-redux";
import SearchBox from "../SearchBox";
import classnames from "classnames";
import CopyMeetingLink from "../CopyMeetingLink";
import {MenuBox} from "../MenuBox";
import {setPinParticipant} from "../../../store/actions/layout";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "95%",
  },
  title: {
    color: color.secondary,
    fontSize: "0.85rem",
  },
  localBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(2, 0),
    color: color.white,
  },
  userBoxContainer: {
    display: "flex",
    flexDirection: "column",
    "& span": {
      marginLeft: "10px",
    },
  },
  userBox: {
    display: "flex",
    alignItems: "center",
    "&>div.MuiAvatar-root": {
      width: "30px",
      height: "30px",
      fontSize: "1rem",
    },
    "& p": {
      fontSize: "0.9rem",
    },
  },
  hostDetails: {
    display: "flex",
    flexDirection: "row",
  },
  hostBox: {
    display: "inline-flex",
    width: "auto !important",
    marginLeft: "10px",
    height: "23px !important",
  },
  iconBox: {
    display: "flex",
    alignItems: "center",
    "&>svg": {
      color: color.white,
      fontSize: "1.35rem",
    },
  },
  more: {
    marginLeft: theme.spacing(1),
    "&:hover": {
      color: color.primaryLight,
      cursor: "pointer",
    },
  },
  divider: {
    backgroundColor: color.search,
    marginTop: "auto",
    marginBottom: theme.spacing(2),
  },
  meetingDetailsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    color: color.white,
  },
  meetingDetails: {
    marginLeft: theme.spacing(1),
    color: color.white,
    "& p": {
      color: color.primaryLight,
    },
    "& span": {
      fontWeight: 300,
    },
  },
  pin: {
    color: color.primary
  },
  iconContainer: {
    padding: "8px 12px 4px 12px",
    border: `1px solid transparent`,
    background: color.secondary,
    borderRadius: "48px",
    "&:hover": {
      opacity: "0.8",
      cursor: "pointer",
      border: `1px solid ${color.primaryLight}`,
      background: color.secondaryDark,
    },
  },
}));

const ParticipantDetails = () => {
  const classes = useStyles();
  const conference = useSelector((state) => state.conference);
  const avatarColors = useSelector((state) => state.color);
  const remoteTracks = useSelector((state) => state.remoteTrack);
  const localTracks = useSelector((state) => state.localTrack);
  const layout = useSelector((state) => state.layout);
  const localUser = conference.getLocalUser();
  const [participantName, setParticipantName] = useState("");
  const [participants, setParticipants] = useState([
    localUser?.name?.toLowerCase(),
    ...conference
      .getParticipantsWithoutHidden()
      .map((participant) => participant?._identity?.user?.name?.toLowerCase()),
  ]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const { pinnedParticipantId, raisedHandParticipantIds } = useSelector(state => state.layout);
  const participantDetails = conference.participants?._identity?.user || conference.getLocalUser();
  const dispatch = useDispatch();
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleParticipantNameChange = (e) => {
    setParticipantName(e.target.value);
  };

  useEffect(() => {
    setParticipants([localUser, ...conference.getParticipantsWithoutHidden()]);
  }, [conference.getParticipantsWithoutHidden()?.length]);

  const filteredParticipants = !participantName
    ? participants
    : participants.filter((participant) =>
        participant?.name
          ? participant?.name
              ?.toLowerCase()
              .includes(participantName.toLowerCase())
          : participant?._identity?.user?.name
              ?.toLowerCase()
              .includes(participantName.toLowerCase())
      );

const togglePinParticipant = (id) => {
  dispatch(setPinParticipant(id));
}

const getOptions = (participantId, role) => { 
  return [
  {
    icon: <span className={pinnedParticipantId ===participantId ? classnames("material-icons material-icons-outlined", classes.pin): "material-icons material-icons-outlined"}>push_pin</span>,
    text:  pinnedParticipantId ===participantId ? "Unpin from screen" : "Pin to screen",
    onClick: ()=>pinnedParticipantId ===participantId ? togglePinParticipant(null) : togglePinParticipant(participantId) 
  },
  {
    icon: (
      <span className="material-icons material-icons-outlined">
        remove_circle_outline
      </span>
    ),
    text: "Remove from the call",
    onClick: (event, index)=>{ 
      conference.kickParticipant(participantId); 
      setSelectedIndex(index);
      setAnchorEl(null);
      },
    disabled: conference.getRole() === "moderator" && selectedIndex !==1 ? false : true,
  },
];
}
  return (
    <Box className={classes.root}>
      <Box>
        <SearchBox
          placeholder={"Search Participants"}
          value={participantName}
          id="participantName"
          name="participantName"
          handleChange={handleParticipantNameChange}
        />
        {filteredParticipants.map((participant) =>
          participant?.name ? (
            <Box className={classes.localBox}>
              <Box className={classes.userBox}>
                <Avatar src={participant?.avatar ? participant?.avatar : null}>
                  {participant?.name?.slice(0, 1).toUpperCase()}
                </Avatar>
                <Box className={classes.userBoxContainer}>
                  <Box className={classes.hostDetails}>
                    <Box className={classes.hostBox}></Box>
                    <Typography>{participant?.name} (You) </Typography>
                  </Box>
                  <Typography variant="caption">
                    {conference.getRole() === "moderator" && (
                      <b>Meeting Host</b>
                    )}
                  </Typography>
                </Box>
              </Box>
              <Box className={classes.iconBox}>
                {localTracks
                  .find((track) => track.isAudioTrack())
                  ?.isMuted() ? (
                  <MicOffOutlinedIcon />
                ) : (
                  <MicNoneOutlinedIcon />
                )}
                <Tooltip title="More Actions">
                  <span
                    className={classnames(
                      "material-icons material-icons-outlined",
                      classes.more
                    )}
                    onClick={handleMenuClick}
                    aria-controls="more-action-menu" 
                    aria-haspopup="true"
                  >
                    more_vert
                  </span>
                </Tooltip>
                {anchorEl && <MenuBox
                  anchorEl={anchorEl}
                  selectedIndex={selectedIndex}
                  options={getOptions(participant?.id, conference.getRole())}
                  handleMenuClick={handleMenuClick}
                  handleMenuItemClick={handleMenuItemClick}
                  handleClose={handleClose}
                />}
              </Box>
            </Box>
          ) : (
            <Box>
              <Box className={classes.localBox}>
                <Box className={classes.userBox}>
                  <Avatar
                    src={
                      participant?._identity?.user?.avatar
                        ? participant?._identity?.user?.avatar
                        : null
                    }
                    style={{ background: avatarColors[participant._id] }}
                  >
                    {participant?._identity?.user?.name
                      .toUpperCase()
                      .slice(0, 1)}
                  </Avatar>
                  <Box className={classes.userBoxContainer}>
                    <Box className={classes.hostDetails}>
                      <Box className={classes.hostBox}>
                        <Typography>
                          {participant?._identity?.user?.name}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption">
                      {participant?._role === "moderator" && (
                        <b>Meeting Host </b>
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Box className={classes.iconBox}>
                  {remoteTracks[participant._id]
                    ?.find((track) => track.isAudioTrack())
                    ?.isMuted() ? (
                    <MicOffOutlinedIcon />
                  ) : (
                    <MicNoneOutlinedIcon />
                  )}
                  <Tooltip title="More Actions">
                    <span
                      className={classnames(
                        "material-icons material-icons-outlined",
                        classes.more
                      )}
                      aria-controls="more-action-menu" 
                      aria-haspopup="true"
                      onClick={handleMenuClick}
                    >
                      more_vert
                    </span>
                  </Tooltip>
                  {anchorEl && <MenuBox
                    anchorEl={anchorEl}
                    selectedIndex={selectedIndex}
                    options={getOptions(participant._id, participant?._role)}
                    handleMenuClick={handleMenuClick}
                    handleMenuItemClick={handleMenuItemClick}
                    handleClose={handleClose}
                  />}
                </Box>
              </Box>
            </Box>
          )
        )} 
      </Box>
      <Box>
        <Divider className={classes.divider} />
        <Box className={classes.meetingDetailsContainer}>
          <Box className={classes.meetingDetails}>
            <Typography>Meeting Link</Typography>
            <Typography variant="caption">{window.location.href}</Typography>
          </Box>
          <CopyMeetingLink />
        </Box>
      </Box>
    </Box>
  );
};

export default ParticipantDetails;

