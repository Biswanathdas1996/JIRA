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

export default function OutlinedCard({ index, item }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [repoterImg, setRepoterImg] = useState(null);

  let history = useNavigate();
  useEffect(() => {
    frtchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const frtchData = async () => {
    setLoading(true);
    const ticketAbi = await _fetch("getTokenAbi", index);

    const repoterData = await _fetch("users", item?.repoter);
    setRepoterImg(repoterData?.profileImg);

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

  return (
    <>
      {!loading ? (
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
            <Grid container justify="flex-start">
              <Avatar
                alt="Remy Sharp"
                sx={{
                  width: 25,
                  height: 25,
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
