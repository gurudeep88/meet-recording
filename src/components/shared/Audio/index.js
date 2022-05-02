import React, {useEffect, useRef} from 'react';

const Audio = props => {
    const {track} = props
    const audioElementRef = useRef(null);
    useEffect(() => {
        track?.attach(audioElementRef.current);
        if (audioElementRef?.current) {
            audioElementRef.current.volume = 1;
        }
    }, [track]);

    if (!track) {
        return null;
    }
    return (<audio playsInline="1" autoPlay='1' ref={audioElementRef}/>);
}

export default Audio;