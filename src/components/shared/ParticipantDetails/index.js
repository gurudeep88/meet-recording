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
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import { useDispatch, useSelector } from "react-redux";
import SearchBox from "../SearchBox";
import classnames from "classnames";
import CopyMeetingLink from "../CopyMeetingLink";
import {MenuBox} from "../MenuBox";
import {setPinParticipant} from "../../../store/actions/layout";
import { getParticipants } from "../../../utils";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "95%",
    [theme.breakpoints.down('md')]: {
      height: '82%'
    }
  },
  underRoot: {
    [theme.breakpoints.down('md')]: {
      height: '100%'
    }
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
  const profile = useSelector((state) => state.profile);
  const layout = useSelector((state) => state.layout);
  const localUser = conference.getLocalUser();
  const [participantName, setParticipantName] = useState("");
  const [selectedOption, setSelectedOption] = useState({});

  const handleMenuOpen = (event, item) => {
    setSelectedOption({ ...selectedOption, [item]: event.currentTarget });
  };

  const handleMenuClose = (item) => {
    setSelectedOption({ ...selectedOption, [item]: null });
  };

  const handleOptionClick = (option, item) => {
    handleMenuClose(item);
  };

  const [participants, setParticipants] = useState(getParticipants(conference, localUser));

  
  const dispatch = useDispatch();

  const handleParticipantNameChange = (e) => {
    setParticipantName(e.target.value);
  };
  
  useEffect(() => {
    setParticipants(getParticipants(conference, localUser));
  }, [conference.getParticipantsWithoutHidden()?.length]);

  const filteredParticipants = !participantName
    ? participants
    : participants.filter((participant) => 
              participant?._identity?.user?.name
              ?.toLowerCase()
              .includes(participantName.toLowerCase())
  );

const togglePinParticipant = (id) => {
  dispatch(setPinParticipant(id));
}

const getAvatarColor =  (id)=> {
    return conference.participants[id]?._identity?.user?.avatar || profile?.color;
}

  return (
    <Box className={classes.root}>
      <Box className={classes.underRoot}>
        <SearchBox
          placeholder={"Search Participants"}
          value={participantName}
          id="participantName"
          name="participantName"
          handleChange={handleParticipantNameChange}
        />
        <Box sx={{
            maxHeight: `calc(100% - 70px)`,
            overflow: 'auto',
            height: '100%'
          }}>
          {filteredParticipants.map((participant, p) =>
              <Box>
                <Box className={classes.localBox}>
                  <Box className={classes.userBox}>
                    <Avatar
                      style={{ backgroundColor: getAvatarColor(participant?._id) }}
                    >
                      {participant?._identity?.user?.name
                        .toUpperCase()
                        .slice(0, 1)}
                    </Avatar>
                    <Box className={classes.userBoxContainer}>
                      <Box className={classes.hostDetails}>
                        <Box className={classes.hostBox}>
                          <Typography>
                            {participant?._identity?.user?.name} {" "}{localUser.id === participant?._identity?.user?.id ? "(You)" : null}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="caption">
                        {participant?._role === "moderator" && (
                          <b style={{fontWeight: '300'}}>Meeting Host </b>
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  <Box className={classes.iconBox}>
                    {localTracks.find((track) => track.isAudioTrack())?.isMuted() || 
                    remoteTracks[participant._id]?.find((track) => track.isAudioTrack())?.isMuted() ? (
                      <MicOffOutlinedIcon />
                    ) : (
                      <MicNoneOutlinedIcon />
                    )}
                    <Tooltip title="More Actions">
                      <MoreVertOutlinedIcon className={classes.more} onClick={(e)=>handleMenuOpen(e, participant._id)}/>
                    </Tooltip>
                    <MenuBox
                      anchorEl={selectedOption[participant._id]}
                      selectedOption={selectedOption}
                      open={Boolean(selectedOption[participant._id])}
                      optionParams={{id: participant._id, role: participant?._role || conference.getRole()}}
                      togglePinParticipant={togglePinParticipant}
                      handleOptionClick={handleOptionClick}
                      handleMenuClose={handleMenuClose}
                    />
                  </Box>
                </Box>
              </Box>
           // )
          )} 
        </Box>
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

