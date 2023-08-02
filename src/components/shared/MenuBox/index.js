import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SendIcon from "@material-ui/icons/Send";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import { color } from "../../../assets/styles/_color";
import classNames from "classnames";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  pin: {
    color: color.primary,
  },
}));
const StyledMenu = withStyles({
  paper: {
    border: `1px solid ${color.secondaryDark}`,
    borderRight: `1px solid ${color.secondary}`,
    zIndex: 999,
    background: color.secondaryDark,
    color: color.white,
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    border: `1px solid ${color.secondaryDark}`,
    "&.MuiListItem-root.Mui-selected, .MuiListItem-root.Mui-selected:hover": {
      backgroundColor: color.secondary,
    },
    "& .MuiListItemIcon-root": {
      fontSize: "1.3rem",
      minWidth: "35px",
      color: color.white,
    },
    "& .MuiListItemText-primary": {
      fontSize: "0.9rem",
      color: color.white,
    },
    "&:focus": {
      backgroundColor: color.secondary,
      "& .MuiListItemIcon-root": {
        color: color.primaryLight,
      },
      "& .MuiListItemText-primary": {
        color: color.white,
      },
      "&:hover": {
        background: color.secondary,
      },
    },
    "&:hover": {
      background: color.secondary,
      "& .MuiListItemIcon-root": {
        color: color.primaryLight,
      },
      "& .MuiListItemText-primary": {
        color: color.white,
      },
    },
  },
}))(MenuItem);

export const MenuBox = ({
  anchorEl,
  selectedOption,
  open,
  optionParams,
  togglePinParticipant,
  handleOptionClick,
  handleMenuClose
}) => {
  const { id, role } = optionParams;
  const { pinnedParticipant, raisedHandParticipantIds } = useSelector(
    (state) => state.layout
  );

  const conference = useSelector((state) => state.conference);
  const classes = useStyles();

  // const options = [
  //   {
  //     icon: (
  //       <span
  //         className={
  //           pinnedParticipant.participantId === id
  //             ? classNames(
  //                 "material-icons material-icons-outlined",
  //                 classes.pin
  //               )
  //             : "material-icons material-icons-outlined"
  //         }
  //       >
  //         push_pin
  //       </span>
  //     ),
  //     text:
  //       pinnedParticipant.participantId === id
  //         ? "Unpin from screen"
  //         : "Pin to screen",
  //     onClick: (e, index) => {
  //       handleMenuItemClick(e, index);
  //       pinnedParticipant.participantId === id
  //         ? togglePinParticipant(null)
  //         : togglePinParticipant(id);
  //     },
  //   },
  //   {
  //     icon: <RemoveCircleOutlineIcon />,
  //     text: "Remove from the call",
  //     onClick: (event, index) => {
  //       conference.kickParticipant(id);
  //       setSelectedIndex(index);
  //       setAnchorEl(null);
  //     },
  //     disabled:
  //       conference.getRole() === "moderator" && selectedIndex !== 1
  //         ? false
  //         : true,
  //   },
  // ];

  return (
    <StyledMenu
      id="more-action-menu"
      anchorEl={anchorEl}
      keepMounted
      open={open}
      onClose={()=>handleMenuClose(id)}
    >
        <StyledMenuItem
          key={0}
          selected={
            pinnedParticipant.participantId === id
          }
          onClick={(e)=>{
          pinnedParticipant.participantId === id
          ? togglePinParticipant(null)
          : togglePinParticipant(id);

          handleOptionClick(0, id);
          }}
        >
          <ListItemIcon>
            <span
            className={
              pinnedParticipant.participantId === id
                ? classNames(
                    "material-icons material-icons-outlined",
                    classes.pin
                  )
                : "material-icons material-icons-outlined"
            }
          >
            push_pin
          </span>  
          </ListItemIcon>
          <ListItemText primary={pinnedParticipant.participantId === id
          ? "Unpin from screen"
          : "Pin to screen"} />
        </StyledMenuItem>
        {/* <StyledMenuItem
          key={1}
          selected={
            pinnedParticipant.participantId === id
          }
          onClick={(e)=>{
            conference.kickParticipant(id);
            handleOptionClick(1, id);
          }}
          disabled={conference.getRole() === "moderator"
          ? false
          : true}
        >
          <ListItemIcon>
            <RemoveCircleOutlineIcon />  
          </ListItemIcon>
          <ListItemText primary={"Remove from the call"} />
      </StyledMenuItem> */}
      {/* {options.map((option, index) => (
        <StyledMenuItem
          key={index}
          selected={
            pinnedParticipant.participantId === id && index === selectedIndex
          }
          onClick={(e)=>option.onClick(e, index)}
          disabled={option?.disabled}
        >
          <ListItemIcon>{option.icon}</ListItemIcon>
          <ListItemText primary={option.text} />
        </StyledMenuItem>
      ))} */}
    </StyledMenu>
  );
};
