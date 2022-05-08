import React from "react";
import { useParams } from "react-router-dom";
import UpdateTicket from "../components/ViewTicket/UpdateTicket";
import TransferTicket from "../components/ViewTicket/TransferTicket";
import TicketTimeline from "../components/ViewTicket/TicketTimeline";
import Comments from "../components/ViewTicket/Comments";
import { Grid, Card } from "@mui/material";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

const ViewTicket = () => {
  const { tokenId } = useParams();
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        style={{ marginTop: 20 }}
      >
        <Grid item lg={1} md={1} sm={12} xs={12}></Grid>
        <Grid item lg={7} md={7} sm={12} xs={12}>
          <UpdateTicket tokenId={tokenId} />
        </Grid>
        <Grid item lg={3} md={3} sm={12} xs={12}>
          <TransferTicket tokenId={tokenId} />
        </Grid>
        <Grid item lg={1} md={1} sm={12} xs={12}></Grid>
        <Grid item lg={1} md={1} sm={12} xs={12}></Grid>
        <Grid item lg={10} md={10} sm={12} xs={12}>
          <Card style={{ marginTop: 20 }}>
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="Comments" value="1" />
                    <Tab label="History" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  {" "}
                  <Comments tokenId={tokenId} />
                </TabPanel>
                <TabPanel value="2">
                  <TicketTimeline tokenId={tokenId} />
                </TabPanel>
              </TabContext>
            </Box>
          </Card>
        </Grid>
        <Grid item lg={1} md={1} sm={12} xs={12}></Grid>
      </Grid>
    </>
  );
};
export default ViewTicket;
