import React from "react";
import { useParams } from "react-router-dom";
import UpdateTicket from "../components/ViewTicket/UpdateTicket";
import TransferTicket from "../components/ViewTicket/TransferTicket";
import TicketTimeline from "../components/ViewTicket/TicketTimeline";
import Comments from "../components/ViewTicket/Comments";
import { Grid } from "@mui/material";
const Mint = () => {
  const { tokenId } = useParams();
  return (
    <>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        style={{ marginTop: 20 }}
      >
        <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <UpdateTicket tokenId={tokenId} />
        </Grid>
        <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
        <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <TransferTicket tokenId={tokenId} />
        </Grid>
        <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
        <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <TicketTimeline tokenId={tokenId} />
        </Grid>
        <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
        <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <Comments tokenId={tokenId} />
        </Grid>
        <Grid item lg={2} md={2} sm={12} xs={12}></Grid>
      </Grid>
    </>
  );
};
export default Mint;
