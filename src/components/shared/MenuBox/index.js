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
    border: `1px solid ${color.secondaryDark}`,
    borderRight: `1px solid ${color.secondary}`,
    zIndex: 999,
    background: color.secondaryDark,
    color: color.white
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
    border: `1px solid ${color.secondaryDark}`,
    '&.MuiListItem-root.Mui-selected, .MuiListItem-root.Mui-selected:hover': {		
      backgroundColor: color.secondary		
    },
    '& .MuiListItemIcon-root': {
        fontSize: '1.3rem',
        minWidth: '35px',
        color: color.white,
      }, 
      '& .MuiListItemText-primary': {
        fontSize: '0.9rem',
        color: color.white,
      },
    '&:focus': {
      backgroundColor: color.secondary,
      '& .MuiListItemIcon-root': {
        color: color.primaryLight
      }, 
      '& .MuiListItemText-primary': {
        color: color.white,
      },
      '&:hover': {
        background: color.secondary,
      }
    },
    '&:hover': {
      background: color.secondary,
        '& .MuiListItemIcon-root':{
            color: color.primaryLight
        }, 
        '& .MuiListItemText-primary': {
          color: color.white,
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
