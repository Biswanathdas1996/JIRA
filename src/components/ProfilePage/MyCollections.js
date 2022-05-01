/* eslint-disable eqeqeq */
import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import { TabPanel } from "@mui/lab";
import { _fetch, _account } from "../../CONTRACT-ABI/connect";
import NftCard from "../shared/NFT-Card";
import NoData from "../shared/NoData";
import Loader from "../shared/Loader";

const MyCollections = () => {
  const [tokens, setToken] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  async function fetchAllPosts() {
    setLoading(true);
    const getAllToken = await _fetch("getToken");
    const account = await _account();
    console.log(account);
    const tokenOwnedByMe = [];

    await getAllToken.map(async (tokenId) => {
      const owner = await _fetch("ownerOf", tokenId);
      if (account == owner) {
        tokenOwnedByMe.push(tokenId);
        setToken(tokenOwnedByMe);
      }
    });
    setLoading(false);
  }

  return (
    <TabPanel value="3" sx={{ padding: 0, mt: 5 }}>
      <Grid container spacing={4}>
        {tokens.length > 0 ? (
          tokens?.map((item) => (
            <Grid item xs={12} sm={6} md={4}>
              <NftCard tokenId={item} />
            </Grid>
          ))
        ) : loading ? (
          <Loader count="8" xs={12} sm={3} md={3} lg={3} />
        ) : (
          <NoData text="You does noy have any NFT" />
        )}
      </Grid>
    </TabPanel>
  );
};

export default MyCollections;
