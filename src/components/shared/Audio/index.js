import React, {useEffect, useRef} from 'react';

const Audio = props => {
    const {track} = props
    const audioElementRef = useRef(null);
    useEffect(() => {
        if (!track || !audioElementRef?.current) {
            return;
        }
        track.attach(audioElementRef.current);
        return ()=>{
            track.detach(audioElementRef.current);
        }
    }, [track]);

    return (<audio playsInline="1" autoPlay='1' ref={audioElementRef}/>);
}

export default Audio;