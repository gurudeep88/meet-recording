import { Box, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'
import { color } from '../../../assets/styles/_color';
import { profile } from "../../../store/actions/profile";
import { useSelector } from 'react-redux';
const useStyles = makeStyles(()=>({
logo: {
  display: 'flex',
    textDecoration: 'none',
    color: color.white,
    alignItems: 'center',
    "&:hover": {
        textDecoration: 'none',
        color: color.white,
    }
},
logoImage: {
  width: '38px',
  height: '38px',
  marginRight: '10px',
},
logoText: {
  fontFamily: `'Montserrat', sans-serif`,
  width: 'fit-content',
  height: "63px",
  display: "flex",
  alignItems: "center",
  color: `${color.white}`,
  fontSize: '1.2rem'
},
}))

const Logo = () => {
    const profile = useSelector(state => state.profile);
    const classes = useStyles();
    
    return (
        <Box>
        <a href={`/${profile.meetingTitle}`} className={classes.logo}>
            <img src={process.env.REACT_APP_LOGO} alt="logo" className={classes.logoImage}/>
            <Typography className={classes.logoText}>SARISKA</Typography>
        </a>
    </Box>
    )
}

export default Logo
