import { Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { TYPE } from "constant";

const Alerts = ({ status, blockHash, message }) => {
  return (
    <Grid item xs={12} container justifyContent="center">
      <Grid item md={8}>
        {status === TYPE.pending && message && (
          <Alert
            severity="info"
            style={{
              backgroundColor: "lightblue",
              marginBottom: "1rem",
            }}
          >
            {message}
          </Alert>
        )}

        {status === TYPE.success && blockHash && (
          <Alert severity="success" style={{ backgroundColor: "lightGreen", marginBottom: "1rem" }}>
            {message || "Success"}, {blockHash}
          </Alert>
        )}

        {status === TYPE.error && (
          <Alert severity="error" style={{ backgroundColor: "lightsalmon", marginBottom: "1rem" }}>
            {message || "Something went wrong! Ping us in the Discord"}
          </Alert>
        )}
      </Grid>
    </Grid>
  );
};

export default Alerts;
