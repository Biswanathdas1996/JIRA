import React from "react";
import { useParams } from "react-router-dom";
import UpdateTicket from "../components/ViewTicket/UpdateTicket";
import TransferTicket from "../components/ViewTicket/TransferTicket";

const Mint = () => {
  const { tokenId } = useParams();
  return (
    <>
      <UpdateTicket tokenId={tokenId} />
      <TransferTicket tokenId={tokenId} />
    </>
  );
};
export default Mint;
