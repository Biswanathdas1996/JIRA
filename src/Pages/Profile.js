import React from "react";
import { Container, Typography, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import BackgroundImg from "../assets/images/bckimg.png";
import MyProfileCard from "../components/ProfilePage/MyProfileCard";
import MyTransaction from "../components/ProfilePage/MyTransaction";
import MyWallet from "../components/ProfilePage/MyWallet";
import MyCollections from "../components/ProfilePage/MyCollections";
import MyFavorites from "../components/ProfilePage/MyFavorites";
import TabPanel from "@mui/lab/TabPanel";

const ProfilePage = () => {
  const [value, setValue] = React.useState("2");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div
        style={{
          height: 200,
          width: "100%",
          backgroundImage: `url(${BackgroundImg})`,
        }}
      >
        <Container>
          <Typography
            variant="h5"
            component="h6"
            sx={{ color: "#FFFFFF", pt: 6 }}
          >
            My Profile
          </Typography>
        </Container>
      </div>
      <Container>
        <Grid container spacing={1} justifyContent="space-between">
          <Grid xs={12} md={3.5}>
            <MyProfileCard />
          </Grid>
          <Grid xs={12} md={8.5} mt={5} mb={10}>
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab
                      label="My Wallet"
                      value="1"
                      sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        color: "#000000",
                      }}
                    />
                    <Tab
                      label="My Transactions"
                      value="2"
                      sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        color: "#000000",
                      }}
                    />
                    <Tab
                      label="My Collections"
                      value="3"
                      sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        color: "#000000",
                      }}
                    />
                    <Tab
                      label="My Favourites"
                      value="4"
                      sx={{
                        textTransform: "none",
                        fontWeight: "bold",
                        color: "#000000",
                      }}
                      //   disabled
                    />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <MyWallet />
                </TabPanel>
                <TabPanel value="2">
                  {" "}
                  <MyTransaction />
                </TabPanel>
                <TabPanel value="3">
                  {" "}
                  <MyCollections />
                </TabPanel>
                <TabPanel value="4">
                  {" "}
                  <MyFavorites />
                </TabPanel>
              </TabContext>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ProfilePage;
