import React, { useEffect, useState } from "react";
import { Grid, Card, Typography, Tooltip } from "@material-ui/core";
import Box from "@mui/material/Box";
import Web3 from "web3";
import { _account } from "../../CONTRACT-ABI/connect";
const styles = {
  card: {
    height: "180px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    flexDirection: "column",
    paddingLeft: "20px",
    paddingRight: "20px",
    boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.08)",
    borderRadius: "5px",
  },
  typo2: {
    fontWeight: "bold",
    fontSize: "20px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "20rem",
  },
};

const WalledCard = () => {
  const [account, setAccount] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    fetchInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInfo = async () => {
    const web3 = new Web3(window.ethereum);
    // const account = await web3?.eth?.accounts?._provider?.selectedAddress;
    const account = await _account();
    console.log("------account---->", account);
    setAccount(account);
    const networkId = await web3?.eth?.accounts?._ethereumCall?.getNetworkId();
    setNetworkId(networkId);
    const balance = await web3?.eth?.getBalance(account);
    const balnceInETH = await web3?.utils?.fromWei(balance, "ether");
    setBalance(balnceInETH);

    switch (networkId) {
      case 1:
        setNetwork("Mainnet");
        break;
      case 2:
        setNetwork("Morden");
        break;
      case 3:
        setNetwork("Ropsten");
        break;
      case 4:
        setNetwork("Rinkeby");
        break;
      default:
        setNetwork("Unknown");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Card style={styles.card}>
            <Typography>Total Balance</Typography>
            <Typography style={styles.typo2}>
              {parseFloat(Number(balance)).toFixed(2)} ETH
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card style={styles.card}>
            <Typography>My Address</Typography>
            <Tooltip>
              <Typography style={styles.typo2}>{account}</Typography>
            </Tooltip>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card style={styles.card}>
            <Typography>Network Type</Typography>
            <Typography style={styles.typo2}>{network}</Typography>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card style={styles.card}>
            <Typography>Network Id</Typography>
            <Typography style={styles.typo2}>{networkId}</Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WalledCard;
