/* eslint-disable eqeqeq */
import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
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
    await setToken([]);
    const myFev = await JSON.parse(localStorage.getItem("myFevTokens"));
    await setToken(myFev);
    setLoading(false);
  }

  return (
    <Grid container spacing={4}>
      {tokens?.length > 0 ? (
        tokens?.map((item, key) => (
          <Grid item xs={12} sm={6} md={4} key={`feb_${key}`}>
            <NftCard tokenId={item} reload={fetchAllPosts} />
          </Grid>
        ))
      ) : loading ? (
        <Loader count="8" xs={12} sm={3} md={3} lg={3} />
      ) : (
        <NoData text="There is no NFT you like" />
      )}
    </Grid>
  );
};

export default MyCollections;
