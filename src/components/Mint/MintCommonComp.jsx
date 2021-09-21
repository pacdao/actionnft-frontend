import * as React from "react";
import { ethers } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { Grid, Grow, TextField, Typography } from "@material-ui/core";

import { useEthersProvider } from "contexts/EthersContext";
import deploymentMap from "artifacts/deployments/map.json";
import { TYPE } from "utils";
import pacImageCommon from "assets/hendlinCommon.jpg";
import ProgressBtn from "components/ProgressBtn";
import Alerts from "components/Mint/Alerts";
import { getABI } from "pages/main";
import useStyles from "./useStyles";
import { stateReducer } from "./utils";

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

  const getCommonPrice = React.useCallback(
    async (value = 1) => {
      if (value >= 1) {
        try {
          const newMinPrice = (await state.contract.getCostMany(value))[0];
          return formatUnits(newMinPrice.toString(), 18);
        } catch (error) {
          console.log("API ERROR getCostMany", error);
          throw error;
        }
      }
    },
    [state.contract]
  );

  const getTotalMinted = React.useCallback(async () => {
    try {
      const fetchedTotalSupply = (await state.contract.totalSupply()).toString();
      return fetchedTotalSupply;
    } catch (error) {
      console.log("API ERROR totalSupply", error);
      throw error;
    }
  }, [state.contract]);

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
    if (state.contract) {
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
  }, [state.contract]);

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

  const { commonPrice, quantity, totalSupply } = state;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} container justifyContent="center">
        <Grow in disableStrictModeCompat style={{ transformOrigin: "0 0 0 0" }} timeout={1000}>
          <img className={classes.img} alt="PAC Crypto Activism NFT" src={pacImageCommon} />
        </Grow>
      </Grid>
      <Grid item xs={12}>
        <Alerts status={state.status} blockHash={state.blockHash} errorMessage={state.errorMessage} />
        <Grid container justifyContent="center" alignItems="stretch">
          <TextField
            className={classes.textfield}
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
        <Grid item md={6} xs={12} container direction="column" justifyContent="center" alignItems="center">
          <Typography display="block" style={{ margin: "1rem 0" }} gutterBottom><center>
            Mint NFT now for <b>{commonPrice} ETH</b>
            <br />
            Total minted so far <b>{totalSupply} of 3000</b></center>
	  <br/><br/>
	  <center>
	  <strong>'The War on Crypto'</strong> features award-winning American artist <strong><a style={{color: '#000'}} href='https://www.rebeccahendin.com/' target='_blank'>Rebecca Hendin</a></strong>, whose art is regularly featured in BBC, and The Guardian. This limited series reflects the current state of US politics and their overarching stranglehold on crypto innovation.
	  <a href='https://www.rebeccahendin.com/'><img src='https://pbs.twimg.com/media/E_f3Cr0XsAgtOkR?format=jpg&name=small'/></a>

	  <br/><br/>
	  We are <strong><a href='https://pac.xyz/' target='_blank' style={{color: '#000'}}>PAC DAO</a></strong> and we're bringing <strong><a target='_blank' style={{color: '#000'}} href='https://pacdao.substack.com/p/an-introduction-to-pac-dao'>political activism on chain</a></strong>. We have a mission to <strong><a href='https://pacdao.substack.com/p/the-renaissance-of-expression' target='_blank' style={{color: '#000'}}>effect positive change</a></strong> toward crypto.

	  <br/><br/>
	  All funds from the sale of the NFT go to politicians who provably act to support crypto.  These funds allow us to 
<strong> <a href='https://pacdao.substack.com/p/the-art-of-applying-force' target='_blank' style={{color: '#000'}}> apply leverage</a></strong> toward our goal of removing crypto from the infrastructure bill.
	  <br/><br/>
	  If we succeed, then we've come from nowhere to save cryptocurrency from bureaucratic meddling.  If we fail, you can burn your common NFTs for a 90% refund for up to 30 days after the session ends or keep them as a souvenir.
	</center>
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MintCommonComp;
