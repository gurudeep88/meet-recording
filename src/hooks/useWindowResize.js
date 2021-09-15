import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {EXIT_FULL_SCREEN_MODE} from "../constants";

export function useWindowResize() {
    const layout = useSelector(state => state.layout);
    const [windowSize, setWindowSize] = useState({viewportWidth: undefined, viewportHeight: undefined});

    function getDimensions(mode) {
        const documentWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        const documentHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        const viewportWidth = mode === EXIT_FULL_SCREEN_MODE ? documentWidth - 280 : documentWidth;
        const viewportHeight = mode === EXIT_FULL_SCREEN_MODE ? documentHeight - 128 : documentHeight - 128;
        return {viewportWidth, viewportHeight};
    }

    useEffect(() => {
        setTimeout(()=>setWindowSize(getDimensions(layout.mode)), 0);
    }, [layout]);

    useEffect(() => {
        function handleResize() {
            setWindowSize(getDimensions(layout.mode));
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
}
