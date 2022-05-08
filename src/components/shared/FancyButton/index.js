import { Button, makeStyles } from "@material-ui/core";
import React from "react";
import { color } from "../../../assets/styles/_color";

const FancyButton = ({disabled, onClick, buttonText, width, top}) => {

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
    transition: `font-weight .5s all ease`,
    "&:hover": {
      fontWeight: "900",
      background: `linear-gradient(to right, ${color.primaryLight}, ${color.buttonGradient}, ${color.primary})`,
      border: `none`,
      padding: '5px 41px',
      width: width || "178.69px",
    },
    position: "absolute",
    left: 0,
    right: 0,
    margin: "auto",
    bottom: "-57px"
  },
}));
  const classes = useStyles();

  return (
    <Button
      className={classes.anchor}
      disabled={disabled}
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
};

export default FancyButton;
