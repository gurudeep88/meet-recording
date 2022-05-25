import { Button, makeStyles } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import { color } from "../../../assets/styles/_color";

const FancyButton = ({disabled, onClick, buttonText, width, top, homeButton, fontSize}) => {

const useStyles = makeStyles((theme) => ({
  anchor: {
    color: color.white,
    textDecoration: "none",
    border: `1px solid ${color.primaryLight}`,
    padding: '4px 40px',
    borderRadius: "10px",
    textTransform: "capitalize",
    marginTop: top || theme.spacing(3),
    width: width || "178.69px",
    transition: `0.1s all ease`,
    fontSize: fontSize || '0.875rem',
    minWidth: '175px',
    "&:hover": {
      background: color.mainGradient,
      border: `1px solid transparent`,
      width: width || "178.69px",
    },
    homeButton: {
      position: "absolute",
      left: 0,
      right: 0,
      margin: "auto",
      bottom: "-57px",
    }
  },
}));
  const classes = useStyles();

  return (
    <Button
      className={classNames(classes.anchor, homeButton ? classes.homeButton: "")}
      disabled={disabled}
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
};

export default FancyButton;
