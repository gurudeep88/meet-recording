import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import { blue } from '@material-ui/core/colors';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});

function SimpleDialog(props) {
    const classes = useStyles();
    const { onClose, selectedValue, open, broadcasts, selectedBroadcast, createLiveStream } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        selectedBroadcast(value.contentDetails.boundStreamId);
    };

    const filterBroadcasts = [];

    broadcasts.forEach(item=>{
        if (!filterBroadcasts.find(selected=>selected.snippet.title === item.snippet.title)) {
            filterBroadcasts.push(item);
        }
    });

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">
                { filterBroadcasts.length > 0 ? "Choose a live stream" : "No Live streams found!!!"}
            </DialogTitle>
            { filterBroadcasts.length > 0 && 
                <List>
                    {filterBroadcasts.map((broadcast) => (
                        <ListItem button onClick={() => handleListItemClick(broadcast)} key={broadcast.snippet.title}>
                            <ListItemAvatar>
                                <Avatar className={classes.avatar}>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={broadcast.snippet.title} />
                        </ListItem>
                    ))}
                </List> 
            }
            {filterBroadcasts.length === 0 && <List>
                        <ListItem button onClick={() => createLiveStream()}>
                            <ListItemAvatar>
                                <Avatar className={classes.avatar}>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={"Create Live Stream"} />
                        </ListItem>
                 </List>
 
            }
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string
};

export default function LiveStreamDialog({broadcasts, selectedBroadcast, open, createLiveStream, close}) {
    return (
        <SimpleDialog createLiveStream={createLiveStream} open={open} selectedBroadcast={selectedBroadcast} broadcasts={broadcasts}  onClose={close} />
    );
}
