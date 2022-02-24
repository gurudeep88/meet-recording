import { makeStyles } from '@material-ui/core';
import React from 'react'
import FileUpload from '../FileUpload'


const MediaChat = ({startFileUpload, sessionInfo, currentMessage}) => {

    const useStyles = makeStyles((theme) => ({
        fileDisplay: {
            alignItems: 'center',
            marginRight: '4px',
            display: 'flex',
            opacity:1,
            width:'56.2px',
            height: '100%',
            transition: 'width 0.5s, height 0.5s, opacity 1s 0.2s'
        },
        fileHide: {
            alignItems: 'center',
            marginRight: '4px',
            display:'flex',
            opacity:0,
            width:0,
            height: '100%',
            transition: 'width 0.5s 0.5s, height 0.5s 0.5s, opacity 1s'
        }
    }))
    const classes = useStyles();
    
  return (
    <div className={!currentMessage ? classes.fileDisplay : classes.fileHide}>
        <FileUpload
            startFileUpload={startFileUpload}
            type="attachment" 
            title="Add Files"
            key="uploadFile" 
            sessionInfo={sessionInfo}
        />
        <FileUpload
            startFileUpload={startFileUpload}
            type="photos" 
            title="Add Photos"
            key="uploadPhoto" 
            sessionInfo={sessionInfo}
        />
    </div>
  )
}

export default MediaChat