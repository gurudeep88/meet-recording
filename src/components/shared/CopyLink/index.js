import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import {makeStyles} from '@material-ui/core/styles';
import {Avatar, Box, Button, Typography} from '@material-ui/core';
import {color} from '../../../assets/styles/_color';


const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(1, 0),
    },
    gridItem: {
        margin: theme.spacing(3, 0),
    },
    textField: {
        color: 'red',
        "& .MuiFormLabel-root.Mui-focused": {
            color: color.secondary
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":{
            borderColor: `${color.secondary}`
          },
        "& input": {
            fontSize: '0.85rem'
        }
    },
    icon: {
        background: `${color.primaryDark}`
    },
    button: {
        color: `${color.primary}`, 
        borderColor: `${color.primary}`, 
        borderRadius: '15px',
        width: '100%',
        marginTop: '32px'
    }
}));
const CopyLink = ({onClick}) => {
    const classes = useStyles();
    const [copySuccess, setCopySuccess] = useState('');
    const textToCopy = window.location.href;

    function copyToClipboard() {
        onClick("left", true);
        navigator.clipboard.writeText(textToCopy);
        setCopySuccess('successfully copied');
    }

    return (
        <Grid container item alignItems="center" className={classes.root}>
            <Grid item xs={12} className={classes.textFieldGrid}>
                <form>
                    <TextField id="input-with-icon-grid"
                       label="Meeting Link"
                       value={textToCopy}
                       variant="outlined"
                       className={classes.textField}
                       fullWidth
                    />
                </form>
            </Grid>
            <Grid item xs={12} className={classes.gridItem}>
                <Box>
                    <Button variant="outlined"
                            className={classes.button}
                            onClick={copyToClipboard}>{copySuccess ? 'Copy Again' : 'Copy'}</Button>
                    <Typography variant="subtitle2" style={{
                        color: `${color.primary}`,
                        borderColor: `${color.primary}`
                    }}>{copySuccess}</Typography>
                </Box>
            </Grid>
        </Grid>
    )
}

export default CopyLink

