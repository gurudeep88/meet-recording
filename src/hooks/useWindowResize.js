import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {ENTER_FULL_SCREEN_MODE, EXIT_FULL_SCREEN_MODE} from "../constants";

export function useWindowResize() {
    const layout = useSelector(state => state.layout);
    const [windowSize, setWindowSize] = useState({viewportWidth: undefined, viewportHeight: undefined});

    function getDimensions(mode) {
        let documentWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        let documentHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        let viewportHeight, viewportWidth;
        
        if (documentHeight > documentWidth*9/16) {
            viewportWidth = documentWidth - (layout.mode === ENTER_FULL_SCREEN_MODE ||  documentWidth < 1025 ? 0 : 250);
            viewportHeight = viewportWidth*9/16;
        } else {
            viewportHeight = documentHeight- (layout.mode === ENTER_FULL_SCREEN_MODE ? 64 : 128) 
            viewportWidth = viewportHeight*16/9;
        }
        return {viewportWidth, viewportHeight};
    }

    useEffect(() => {
        if (layout.mode === EXIT_FULL_SCREEN_MODE ) {
            window.removeEventListener("resize", handleResize)
        } else {
            window.addEventListener("resize", handleResize)
        }
        setWindowSize(getDimensions(layout.mode));
    }, [layout.mode]);

    function handleResize() {
        setWindowSize(getDimensions(layout.mode));
    }

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
}