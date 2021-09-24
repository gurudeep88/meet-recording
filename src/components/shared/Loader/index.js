import React  from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
    makeStyles,
} from "@material-ui/core";
import {color} from "../../../assets/styles/_color";

const useStyles = makeStyles((theme) => ({
    buttonProgress: {
        color: color.primary,
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -12,
        marginLeft: -12,
    },
}));

const Loader = ({height, width})=> {
    const classes = useStyles();
    return (
      <div style={{height: height+"px", width: width+"px"}} >
            <CircularProgress size={24} className={classes.buttonProgress}/>
      </div>
    );
}

export default Loader;
  