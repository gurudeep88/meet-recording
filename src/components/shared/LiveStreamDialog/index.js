import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import { blue } from '@material-ui/core/colors';

const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});

function SimpleDialog(props) {
    const classes = useStyles();
    const { onClose, selectedValue, open, broadcasts, selectedBroadcast } = props;

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
            <DialogTitle id="simple-dialog-title">Choose a live stream</DialogTitle>
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
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};

export default function LiveStreamDialog({broadcasts, selectedBroadcast, open}) {
    const [selectedValue, setSelectedValue] = React.useState(null);


    const handleClose = (value) => {
        setSelectedValue(value);
    };

    return (
        <SimpleDialog open={open} selectedBroadcast={selectedBroadcast} broadcasts={broadcasts} selectedValue={selectedValue} onClose={handleClose} />
    );
}
