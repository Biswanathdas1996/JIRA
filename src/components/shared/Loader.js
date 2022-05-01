import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { Grid } from "@mui/material";

export default function Variants({ count, itemPerRow, xs, sm, md, lg }) {
  let items = [];
  for (let i = 0; i < count; i++) {
    items.push(i);
  }
  return (
    <Grid container spacing={4}>
      {items.map((data, index) => (
        <Grid item xs={xs} sm={sm} md={md} lg={lg} key={index}>
          <Stack spacing={1}>
            <Skeleton variant="text" animation="wave" />
            <Skeleton variant="rectangular" animation="wave" height={118} />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
}
