import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import Avatars from "./Avatars";
import Badge from "@mui/material/Badge";

export default function OutlinedCard({ title, ticket }) {
  return (
    <Card style={{ borderRadius: 2 }}>
      <CardContent>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontSize: 15, marginBottom: 1, fontWeight: "bold" }}
        >
          {ticket}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
          {title}
        </Typography>
      </CardContent>
      <CardActions>
        <Avatars />
        <Badge
          badgeContent={4}
          color="info"
          style={{ marginRight: 15 }}
        ></Badge>
        <ArrowUpwardIcon sx={{ color: "red" }} fontSize="small" />
        <BookmarkIcon sx={{ color: "green" }} fontSize="small" />
      </CardActions>
    </Card>
  );
}
