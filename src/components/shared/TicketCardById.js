import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Avatar, Grid } from "@mui/material";
import Badge from "@mui/material/Badge";
import Type from "../UI/type";
import Priority from "../UI/Priority";
import { useNavigate } from "react-router-dom";
import { _fetch } from "../../CONTRACT-ABI/connect";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { Status, StatusColor } from "../utility/Status";

export default function OutlinedCard({ index, showStatus = false }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [repoterImg, setRepoterImg] = useState(null);
  const [ownerImg, setOwnerImg] = useState(null);
  const [ticketData, setTicketData] = useState(null);

  let history = useNavigate();
  useEffect(() => {
    frtchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const frtchData = async () => {
    setLoading(true);
    const ticket = await _fetch("tickets", index);
    console.log("====ticketData===>>>>", ticket);
    setTicketData(ticket);
    const ticketAbi = await _fetch("getTicketsAbi", ticket?.index);
    const repoterData = await _fetch("users", ticket?.repoter);
    setRepoterImg(repoterData?.profileImg);
    const ownerDataImg = await _fetch("getTicketsOwnerImg", ticket?.index);
    setOwnerImg(ownerDataImg);

    if (ticketAbi) {
      await fetch(ticketAbi)
        .then((response) => response.json())
        .then((data) => {
          setTickets(data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  };

  console.log("=======>>>>", ticketData);
  return (
    <>
      {!loading ? (
        <Card
          style={{ borderRadius: 2, cursor: "pointer" }}
          onClick={() => history(`/ticket/${tickets?.id}`)}
        >
          <CardContent>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{ fontSize: 15, marginBottom: 1, fontWeight: "bold" }}
              >
                {tickets?.name}

                {showStatus && ticketData?.position && (
                  <div
                    className="ticket-status"
                    style={{
                      backgroundColor: StatusColor(ticketData?.position),
                    }}
                  >
                    {Status(ticketData?.position)}
                  </div>
                )}
              </Typography>

              <Avatar
                alt="Owner"
                title="Owner"
                sx={{
                  width: 35,
                  height: 35,
                  borderRadius: "50%",
                }}
                src={ownerImg}
              ></Avatar>
            </div>
          </CardContent>
          <CardActions>
            <Grid container justify="flex-start">
              <Avatar
                alt="Repoter"
                title="Repoter"
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                }}
                src={repoterImg}
              ></Avatar>
            </Grid>
            <Badge
              badgeContent={tickets?.storypoint}
              color="info"
              style={{ marginRight: 15 }}
            ></Badge>
            <Priority priority={tickets?.priority} />
            <Type type={tickets?.type} />
          </CardActions>
        </Card>
      ) : (
        <Card style={{ borderRadius: 2, padding: 10 }}>
          <Stack spacing={1}>
            <Skeleton variant="rectangular" animation="wave" height={118} />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Stack>
        </Card>
      )}
    </>
  );
}
