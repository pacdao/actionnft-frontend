import * as React from "react";
import { ethers } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import {
  Button,
  Grid,
  Grow,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";

import { useEthersProvider } from "contexts/EthersContext";
import deploymentMap from "artifacts/deployments/map.json";
import { TYPE } from "constant";
import { getABI } from "utils";
import pacImageRare from "assets/hendlinRare.jpg";
import ProgressBtn from "components/ProgressBtn";
import Alerts from "components/Mint/Alerts";
import RebeccaHendin from "components/RebeccaHendin";
import { abbrAddress } from "utils";
import useStyles from "./useStyles";
import { stateReducer } from "./utils";

const DEPLOYMENT_MAP_ADDRESS = "1";

const address = deploymentMap[DEPLOYMENT_MAP_ADDRESS]["ActionNFTRare"][0];

const MintRareComp = () => {
  const classes = useStyles();
  const { account, provider, signer } = useEthersProvider();

  const [state, dispatch] = React.useReducer(stateReducer, {
    contract: null,
    abi: null,
    blockHash: "",
    bidPrice: "",
    topBidders: [],
    message: "",
    status: null,
  });

  const dispatchSuccess = (payload) => {
    dispatch({
      type: TYPE.success,
      payload,
    });
  };

  const dispatchError = (message) => {
    dispatch({
      type: TYPE.error,
      payload: { message },
    });
  };

  const { abi, bidPrice, contract, topBidders } = state;

  const getTopBidders = React.useCallback(async () => {
    try {
      dispatch({
        type: TYPE.pending,
      });
      const fetchedTopBidders = await Promise.all([
        contract.topBidders(0),
        contract.topBidders(1),
        contract.topBidders(2),
        contract.topBidders(3),
        contract.topBidders(4),
      ]);
      dispatchSuccess({
        topBidders: fetchedTopBidders
          .map((b) => {
            return b.toString();
          })
          .filter((b) => b !== "0,0x0000000000000000000000000000000000000000"),
      });
    } catch (error) {
      console.log("API ERROR fetchedTopBidders", error);
      dispatchError(error.message);
    }
  }, [contract]);

  async function handleBid(evt) {
    evt.preventDefault();
    try {
      dispatch({ type: TYPE.pending, message: "Please be patient, this will take a bit of time." });
      const eth = parseUnits(bidPrice, "ether");
      const wei = formatUnits(eth, "wei");
      const signerContract = new ethers.Contract(address, abi, signer);
      const txResp = await signerContract.bidRare({
        value: wei.toString(),
      });
      const { blockHash } = await txResp.wait();
      getTopBidders();
      dispatchSuccess({ message: `Success, you have placed a bit of ${eth} ETH`, blockHash });
    } catch (error) {
      dispatchError(error.message);
    }
  }

  React.useEffect(() => {
    if (contract) {
      getTopBidders();
    }
  }, [abi, bidPrice, contract, getTopBidders]);

  // onMount
  React.useEffect(() => {
    (async () => {
      try {
        const _abi = await getABI(address, DEPLOYMENT_MAP_ADDRESS);
        const abi = _abi.abi;
        const contract = new ethers.Contract(address, abi, provider);

        dispatchSuccess({
          abi: _abi.abi,
          contract,
        });
      } catch (error) {
        dispatch({ type: TYPE.error, error });
      }
    })();
  }, [provider]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} container justifyContent="center">
        <Grow in disableStrictModeCompat style={{ transformOrigin: "0 0 0 0" }} timeout={1000}>
          <img className={classes.img} alt="PAC Crypto Activism NFT" src={pacImageRare} />
        </Grow>
      </Grid>
      <Grid item xs={12}>
        <Alerts status={state.status} blockHash={state.blockHash} errorMessage={state.errorMessage} />
        <Grid container justifyContent="center" alignItems="stretch" style={{ margin: "16px 0" }}>
          <TextField
            className={classes.textfield}
            label="Your Bid (units of .01)"
            variant="outlined"
            onChange={({ target: { value } }) => {
              dispatchSuccess({ bidPrice: value });
            }}
            disabled={!account}
            value={bidPrice}
          />
          <ProgressBtn
            className={classes.mintBtn}
            variant="contained"
            color="primary"
            size="large"
            loading={state.status === TYPE.pending}
            handleClick={handleBid}
            disabled={!account || state.status === TYPE.pending}
            type="submit"
          >
            Bid
          </ProgressBtn>
        </Grid>
      </Grid>
      <Grid item container xs={12} justifyContent="center">
        <Grid item md={6} xs={12} container direction="column" justifyContent="center" alignItems="center">
          {Array.isArray(topBidders) ? (
            <TableContainer className={classes.table} component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Current top 5 bidders* </TableCell>
                    <TableCell>Amounts (ETH)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topBidders.map((tb) => {
                    const [amount, bidder] = tb.split(",");
                    return (
                      <TableRow key={tb} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell>{abbrAddress(bidder)}</TableCell>
                        <TableCell>{formatUnits(amount)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <caption>
                  *The top five bidders will get to take home a copy of this rare artwork. All else can claim a 100%
                  refund within 30 days of auction end.
                  <br />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginTop: 8 }}
                    onClick={getTopBidders}
                  >
                    Get latest bidders
                  </Button>
                </caption>
              </Table>
            </TableContainer>
          ) : null}
        </Grid>
      </Grid>
      <Grid item container xs={12} justifyContent="center">
        <Grid item md={8} xs={12}>
          <RebeccaHendin />
          <Typography display="block" style={{ margin: "1rem 0" }} gutterBottom>
            Only five top bidders will get to keep the rare version of this NFT. All others can claim a 100% refund.
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MintRareComp;
