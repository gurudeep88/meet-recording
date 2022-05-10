import React, {memo} from 'react';
import {getSharedDocumentIframeUrl} from "../../../utils";

const SharedDocument = ({ conference, height, width, isVisible }) => {
    const src = getSharedDocumentIframeUrl(conference);
    return (
        <iframe id="sharedDocument" frameBorder="0"  style={{background: "#ffffff", display: isVisible ? "block": "none"}} height={height} width={width} src={src}></iframe>
    );
};

export default memo(SharedDocument);
