import React, {memo} from 'react';
import {getWhiteIframeUrl} from "../../../utils";
import {
    makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        '& iframe .hasSecondary': {
            borderRadius: "40px",
            boxShadow: "none"
        }
    }
}));

const Whiteboard = ({ conference, height, width, isVisible }) => {
    const classes = useStyles();
    const src = getWhiteIframeUrl(conference);  
    return (
            <iframe id="whiteboard" frameBorder="0" style={{background: "#ffffff", display: isVisible ? "block": "none"}} height={height} width={width} src={src}></iframe>
    );
};

export default memo(Whiteboard);
