import { Box, Hidden, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'
import { color } from '../../../assets/styles/_color';
import { profile } from "../../../store/actions/profile";
import { useSelector } from 'react-redux';
import logo from '../../../assets/images/shared/Logo_Empty.svg';

const Logo = ({width, height}) => {
    const profile = useSelector(state => state.profile);
    const videoTrack =  useSelector((state) => state.localTrack).find(track=>track?.isVideoTrack());

const useStyles = makeStyles(()=>({
  logo: {
    display: 'flex',
      textDecoration: 'none',
      color: color.white,
      alignItems: 'center',
      justifyContent: 'center',
      "&:hover": {
          textDecoration: 'none',
          color: color.white,
      }
  },
  logoImage: {
    width: width,
    height: height,
  },
  logoText: {
    fontFamily: `'DM Sans', sans-serif`,
    width: 'fit-content',
    height: "63px",
    display: "flex",
    alignItems: "center",
    color: `${color.white}`,
    fontSize: '1.2rem'
  },
  }))
  
    const classes = useStyles();
    
    return (
        <Box className={classes.logo}>
          <Hidden mdUp>
            <img src={videoTrack?.isMuted() ? logo : process.env.REACT_APP_LOGO} alt="logo" className={classes.logoImage}/>
            {/* <Typography className={classes.logoText}>SARISKA</Typography> */}
            </Hidden>
            <Hidden mdDown>
              <img src={process.env.REACT_APP_LOGO} alt="logo" className={classes.logoImage}/>
            </Hidden>
        </Box>
    )
}

export default Logo
