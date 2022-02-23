import { makeStyles } from '@material-ui/core';
import React from 'react'
import FileUpload from '../FileUpload'


const useStyles = makeStyles((theme) => ({
    fileBox: {
        display:'flex',
        alignItems: 'center',
        zIndex: 11,
        marginRight: '4px'
    }
}))


const MediaChat = ({startFileUpload, sessionInfo}) => {
    const classes = useStyles();
  return (
    <div className={classes.fileBox}>
        <FileUpload
            startFileUpload={startFileUpload}
            type="attachment" 
            title="Add Files"
            key="uploadPhoto" 
            sessionInfo={sessionInfo}
        />
        <FileUpload
            startFileUpload={startFileUpload}
            type="photos" 
            title="Add Photos"
            key="uploadFile" 
            sessionInfo={sessionInfo}
        />
    </div>
  )
}

export default MediaChat