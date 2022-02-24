import { Box, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import DescriptionIcon from '@material-ui/icons/Description';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { formatBytes } from '../../../utils';
import { color } from '../../../assets/styles/_color';

const useStyles = makeStyles((theme) => ({
    cb_attached: {
        display: 'flex',
        height: '58px',
        borderTop: '1px solid #d8d8d8 !important',
        width: '100%',
        background: color.white
    },
    cb_attached_thumbnail: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '58px',
        width: '58px',
        background: '#dedede',
        '& img': {
            flex: '0 0 auto',
            height: 'auto',
            width: 'auto',
            maxHeight: '100%',
            maxWidth: '100%'
        }
    },
    cb__attached__fileAttached: {
        fontWeight: 'bold'
    },
    cb__attached__uploading: {
        fontWeight: 'bold',
        color: '#606770'
    },
    cb__attached__filename: {
        display: 'flex',
        justifyContent: 'center',
        color: '#606770',
        flexDirection: 'column',
        flex: '14',
        fontSize: '12px',
        paddingLeft: '8px!important'
      },
      cb__attached__close: {
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            flex: 2,
            flexDirection: 'column'
      }
}))

const FileAttached = ({fileData, removeAttachment}) => {
    const classes = useStyles();
    const {id, type, size, name} = fileData;
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState(fileData?.status);

    useEffect(()=>{
        setStatus(fileData?.status);
        setUrl(fileData.url);
    },[fileData?.status, fileData?.url])

    const handleClose = () => {
        removeAttachment(id);
    }

  return (
    <Box className={classes.cb_attached}>
        {
            type==='photos' ?
            <Box className={classes.cb_attached_thumbnail}>
                <img src={url} alt='attached thumbnail' />
            </Box>
            :
            <Box className={classes.cb_attached_thumbnail}>
                <DescriptionIcon />
            </Box>
        }
        <Box className={classes.cb__attached__filename}>
            <Box>
                {name} &nbsp; &nbsp; {formatBytes(size)}
            </Box>
            {
                status==='done' ?
                <Box className={classes.cb__attached__fileAttached}>
                    Attached
                </Box>
                :
                status === 'failed' ?
                <Box>
                    Failed
                </Box>
                :
                status === 'loading' ?
                <Box className={classes.cb__attached__uploading}>Uploading...</Box>
                :
                <Box></Box>
            }
        </Box>
        <Box className={classes.cb__attached__close} onClick={handleClose}>
            <CloseOutlinedIcon />
        </Box>
    </Box>
  )
}

export default FileAttached