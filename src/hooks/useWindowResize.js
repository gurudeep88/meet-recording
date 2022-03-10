import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {ENTER_FULL_SCREEN_MODE, EXIT_FULL_SCREEN_MODE, GRID, SPEAKER} from "../constants";
import { useDocumentSize } from './useDocumentSize';

export function useWindowResize() {
    const layout = useSelector(state => state.layout);
    const { documentWidth, documentHeight } = useDocumentSize();
    const [windowSize, setWindowSize] = useState({viewportWidth: undefined, viewportHeight: undefined});

    function getDimensions() {
        let viewportHeight, viewportWidth;

        if ( layout.type === GRID && layout.mode === ENTER_FULL_SCREEN_MODE  ) {
            return { viewportWidth: (documentHeight -  84) * 16/9, viewportHeight: documentHeight -  84 }
        }
        
        if ( layout.type === GRID ) {
            return { viewportWidth: (documentHeight -  128) * 16/9, viewportHeight: documentHeight -  128 }
        }

        if (layout.mode === ENTER_FULL_SCREEN_MODE ) {
            viewportHeight = documentHeight - 84;
            viewportWidth = viewportHeight * 16/9;
            return {viewportWidth , viewportHeight};
        }

        viewportWidth = documentWidth - documentWidth*20/100;
        viewportHeight = viewportWidth * 9/16;
        
        if (viewportHeight > documentHeight - 128) {
            viewportHeight = documentHeight - 128
            viewportWidth  = viewportHeight*16/9
        }

        return { viewportWidth, viewportHeight };
    }

    useEffect(() => {
        // if (layout.mode === EXIT_FULL_SCREEN_MODE ) {
        //     window.removeEventListener("resize", handleResize)
        // } else {
        //     window.addEventListener("resize", handleResize)
        // }
        setWindowSize(getDimensions());
    }, [layout.mode]);

    useEffect(() => {
        setWindowSize(getDimensions());
    }, [layout.type]);

    useEffect(() => {
        setWindowSize(getDimensions());
    }, [documentWidth, documentHeight]);

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