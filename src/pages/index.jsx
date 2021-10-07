import * as React from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid, Tab, Tabs } from "@material-ui/core";
import { TabContext, TabPanel } from "@material-ui/lab";

import MintCommonComp from "components/Mint/MintCommonComp";
import MintRareComp from "components/Mint/MintRareComp";
import MintActionNFT2 from "components/Mint/MintActionNFT2";

const useStyles = makeStyles((theme) => ({
  root: {},
  div: { display: "flex", justifyContent: "center" },
  action: {
    marginBottom: "0.75rem",
    [theme.breakpoints.up("md")]: { marginBottom: "2rem" },
  },
}));

const Main = () => {
  const classes = useStyles();
  const [tabValue, setTabValue] = React.useState("2");

  return (
    <Grid className={classes.root} container>
      <Grid item xs={12} container justifyContent="center">
        <div className={`${classes.div} ${classes.action}`}>
          <form>
            <Grid container spacing={2}>
              <Grid container>
                <TabContext value={tabValue}>
                  <Grid item xs={12} container justifyContent="center" alignItems="stretch">
                    <Tabs
                      centered
                      indicatorColor="primary"
                      value={tabValue}
                      onChange={(_, newTabValue) => setTabValue(newTabValue)}
                      aria-label="mint tabs"
                    >
                      <Tab value="0" label="Common" />
                      <Tab value="1" label="Rare" />
                      <Tab value="2" label="Uncommon" />
                    </Tabs>
                  </Grid>
                  <Grid item xs={12}>
                    <TabPanel value="0" index={0}>
                      <MintCommonComp />
                    </TabPanel>
                    <TabPanel value="1" index={1}>
                      <MintRareComp />
                    </TabPanel>
                    <TabPanel value="2" index={2}>
                      <MintActionNFT2 />
                    </TabPanel>
                  </Grid>
                </TabContext>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default Main;
