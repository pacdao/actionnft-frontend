import * as React from "react";
import { ethers } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { Grid, Grow, TextField, Typography } from "@material-ui/core";

import { useEthersProvider } from "contexts/EthersContext";
import deploymentMap from "artifacts/deployments/map.json";
import { TYPE } from "constant";
import { getABI } from "utils";
import pacImageCommon from "assets/hendlinCommon.jpg";
import ProgressBtn from "components/ProgressBtn";
import Alerts from "components/Mint/Alerts";
import useStyles from "./useStyles";
import { stateReducer } from "./utils";
import RebeccaHendin from "components/RebeccaHendin";

const DEPLOYMENT_MAP_ADDRESS = "1";

const address = deploymentMap[DEPLOYMENT_MAP_ADDRESS]["ActionNFT"][0];

const MintCommonComp = () => {
  const classes = useStyles();
  const { account, provider, signer } = useEthersProvider();

  const [state, dispatch] = React.useReducer(stateReducer, {
    contract: null,
    abi: null,
    blockHash: "",
    commonPrice: "",
    totalSupply: "",
    quantity: "1",
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

  const { contract, commonPrice, quantity, totalSupply } = state;

  const getCommonPriceOld = React.useCallback(
    async (value = 1) => {
      if (value >= 1) {
        try {
          const newMinPrice = (await contract.getCostMany(value))[0];
          return formatUnits(newMinPrice.toString(), 18);
        } catch (error) {
          console.log("API ERROR getCostMany", error);
          throw error;
        }
      }
    },
    [contract]
  );

  const getCommonPrice = React.useCallback(async () => {
    try {
      const fetchedTotalSupply = (await contract.balanceOf(account)).toString();
      return fetchedTotalSupply;
    } catch (error) {
      console.log("API ERROR totalSupply", error);
      throw error;
    }
  }, [contract]);


  const getTotalMinted = React.useCallback(async () => {
    try {
      const fetchedTotalSupply = (await contract.originalMintCount(account)).toString();
      return fetchedTotalSupply;
    } catch (error) {
      console.log("API ERROR totalSupply", error);
      throw error;
    }
  }, [contract]);

  async function handleMint(evt) {
    evt.preventDefault();
    try {
      dispatch({ type: TYPE.pending, message: "Please be patient, this will take a bit of time." });
      const contract = new ethers.Contract(address, state.abi, signer);
      const txResp = await contract.refundAll();
      const { blockHash } = await txResp.wait();
      const [fetchedCommonPrice, fetchedTotalSupply] = await Promise.all([getCommonPrice(), getTotalMinted()]);
      dispatchSuccess({ commonPrice: fetchedCommonPrice, totalSupply: fetchedTotalSupply, blockHash });
    } catch (error) {
      dispatchError(error.message);
    }
  }

  React.useEffect(() => {
    if (contract) {
      (async () => {
        try {
          const [fetchedCommonPrice, fetchedTotalMintedSupply] = await Promise.all([
            getCommonPrice(),
            getTotalMinted(),
          ]);

          dispatchSuccess({
            commonPrice: fetchedCommonPrice,
            totalSupply: fetchedTotalMintedSupply,
          });
        } catch (error) {
          dispatchError(error.message);
          console.log("USEEFFECT API ERROR", error);
        }
      })();
    }
  }, [contract, getCommonPrice, getTotalMinted]);

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
        dispatchError(error.message);
      }
    })();
  }, [provider]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} container justifyContent="center">
        <Grow in disableStrictModeCompat style={{ transformOrigin: "0 0 0 0" }} timeout={1000}>
          <img className={classes.img} alt="PAC Crypto Activism NFT" src={pacImageCommon} />
        </Grow>
      </Grid>

      <Grid item container xs={12} justifyContent="center">
        <Grid item xs={12} container direction="column" justifyContent="center" alignItems="center">
          <Typography display="block" style={{ margin: "1rem 0", textAlign: "center" }} gutterBottom>
            Final Mint Price: <b>0.0792 ETH</b>
            <br />
            Total minted <b>292</b>
	    <br/><br/>
	    <em><strong>Available For 90% Refund</strong>
            <br/>The infrastructure bill passed and no Congressperson introduced an amendment to remove the crypto language</em>.
            <br/>If you still own the same quantity (or more) of original pieces, you can burn them for a 90% refund until December 6.

	  <hr/>
	  <strong>Refund Eligibility</strong>
          </Typography>
        </Grid>
      </Grid>

      <Grid item xs={12} container justifyContent="center">

          Address: {account}
          <br/>
          Total Mint Quantity: {totalSupply}
	  <br/>
	  Current Balance: {commonPrice}
	  <br/>

	<br/>


	{ totalSupply == 0 ? "❌ You Never Minted" : "✅ Total Mint Quantity >0"}<br/>
	{ commonPrice == 0 ? "❌ You Have No Balance" : "✅ Current Balance >0"}<br/>
	{ totalSupply == 0 || commonPrice == 0 || commonPrice < totalSupply ? "❌ Insufficient Balance" : "✅ Balance Matches or Exceeds Mint"}
         
        <Alerts status={state.status} blockHash={state.blockHash} errorMessage={state.errorMessage} />
        <Grid item xs={12} container justifyContent="center" alignItems="stretch">
          <ProgressBtn
            className={classes.mintBtn}
            style={{ margin: "8px 0" }}
            variant="contained"
            color="primary"
            size="large"
            handleClick={handleMint}
            type="submit"
	    disabled={ totalSupply == 0 || commonPrice == 0 || commonPrice < totalSupply }
          >
	    { totalSupply == 0 || commonPrice == 0 || commonPrice < totalSupply ? "Ineligible" : "Refund All"}
          </ProgressBtn>
        </Grid>
      </Grid>
      <Grid item container xs={12} justifyContent="center">
        <Grid item md={8} xs={12}>
	    <em>{ totalSupply == 0 || commonPrice == 0 || commonPrice < totalSupply ? "This button is disabled because your account does not meet the refund criteria.  Please check and correct these criteria, or reach out in the Discord if you need help." : ""}</em>
	  <hr/>
<center>
          <strong>Alternate Instructions</strong>
	  <br/>
	  <em>If this button doesn't work, you can try manually on Etherscan</em>
          <br/>
            1. Visit the write contract section <a href='https://etherscan.io/address/0xe60a7825a80509de847ffe30ce2936dfc770db6b#writeContract'>on Etherscan</a><br/>
            2. Connect your wallet<br/>
            3. Click 'refundAll'<br/>
                <br/> 
            If you have any issues, check our <a href='https://discord.gg/Y95mnqewpb'>Discord</a>.  
               <br/>
          After December 6, refunds will be automatically disabled.

               <br/>
          If you have fewer than your original quantity of NFTs, you will need to restore your balance to burn.

                <br/>
  If you plan to claim your <a href='https://github.com/pacdao/bonus-nft' target='_blank'>free bonus NFT</a>, make sure to do so before burning.


<br/><br/>
                <hr/>

<br/><br/>
	  Published at <a href='https://etherscan.io/address/0xe60a7825a80509de847ffe30ce2936dfc770db6b' target='_blank'
	  >0xe60a7825a80509de847ffe30ce2936dfc770db6b</a>
</center>

          <RebeccaHendin />
          <Typography display="block" style={{ margin: "1rem 0" }} gutterBottom>
            If we succeed, then we've come from nowhere to save cryptocurrency from bureaucratic meddling. If we fail,
            you can burn your common NFTs for a 90% refund for up to 30 days after the session ends or keep them as a
            souvenir.
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MintCommonComp;
