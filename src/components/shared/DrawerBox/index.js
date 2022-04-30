import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { color } from "../../../assets/styles/_color";
import { Box, Drawer } from "@material-ui/core";


export default function DrawerBox({ children, open, onClose, top }) {
  const useStyles = makeStyles((theme) => ({
    drawer: {
      "& .MuiDrawer-paper": {
        overflow: "hidden",
        top: top || "16px",
        bottom: "80px",
        right: "16px",
        borderRadius: "10px",
        height: "85%",
        width: "360px",
        backgroundColor: color.secondary,
      },
    },
    list: {
      padding: theme.spacing(3, 3, 3, 3),
      height: "100%",
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
