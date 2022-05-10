import React, {useLayoutEffect, useState} from 'react';

export function useDocumentSize() {
    const [documentSize, setDocumentSize]  = useState({documentWidth: undefined, documentHeight: undefined});

    function getDimensions() {
        let documentWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        let documentHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        return {documentWidth, documentHeight};
    }

    function handleResize() {
        setDocumentSize(getDimensions());
    }

    useLayoutEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return documentSize; 
}