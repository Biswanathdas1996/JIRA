import * as React from "react";
import { Card } from "@mui/material";
import ListOfTickets from "./ListOfTickets";

export default function ListAllSprints({ sprints, tickets }) {
  const filterTicketsForCurrentUser = tickets.filter(
    (ticket) => ticket?.sprintId === ""
  );
  return (
    <div
      style={{
        padding: "20px",
        marginTop: 20,
      }}
    >
      <h4>Backlog</h4>
      <ListOfTickets data={filterTicketsForCurrentUser} sprints={sprints} />
      {filterTicketsForCurrentUser?.length === 0 && (
        <h4 style={{ color: "grey", margin: 10 }}>No story available</h4>
      )}
    </div>
  );
}
