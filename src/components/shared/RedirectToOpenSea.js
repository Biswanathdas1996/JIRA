import React from "react";
import { IconButton } from "@mui/material";
import OfflineShareIcon from "@mui/icons-material/OfflineShare";
import Address from "../../CONTRACT-ABI/Address.json";

export default function RedirectToOpenSea({ tokenId }) {
  return (
    <>
      <a
        href={`https://testnets.opensea.io/assets/${Address}/${tokenId}/?force_update=true`}
        target="_blank"
        rel="noreferrer"
        title="View on OpenSea"
      >
        <IconButton>
          <OfflineShareIcon
            style={{
              color: "#0578EC",
              backgroundColor: "white",
              borderRadius: "50%",
              padding: "3px",
              //   fontSize: "15px",
            }}
          />
        </IconButton>
      </a>
    </>
  );
}
