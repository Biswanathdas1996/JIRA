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
export default function OutlinedCard({ title }) {
  return (
    <Card style={{ borderRadius: 2 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
          {title}
        </Typography>
      </CardContent>
      <CardActions>
        <Avatars />
        <ArrowUpwardIcon sx={{ color: "red" }} fontSize="small" />
        <BookmarkIcon sx={{ color: "green" }} fontSize="small" />
      </CardActions>
    </Card>
  );
}
