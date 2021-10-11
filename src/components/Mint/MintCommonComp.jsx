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

  const getCommonPrice = React.useCallback(
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

  const getTotalMinted = React.useCallback(async () => {
    try {
      const fetchedTotalSupply = (await contract.totalSupply()).toString();
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
      const eth = parseUnits(commonPrice, "ether");
      const wei = formatUnits(eth, "wei");
      const contract = new ethers.Contract(address, state.abi, signer);
      const txResp = await contract.mintMany(quantity, { value: wei.toString() });
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
      <Grid item xs={12} container justifyContent="center">
        <Alerts status={state.status} blockHash={state.blockHash} errorMessage={state.errorMessage} />
        <Grid item xs={12} container justifyContent="center" alignItems="stretch">
          <TextField
            label="Your ETH amount"
            variant="outlined"
            style={{ margin: 8 }}
            onChange={() => {}}
            disabled
            value={commonPrice}
          />
          <TextField
            className={classes.textfield}
            label="Quantity"
            variant="outlined"
            style={{ margin: "8px 0" }}
            type="number"
            min="1"
            onChange={async ({ target: { value } }) => {
              try {
                dispatchSuccess({ quantity: value });
                const qty = Number(value);
                if (qty && qty >= 1) {
                  const newMinPrice = await getCommonPrice(value);
                  dispatchSuccess({ commonPrice: newMinPrice });
                } else {
                  dispatchSuccess({ commonPrice: "0" });
                }
              } catch (error) {
                dispatchError(error.message);
                throw error;
              }
            }}
            disabled={!account}
            value={quantity}
          />

          <ProgressBtn
            className={classes.mintBtn}
            style={{ margin: "8px 0" }}
            variant="contained"
            color="primary"
            size="large"
            loading={state.status === TYPE.pending}
            handleClick={handleMint}
            disabled={!account || state.status === TYPE.pending}
            type="submit"
          >
            Mint
          </ProgressBtn>
        </Grid>
      </Grid>
      <Grid item container xs={12} justifyContent="center">
        <Grid item xs={12} container direction="column" justifyContent="center" alignItems="center">
          <Typography display="block" style={{ margin: "1rem 0", textAlign: "center" }} gutterBottom>
            Mint NFT now for <b>{commonPrice} ETH</b>
            <br />
            Total minted so far <b>{totalSupply} of 3000</b>
	    <br/><br/>
	    <em><strong>Eligible for 90% Refund</strong> if the infrastructure bill passes and <br/>no amendment was introduced to remove the crypto language</em>
<br/><br/>
	  Published at <a href='https://etherscan.io/address/0xe60a7825a80509de847ffe30ce2936dfc770db6b' target='_blank'
	  >0xe60a7825a80509de847ffe30ce2936dfc770db6b</a>

          </Typography>
        </Grid>
      </Grid>
      <Grid item container xs={12} justifyContent="center">
        <Grid item md={8} xs={12}>
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
