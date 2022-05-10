import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import TicketCardById from "../../components/shared/TicketCardById";
import { _fetch } from "../../CONTRACT-ABI/connect";

export default function CheckboxListSecondary({ tokenId }) {
  const [tickets, setTickets] = useState(null);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    const allUser = await _fetch("getAllUser");

    let tempUserData = [];
    await allUser.map(async (address) => {
      const result = await _fetch("users", address);
      tempUserData.push(result);
    });

    const allTickets = await _fetch("getAllTickets");
    const filterTicketsForCurrentUser = await allTickets.find(
      (ticket) => ticket.id === tokenId
    );

    if (filterTicketsForCurrentUser?.abiLink) {
      await fetch(filterTicketsForCurrentUser?.abiLink)
        .then((response) => response.json())
        .then((data) => {
          const updatesTicket = { ...data, ...filterTicketsForCurrentUser };
          setTickets(updatesTicket);
        })
        .catch((error) => {});
    }
  };

  const linkedTickets =
    tickets?.linkedStories && JSON.parse(tickets?.linkedStories);

  return (
    <List dense sx={{ width: "100%", marginTop: 3 }}>
      <h4> Dependency</h4>
      {linkedTickets && linkedTickets.length > 0
        ? linkedTickets?.map((value) => {
            return (
              <div style={{ marginBottom: 20 }}>
                <TicketCardById index={value?.index} showStatus={true} />
              </div>
            );
          })
        : "No dependency ticket"}
    </List>
  );
}
