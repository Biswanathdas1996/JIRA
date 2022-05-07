import * as React from "react";
import List from "@mui/material/List";
import TicketCard from "../../components/shared/TicketCard";
import AssignTickets from "./AssignTickets";

export default function CheckboxListSecondary({ data }) {
  return (
    <List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
      {data?.map((value) => {
        return (
          <div style={{ marginBottom: 10 }}>
            <TicketCard index={value?.index} item={value} />
            <AssignTickets index={value?.index} item={value} />
          </div>
        );
      })}
    </List>
  );
}
