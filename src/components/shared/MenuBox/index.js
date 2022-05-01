import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SendIcon from '@material-ui/icons/Send';
import { color } from "../../../assets/styles/_color";

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
    zIndex: 999,
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '& .MuiListItemIcon-root': {
        fontSize: '1.3rem',
        minWidth: '35px'
      }, 
      '& .MuiListItemText-primary': {
        fontSize: '0.9rem'
      },
    '&:focus': {
      backgroundColor: color.lightgray2,
      '& .MuiListItemIcon-root': {
        color: color.red
      }, 
      '& .MuiListItemText-primary': {
        color: color.secondary,
      },
    },
    '&:hover': {
        '& .MuiListItemIcon-root':{
            color: color.primaryLight
        }, 
        '& .MuiListItemText-primary': {
          color: color.secondary,
        },
      },
  },
}))(MenuItem);

export const MenuBox=({anchorEl, selectedIndex, options, handleMenuItemClick, handleClose})=> {
  return (
      <StyledMenu
        id='more-action-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
          {options.map((option, index)=>(
        <StyledMenuItem
            key={index}
            selected={index === selectedIndex}
            onClick={option.onClick}
            disabled={option?.disabled}
        >
          <ListItemIcon>
            {option.icon}
          </ListItemIcon>
          <ListItemText primary={option.text} />
        </StyledMenuItem>
        ))}
      </StyledMenu>
  );
}
