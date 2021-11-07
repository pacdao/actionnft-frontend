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
    withdrawableBalance: "",
    topBidderStatus: "",
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

  const { abi, bidPrice, contract, topBidders, withdrawableBalance, topBidderStatus} = state;

  const getWithdrawableBalance = React.useCallback(async () => {
    try {
      const fetchedWithdrawable = (await contract.withdrawableBalance(account)).toString();
      dispatchSuccess({
              withdrawableBalance: fetchedWithdrawable
        }
      );
      console.log(fetchedWithdrawable);
      return fetchedWithdrawable;
    } catch (error) {
      console.log("API ERROR totalSupply", error);
      throw error;
    }
  }, [contract]);


  const getTopBidderStatus = React.useCallback(async () => {
    try {
      const fetchedTopBidderStatus = (await contract.isTopBidder(account)).toString();
      dispatchSuccess({
              topBidderStatus: fetchedTopBidderStatus
        }
      );
      console.log("TB", fetchedTopBidderStatus);
      return fetchedTopBidderStatus;
    } catch (error) {
      console.log("API ERROR totalSupply", error);
      throw error;
    }
  }, [contract]);


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

  async function handleBidOld(evt) {
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

  async function handleBid(evt) {
    evt.preventDefault();
    try {
      dispatch({ type: TYPE.pending, message: "Please be patient, this will take a bit of time." });
      const signerContract = new ethers.Contract(address, abi, signer);
      const txResp = await signerContract.withdraw();
      const { blockHash } = await txResp.wait();
      getTopBidders();
      dispatchSuccess({ message: `Success, your withdrawl has processed`, blockHash });
    } catch (error) {
      dispatchError(error.message);
    }
  }

  React.useEffect(() => {
    if (contract) {
      getTopBidders();
      getWithdrawableBalance();
      getTopBidderStatus();
    }
  }, [abi, bidPrice, contract, getTopBidders, withdrawableBalance, topBidderStatus]);

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
      <Grid item container xs={12} justifyContent="center">
        <Grid item md={6} xs={12} container direction="column" justifyContent="center" alignItems="center">
          {Array.isArray(topBidders) ? (
            <TableContainer className={classes.table} component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Winners</TableCell>
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
                  *The top five bidders received a copy of this rare artwork. All else can claim a 100%
                  refund within 30 days of auction end.
                  <br />
                 
                </caption>
              </Table>
            </TableContainer>
          ) : null}

	  <br/><br/>
	  Published at 0xd56c12efd06252f1f0098a8fe517da286245c0a8
          <a href='https://etherscan.io/address/0xd56c12efd06252f1f0098a8fe517da286245c0a8' target='_blank'>&bull; Etherscan</a>
          <a href='https://opensea.io/collection/pacdao-action-nft-rare'>&bull; OpenSea</a>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Alerts status={state.status} blockHash={state.blockHash} errorMessage={state.errorMessage} />
        <Grid container justifyContent="center" alignItems="stretch" style={{ margin: "16px 0" }}>
        

          <Typography>
          <strong>Your Results</strong><br/>
          Address: {account}<br/>

          Balance (Wei): {withdrawableBalance} 
          <br/>
          Auction Winner: {topBidderStatus} 
          <br/><br/>
          <hr/>
          <strong>Refund</strong>
          <br/>
          If you placed a bid and lost, you can withdraw all your money until December 6.
          <br/><br/>
       <strong>Refund Criteria</strong> <br/>
	{ topBidderStatus == true ? "❌ You Won" : "✅ You Did Not Win"}<br/>
	{ withdrawableBalance == 0 ? "❌ You Have No Balance to Withdraw" : "✅ You Have a Withdrawable Balance"}<br/>
        { withdrawableBalance == 0 || topBidderStatus == true ? "❌ You Cannot Refund" :  "✅ You May Withdraw" }
          </Typography>
        </Grid>
        <Grid container justifyContent="center" alignItems="stretch" style={{ margin: "16px 0" }}>
          <ProgressBtn
            className={classes.mintBtn}
            variant="contained"
            color="primary"
            size="large"
            loading={state.status === TYPE.pending}
            handleClick={handleBid}
            disabled={topBidderStatus == true || withdrawableBalance == 0}
            type="submit"
          >
            Refund
          </ProgressBtn>
        </Grid>
        <Grid container justifyContent="center" alignItems="stretch" style={{ margin: "16px 0" }}>

        { withdrawableBalance == 0 || topBidderStatus == true ? "You are ineligible for a refund so this button is disabled.  If you think this is in error please contact us in Discord" :  "" }
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
