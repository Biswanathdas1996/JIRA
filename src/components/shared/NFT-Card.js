import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Tooltip } from "@mui/material";
import Avatars from "./Avatars";
import { useNavigate } from "react-router-dom";
import { _fetch, _account } from "../../CONTRACT-ABI/connect";
import { buyNft } from "../../functions/buyNft";
import TransctionModal from "./TransctionModal";
import MarkAsFevourite from "./MarkAsFevourite";
import RedirectToOpenSea from "./RedirectToOpenSea";

export default function NFTCard({ tokenId, reload = () => null }) {
  const [nftData, setNftData] = useState(null);
  const [start, setStart] = useState(false);
  const [price, setPrice] = useState(null);
  const [response, setResponse] = useState(null);
  const [owner, setOwner] = useState(null);
  const [account, setAccount] = useState(null);

  let history = useNavigate();

  useEffect(() => {
    fetchNftInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchNftInfo() {
    const getAllTokenUri = await _fetch("tokenURI", tokenId);
    const price = await _fetch("getNftPrice", tokenId);
    setPrice(price);
    const getOwner = await _fetch("ownerOf", tokenId);
    setOwner(getOwner);
    const account = await _account();
    setAccount(account);

    await fetch(getAllTokenUri)
      .then((response) => response.json())
      .then((data) => {
        setNftData(data);
      });
  }

  const buynow = async () => {
    setStart(true);
    const responseData = await buyNft(Number(tokenId));
    setResponse(responseData);
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
  };

  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}

      <Card
        sx={{
          height: "100%",
          // width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          border: "0.01px solid rgba(0, 0, 0, 0.09)",
        }}
      >
        <Tooltip title="Nefrofeel by Pablo Picasso">
          <div
            style={{
              backgroundImage: `url(${nftData?.image})`,
              height: "150px",
              borderRadius: 5,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              margin: "15px 15px 0px 15px",
            }}
          >
            <Grid container>
              <Grid xs={2}>
                <MarkAsFevourite tokenId={tokenId} reload={reload} />
              </Grid>
              <Grid xs={10} sx={{ textAlign: "right" }}>
                <RedirectToOpenSea tokenId={tokenId} />
              </Grid>
            </Grid>
          </div>
        </Tooltip>

        <CardContent style={{ paddingBottom: 0 }}>
          <Avatars />
          <Typography
            style={{ fontSize: 14, cursor: "pointer" }}
            variant="body2"
            paragraph
            item
            fontWeight="600"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "11rem",
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              history(`/details/${tokenId}`);
              return;
            }}
          >
            {nftData?.name} #{tokenId}
          </Typography>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Tooltip title="Ethereum">
              <img
                alt="nft"
                width="10px"
                height="17px"
                src={`https://ethereum.org/static/a183661dd70e0e5c70689a0ec95ef0ba/cdbe4/eth-diamond-purple.webp`}
                style={{ marginRight: 5 }}
              ></img>
            </Tooltip>
            <p>
              <span className="text-secondary" style={{ color: "grey" }}>
                Price{" "}
              </span>
              <strong style={{ fontSize: 12, fontWeight: "bold" }}>
                {price / 1000000000000000000} ETH
              </strong>
            </p>
          </div>
        </CardContent>

        {owner !== account && (
          <Button
            variant="outlined"
            size="small"
            sx={{
              marginX: "15px",
              marginBottom: "15px",
            }}
            onClick={() => buynow()}
            style={{
              border: "2px solid #1976d2",
              fontSize: 10,
              fontWeight: "bold",
              padding: 8,
            }}
          >
            Buy Now
          </Button>
        )}
      </Card>
    </>
  );
}
