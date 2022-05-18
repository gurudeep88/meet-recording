import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { color } from "../../../assets/styles/_color";
import { Box, Drawer } from "@material-ui/core";
import { ENTER_FULL_SCREEN_MODE } from "../../../constants";
import { useSelector } from "react-redux";


export default function DrawerBox({ children, open, onClose, top }) {
  const layout = useSelector(state => state.layout);
  const useStyles = makeStyles((theme) => ({
    drawer: {
      "& .MuiDrawer-paper": {
        overflow: "hidden",
        top: top || "16px",
        bottom: "0px",
        right: "16px",
        borderRadius: "10px",
        height: layout.mode === ENTER_FULL_SCREEN_MODE ? "89%" : "87%",
        width: "360px",
        backgroundColor: color.secondary,
      },
    },
    list: {
      padding: theme.spacing(3, 3, 3, 3),
      height: "92%",
    },
  }));
  const classes = useStyles();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      className={classes.drawer}
    >
      <Box className={classes.list} role="presentation">
        {children}
      </Box>
    </Drawer>
  );
}
