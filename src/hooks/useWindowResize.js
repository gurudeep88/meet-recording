import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {ENTER_FULL_SCREEN_MODE, GRID, PRESENTATION, SPEAKER} from "../constants";

export function useWindowResize() {
    const layout = useSelector(state => state.layout);
    const [windowSize, setWindowSize] = useState({viewportWidth: undefined, viewportHeight: undefined});

    function getDimensions() {
        let documentWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        let documentHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        let viewportHeight, viewportWidth;

        if (layout.mode === ENTER_FULL_SCREEN_MODE ) {
            viewportHeight = documentHeight - 108;
            viewportWidth = documentWidth;
            return {viewportWidth , viewportHeight};
        }

        viewportHeight = documentHeight - 92;        
        viewportWidth = documentWidth - 218 
        return { viewportWidth, viewportHeight };
    }

    useEffect(() => {
        setWindowSize(getDimensions());
    }, [layout.mode]);

    useEffect(() => {
        setWindowSize(getDimensions());
    }, [layout.type]);

    function handleResize() {
        setWindowSize(getDimensions());
    }

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
}