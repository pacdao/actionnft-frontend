import * as React from "react";
import { AppBar, Container, makeStyles, Toolbar } from "@material-ui/core";

import logo from "assets/logo2x.png";

const useStyles = makeStyles((theme) => ({
  appBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&.MuiAppBar-colorPrimary": {
      backgroundColor: "rgba(0,0,0,0) !important",
    },
  },
  logo: {
    marginLeft: "1rem",
  },
  img: {
    width: "50px",
    marginTop: "0.5rem",
    [theme.breakpoints.up("md")]: {
      width: "100px",
      marginTop: "1rem",
    },
  },
}));

const Header = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      <AppBar elevation={0} position="static" className={classes.appBar}>
        <Toolbar className={classes.logo}>
          <a href="https://www.pac.xyz/" target="_blank" rel="noreferrer">
            <img alt="PAC Crypto Activism" src={logo} className={classes.img} />
          </a>
        </Toolbar>
      </AppBar>
    </Container>
  );
};

export default Header;
