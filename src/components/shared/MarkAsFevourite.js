import React, { useState, useEffect } from "react";

import { IconButton } from "@mui/material";

import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";

export default function NFTCard({ tokenId, reload = () => null }) {
  const [fevToken, setFevToken] = useState([]);
  useEffect(() => {
    const myFev = JSON.parse(localStorage.getItem("myFevTokens"));
    setFevToken(myFev);
  }, []);

  const addToFev = (tokenId) => {
    let tokens = [];
    const myFev = JSON.parse(localStorage.getItem("myFevTokens"));
    if (myFev) {
      tokens = myFev;
      if (tokens.find((token) => token === tokenId)) {
        const index = tokens.indexOf(tokenId);
        if (index > -1) {
          tokens.splice(index, 1);
        }
      } else {
        tokens.push(tokenId);
      }
    } else {
      tokens.push(tokenId);
    }
    setFevToken(tokens);
    localStorage.setItem("myFevTokens", JSON.stringify(tokens));
    reload();
  };

  return (
    <>
      <IconButton onClick={() => addToFev(tokenId)}>
        <FavoriteBorderRoundedIcon
          style={{
            borderRadius: "50%",
            padding: "3px",
            color: fevToken?.find((token) => token === tokenId)
              ? "white"
              : "#FD6412",
            backgroundColor: fevToken?.find((token) => token === tokenId)
              ? "#FD6412"
              : "white",
          }}
        />
      </IconButton>
    </>
  );
}
