import { Typography } from "@material-ui/core";

import HrefLink from "components/HrefLink";

const RebeccaHendin = () => {
  return (
    <>
      <Typography display="block" style={{ textAlign: "center", margin: "2rem 0" }} gutterBottom>
        <strong>'The War on Crypto'</strong> features award-winning American artist{" "}
        <HrefLink href="https://www.rebeccahendin.com/">Rebecca Hendin</HrefLink>, whose art is regularly featured in
        BBC, and The Guardian. This limited series reflects the current state of US politics and their overarching
        stranglehold on crypto innovation.
      </Typography>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <HrefLink isBold={false} href="https://www.rebeccahendin.com/">
          <img
            style={{ width: "100%" }}
            alt="Rebecca Hendin"
            src="https://pbs.twimg.com/media/E_f3Cr0XsAgtOkR?format=jpg&name=small"
          />
        </HrefLink>
      </div>

      <Typography display="block" style={{ textAlign: "center", margin: "2rem 0" }} gutterBottom>
        We are <HrefLink href="https://pac.xyz/">PAC DAO</HrefLink> and we're bringing{" "}
        <HrefLink href="https://pacdao.substack.com/p/an-introduction-to-pac-dao">
          political activism on chain.
        </HrefLink>
        We have a mission to{" "}
        <HrefLink href="https://pacdao.substack.com/p/the-renaissance-of-expression">effect positive change</HrefLink>
        toward crypto.
      </Typography>

      <Typography display="block" style={{ textAlign: "center", marginBottom: "2rem" }} gutterBottom>
        All funds from the sale of the NFT go to politicians who provably act to support crypto. These funds allow us to
        <HrefLink href="https://pacdao.substack.com/p/the-art-of-applying-force">apply leverage</HrefLink>
        toward our goal of removing crypto from the infrastructure bill.
      </Typography>
    </>
  );
};

export default RebeccaHendin;
