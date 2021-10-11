import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Alert from "@material-ui/lab/Alert";
import { Button, Grid, Container, Grow, makeStyles, Typography } from "@material-ui/core";

import { useEthersProvider } from "contexts/EthersContext";
import pacImageCommon from "assets/hendlinCommon.jpg";
import Header from "components/Header";
import Footer from "components/Footer";
import Main from "pages/index";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "1rem 0",
    [theme.breakpoints.up("md")]: {
      padding: "2rem 0",
    },
  },
}));

function App() {
  const classes = useStyles();
  const { account, chainId, provider, connect } = useEthersProvider();

  const isCorrectChain = React.useMemo(() => {
    // TODO: change to correct network once it is ready
    return chainId !== null && chainId === 1;
  }, [chainId]);

  return (
    <React.Fragment>
      <Header />
      <Container maxWidth="lg" className={classes.root}>
        {!provider && (
          <Grid container justifyContent="center">
            <Grid item xs={12} container justifyContent="center">
              <Grow in disableStrictModeCompat style={{ transformOrigin: "0 0 0 0" }} timeout={1000}>
                <img
                  style={{ "max-width": "400px" }}
                  className={classes.img}
                  alt="PAC Crypto Activism NFT"
                  src={pacImageCommon}
                />
              </Grow>
            </Grid>

            <Alert severity="error" style={{ margin: "1.5rem 0" }}>
              Please install{" "}
              <a href="https://metamask.io/" target="_blank" rel="noreferrer" style={{ color: "#000000" }}>
                Metamask
              </a>{" "}
              first.
            </Alert>

            <Typography display="block" gutterBottom style={{ width: "100%", textAlign: "center" }}>
              <strong>'The War on Crypto'</strong> features award-winning American artist{" "}
              <strong>
                <a style={{ color: "#000" }} href="https://www.rebeccahendin.com/" rel="noreferrer" target="_blank">
                  Rebecca Hendin
                </a>
              </strong>
              , whose art is regularly featured in BBC, and The Guardian. This limited series reflects the current state
              of US politics and their overarching stranglehold on crypto innovation.
            </Typography>
            <Typography display="block" gutterBottom style={{ width: "100%", textAlign: "center" }}>
              All funds towards the Action NFT are used to incentivize politicians to advocate for crypto in DC. Make
              your voice heard!
            </Typography>
            <Typography display="block" gutterBottom style={{ width: "100%", textAlign: "center" }}>
              Connect A Web3 Provider Like MetaMask to Learn More
            </Typography>
          </Grid>
        )}

        {provider && !isCorrectChain && (
          <Grid container justifyContent="center">
            <Alert severity="error">Please switch to Ethereum Mainnet.</Alert>
          </Grid>
        )}

        {provider && isCorrectChain && !account && (
          <Grid container justifyContent="center">
            <Button variant="contained" color="primary" size="large" onClick={connect} type="submit">
              Connect your wallet
            </Button>
          </Grid>
        )}

        {provider && isCorrectChain && account && (
          <Router>
            <Switch>
              <Route path="/bonus">
                <Main />
              </Route>
              <Route path="/">
                <Main />
              </Route>
            </Switch>
          </Router>
        )}
      </Container>
      <Footer />
    </React.Fragment>
  );
}

export default App;
