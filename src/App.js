import * as React from "react";
import { useEthersProvider } from "contexts/EthersContext";
import Alert from "@material-ui/lab/Alert";
import Container from "@material-ui/core/Container";
import Main from "pages/main";
import Header from "components/Header";
import Footer from "components/Footer";
import pacImageCommon from "assets/hendlinCommon.jpg";
import { Grid, Grow, makeStyles, Typography } from "@material-ui/core";

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
  const { chainId, provider } = useEthersProvider();

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
          <img style={{'max-width': '400px'}} className={classes.img} alt="PAC Crypto Activism NFT" src={pacImageCommon} />
        </Grow>
      </Grid>


            <Alert severity="error">
              Please install{" "}
              <a href="https://metamask.io/" target="_blank" rel="noreferrer" style={{color: '#000;'}}>
                Metamask
              </a>{" "}
              first.
            </Alert>


          <Typography display="block" style={{ margin: "1rem 0" }} gutterBottom>
<br/>
	<center>	
	  <strong>'The War on Crypto'</strong> features award-winning American artist <strong><a style={{color: '#000'}} href='https://www.rebeccahendin.com/' target='_blank'>Rebecca Hendin</a></strong>, whose art is regularly featured in BBC, and The Guardian. This limited series reflects the current state of US politics and their overarching stranglehold on crypto innovation.

		<br/><br/>
		All funds towards the Action NFT are used to incentivize politicians to advocate for crypto in DC.  Make your voice heard!

		<br/><br/>
		Connect A Web3 Provider Like MetaMask to Learn More
		</center>
		</Typography>

          </Grid>
        )}
        {provider && !isCorrectChain && (


          <Grid container justifyContent="center">


            <Alert severity="error">Please switch to Ethereum Mainnet.</Alert>
          </Grid>
        )}
        {provider && isCorrectChain && <Main />}
      </Container>
      <Footer />
    </React.Fragment>
  );
}

export default App;
