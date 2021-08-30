import { Box, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'
import { color } from '../../../assets/styles/_color';

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
    const classes = useStyles();
    return (
        
        <Box>
        <Link to="/" className={classes.logo}>
        <img src="https://www.sariska.io/sariska_logo.png" alt="logo" className={classes.logoImage}/>
        <Typography className={classes.logoText}>SARISKA</Typography>
        </Link>
    </Box>
    )
}

export default Logo
