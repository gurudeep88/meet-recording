import React from 'react';
import {compressFile, getPresignedUrl, getUniqueNumber} from '../../../utils';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { makeStyles, Tooltip } from '@material-ui/core';
import { color } from '../../../assets/styles/_color';


const useStyles = makeStyles((theme) => ({
    labelHover: {
        '&:hover svg': {
            color:color.secondary,
            cursor: 'pointer'
        }
    }
}))


const FileUpload = ({sesssionInfo, type, startFileUpload}) => {
    const classes = useStyles();
  const handleChange = (event) => {
    const id = getUniqueNumber();
    const file = event.target.files[0];
    console.log('filech', file, sesssionInfo, type)
    const compressOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    const signedUrlOptions = {
        fileName: file.name,
        fileType: file.type
    }
    startFileUpload({id, name: file.name, type: type, size: file.size, status: 'loading'});
    Promise.all([
        getPresignedUrl(signedUrlOptions),
        compressFile(file, type)
     ])
     .then(values => {
        const signedUrl  = values[0].presignedUrl;
        const headers = {
          "ACL":"public-read",
          "Content-Disposition": "attachment"
        }
        return fetch(signedUrl, {method: 'PUT', body: values[1], headers})
    })
    .then(res=>{
        console.log('startres', res);
        const url = res.url.split("?")[0];
        startFileUpload({id, url, status: 'done'});
    })
    .catch(function (error) {
        startFileUpload({id, msg:'failed', status: 'failed'});
    });
  }


  return (
    <div>
        {type==="photos" ? (
            <Tooltip title="Add Image" placement='top'>
                <label htmlFor="chat-images" className={classes.labelHover}>
                    <AddPhotoAlternateIcon  style={{marginBottom: '-4px'}}/>
                    <input 
                        accept='image/*'
                        name='file'
                        type='file'
                        onChange={handleChange}
                        id="chat-images"
                        hidden
                    />
                </label>
            </Tooltip>
        )
        : (
        <Tooltip title="Add File" placement='top'>
            <label htmlFor="chat-fileAttached" className={classes.labelHover}>
                <AttachFileIcon  style={{fontSize: '1.2rem', marginBottom: '-4px'}}/>
                <input 
                    name='file'
                    type='file'
                    onChange={handleChange}
                    id="chat-fileAttached"
                    hidden
                />
            </label>
        </Tooltip>
        )
        }
    </div>
  )
}

export default FileUpload