import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatars from "./Avatars";
import Badge from "@mui/material/Badge";
import Type from "../UI/type";
import Priority from "../UI/Priority";
import { useNavigate } from "react-router-dom";

export default function OutlinedCard({ item, ticket, data }) {
  const [tickets, setTickets] = useState([]);
  let history = useNavigate();
  useEffect(() => {
    frtchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const frtchData = async () => {
    if (item?.abiLink) {
      await fetch(item?.abiLink)
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          setTickets(data);
        });
    }
  };

  return (
    <Card
      style={{ borderRadius: 2 }}
      onClick={() => history(`/ticket/${tickets?.id}`)}
    >
      <CardContent>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontSize: 15, marginBottom: 1, fontWeight: "bold" }}
        >
          {/* {ticket} */}
          {tickets?.name}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
          {tickets?.title}
        </Typography>
      </CardContent>
      <CardActions>
        <Avatars />
        <Badge
          badgeContent={tickets?.storypoint}
          color="info"
          style={{ marginRight: 15 }}
        ></Badge>

        <Priority priority={tickets?.priority} />
        <Type type={tickets?.type} />
      </CardActions>
    </Card>
  );
}
